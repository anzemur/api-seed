import { Controller } from './ctrl';
import { User } from '../models/user-mod';
import { AuthenticationService } from '../services/authentication-service';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { NextFunction } from 'express';
import { BadRequestError, InternalServerError, ConflictError, UnauthenticatedError, ValidationError, InternalOAuthError, UnauthorizedError, NotFoundError } from '../lib/errors';
import { MailingService } from '../services/mailing-service';
import { registrationEmailTemplate } from '../res/templates/registration-email';
import { isRequestBodyEmpty } from '../lib/validators';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { PassportAuthStrategyType, UserRoles } from '../config/types';
import { registrationRequestSchema } from '../config/body-schemas';
import { HttpStatusCodes } from '../config/http-status-codes';
import { forgottenPasswordTemplate } from '../res/templates/forgotten-password-email';
import passport from 'passport';
import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import { changeEmailTemplate } from '../res/templates/change-email-request-email';
import { changeUsernameTemplate } from '../res/templates/change-username-request-email';

/**
 * Authentication controller.
 */
export class AuthenticationController extends Controller {

   /* Register services. */
   private authenticationService: AuthenticationService;
   private mailingService: MailingService;
 
   constructor() {
     super(AuthenticationController.name);
     this.authenticationService = new AuthenticationService();
     this.mailingService = MailingService.getInstance();
   }

  /**
   * Checks if user can be authenticated using Facebook auth and generates authentication token.
   */
  @BoundMethod
  public async facebookAuth(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    if (req.context.adminConfig && !req.context.adminConfig.allowFacebookAuth) {
      return next(new UnauthorizedError('Facebook authentication is not allowed.'));
    }

    const body = req.body;
    if (!body || !body.access_token) {
      return next(new BadRequestError('Request body is missing `access_token`.'));
    }

    await passport.authenticate(PassportAuthStrategyType.FACEBOOK, (error, user, data) => {
      /* If invalid `access_token` is provided `error` is passed as `data` parameter. */
      if (data && data.name === 'InternalOAuthError') {
        error = data;
      }

      if (error) {
        if (error.name === 'InternalOAuthError') {
          return next(new InternalOAuthError(
            error.oauthError && error.oauthError.statusCode ? error.oauthError.statusCode : 500,
            error.message || 'Failed to fetch user profile.',
            error.oauthError && error.oauthError.data ? error.oauthError.data : ''
          ));
        } else {
          return next(new InternalServerError('There was a problem while performing Facebook authorization.', error));
        }
      }

      /* Authenticate user and generate JWT. */
      if (user) {
        return res.return(HttpStatusCodes.OK, {
          user,
          authToken: this.authenticationService.generateAuthToken(user.id)
        });
      }
    }) (req, res);
  }

  /**
   * Checks if user can be authenticated using Google auth and generates authentication token.
   */
  @BoundMethod
  public async googleAuth(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    if (req.context.adminConfig && !req.context.adminConfig.allowGoogleAuth) {
      return next(new UnauthorizedError('Google authentication is not allowed.'));
    }

    const body = req.body;
    if (!body || !body.access_token) {
      return next(new BadRequestError('Request body is missing `access_token`.'));
    }

    await passport.authenticate(PassportAuthStrategyType.GOOGLE, (error, user, data) => {
      /** If invalid `access_token` is provided `error` is passed as `data` parameter. */
      if (data && data.name === 'InternalOAuthError') {
        error = data;
      }

      if (error) {
        if (error.name === 'InternalOAuthError') {
          return next(new InternalOAuthError(
            error.oauthError && error.oauthError.statusCode ? error.oauthError.statusCode : 500,
            error.message || 'Failed to fetch user profile.',
            error.oauthError && error.oauthError.data ? error.oauthError.data : ''
          ));
        } else if (error instanceof BadRequestError) {
          next(error);
        } else {
          return next(new InternalServerError('There was a problem while performing Google authorization.', error));
        }
      }

      /* Authenticate user and generate JWT. */
      if (user) {
        return res.return(HttpStatusCodes.OK, {
          user,
          authToken: this.authenticationService.generateAuthToken(user.id)
        });
      }
    }) (req, res);
  }

  /**
   * Checks if user can be authenticated and generates authentication token.
   */
  @BoundMethod
  public async localAuth(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    if (!body.usernameOrEmail || !body.password) {
      return next(new BadRequestError('Username/email or password is missing.'));
    }

    const response = await this.authenticationService.checkAuthUser(body.usernameOrEmail, body.password);
    if (!response) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    if (!response.isAuthenticated || !response.user) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    const authToken = this.authenticationService.generateAuthToken(response.user.id);
    if (!authToken) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }
    delete response.user.password;

    return res.return(HttpStatusCodes.OK, {
      user: response.user,
      authToken
    });
  }

   /**
   * Checks if admin can be authenticated and generates authentication token.
   */
  @BoundMethod
  public async adminAuth(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    if (!body.usernameOrEmail || !body.password) {
      return next(new BadRequestError('Username/email or password is missing.'));
    }

    const response = await this.authenticationService.checkAuthUser(body.usernameOrEmail, body.password);
    if (!response) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    if (!response.isAuthenticated || !response.user) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    if (response.user.roles.indexOf(UserRoles.ADMIN) === -1) {
      return next(new UnauthorizedError('You are not allowed to log in as admin.'));
    }

    const authToken = this.authenticationService.generateAuthToken(response.user.id);
    if (!authToken) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }
    delete response.user.password;

    return res.return(HttpStatusCodes.OK, {
      user: response.user,
      authToken
    });
  }

  /**
   * Generate and sends new registration token to given user.
   */
  @BoundMethod
  public async registrationRequest(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    const { error } = Joi.validate(body, registrationRequestSchema, { abortEarly: false });
    if (error) {
      return next(new ValidationError('Request body validation failed.', error));
    }

    const existingUsers = await User.find({ $or: [ { username: body.username }, { email: body.email } ] });
    const conflicts = [];

    if (existingUsers.length > 0) {
      for (const conflictUser of existingUsers) {
        if (conflictUser.username === body.username) {
          conflicts.push('username');
        }
        if (conflictUser.email === body.email) {
          conflicts.push('email');
        }
      }
      return next(new ConflictError(conflicts, 'User with given data already exists.'));
    }

    const passwordHash = bcrypt.hashSync(body.password || '', bcrypt.genSaltSync(10));
    const registrationToken = this.authenticationService.generateRegistrationToken(
      body.username,
      body.email,
      passwordHash,
      body.firstName,
      body.lastName,
    );

    if (!registrationToken) {
      return next(new BadRequestError('Invalid registration token.'));
    }

    const emailData = {
      from: process.env.SMTP_USERNAME,
      to: body.email,
      subject: 'Registration.',
      html: registrationEmailTemplate(registrationToken)
    };

    const response = await this.mailingService.sendMail(emailData);
    if (response) {
      res.return(HttpStatusCodes.OK, {
        message: 'Registration email successfully sent.'
      });
    } else {
      return next(new InternalServerError('There was an error while sending registration email.'));
    }
  }

  /**
   * Changes users password.
   */
  @BoundMethod
  public async changePassword(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;
    const user = req.context.user;

    const correctPass = await this.authenticationService.comparePassword(user.password, body.password);
    if (!correctPass) {
      return next(new UnauthenticatedError('Password is incorrect.'));
    }

    const passwordHash = bcrypt.hashSync(body.newPassword || '', bcrypt.genSaltSync(10));
    try {
      const response = await User.updateOne({ _id: user.id }, { password: passwordHash });
      res.return(HttpStatusCodes.OK, {
        successful: !!(response.n && response.nModified && response.ok)
      });
    } catch (error) {
      next(new InternalServerError('There was a problem while changing password.', error));
    }
  }

  /**
   * Sends email with reset password token to email if user exists in database.
   */
  @BoundMethod
  public async forgottenPasswordRequest(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    try {
      const user = await User.findOne({ email: body.email });
      if (!user) {
        return next(new NotFoundError('User with this email doesn\'t exists.'));
      }
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting user.', error));
    }

    const forgottenPasswordToken = this.authenticationService.generateForgottenPasswordToken(body.email);
    if (!forgottenPasswordToken) {
      return next(new BadRequestError('Invalid forgotten password token.'));
    }

    const emailData = {
      from: process.env.SMTP_USERNAME,
      to: body.email,
      subject: 'Forgotten password.',
      html: forgottenPasswordTemplate(forgottenPasswordToken)
    };

    const response = await this.mailingService.sendMail(emailData);
    if (response) {
      res.return(HttpStatusCodes.OK, {
        message: 'Forgotten password email successfully sent.'
      });
    } else {
      return next(new InternalServerError('There was an error while sending forgotten password email.'));
    }
  }

  /**
   * Reset users password.
   */
  @BoundMethod
  public async resetPassword(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    const parsedToken = this.authenticationService.parseForgottenPasswordToken(req.body.forgottenPasswordToken);
    if (!parsedToken) {
      return next(new BadRequestError('Invalid forgotten password token.'));
    }

    const passwordHash = bcrypt.hashSync(body.password || '', bcrypt.genSaltSync(10));
    try {
      const response = await User.updateOne({ email: parsedToken.email }, { password: passwordHash});
      res.return(HttpStatusCodes.OK, {
        successful: !!(response.n && response.nModified && response.ok)
      });
    } catch (error) {
      next(new InternalServerError('There was a problem while resetting password.', error));
    }
  }

  
  /**
   * Sends email with change email token to user.
   */
  @BoundMethod
  public async changeEmailRequest(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    const existingUsers = await User.find({ email: body.email });
    if (existingUsers.length > 0) {
      return next(new ConflictError(['email'], 'User with given data already exists.'));
    }

    const changeEmailToken = this.authenticationService.generateChangeEmailToken(req.context.user.id, body.email);
    if (!changeEmailToken) {
      return next(new BadRequestError('Invalid change email token.'));
    }

    const emailData = {
      from: process.env.SMTP_USERNAME,
      to: req.context.user.email,
      subject: 'Change email.',
      html: changeEmailTemplate(changeEmailToken)
    };

    const response = await this.mailingService.sendMail(emailData);
    if (response) {
      res.return(HttpStatusCodes.OK, {
        message: 'Change email request email successfully sent.'
      });
    } else {
      return next(new InternalServerError('There was an error while sending change email request email.'));
    }
  }

  /**
   * Changes users email.
   */
  @BoundMethod
  public async changeEmail(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    const parsedToken = this.authenticationService.parseChangeEmailToken(body.changeEmailToken);
    if (!parsedToken) {
      return next(new BadRequestError('Invalid change email token.'));
    }

    const existingUsers = await User.find({ email: parsedToken.email });
    if (existingUsers.length > 0) {
      return next(new ConflictError(['email'], 'User with given data already exists.'));
    }

    try {
      const response = await User.updateOne({ _id: parsedToken.id }, { email: parsedToken.email });
      res.return(HttpStatusCodes.OK, {
        successful: !!(response.n && response.nModified && response.ok)
      });
    } catch (error) {
      next(new InternalServerError('There was a problem while changing email.', error));
    }
  }

  /**
   * Sends email with change username token to user.
   */
  @BoundMethod
  public async changeUsernameRequest(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    const existingUsers = await User.find({ username: body.username });
    if (existingUsers.length > 0) {
      return next(new ConflictError(['username'], 'User with given data already exists.'));
    }

    const changeUsernameToken = this.authenticationService.generateChangeUsernameToken(req.context.user.id, body.username);
    if (!changeUsernameToken) {
      return next(new BadRequestError('Invalid change username token.'));
    }

    const emailData = {
      from: process.env.SMTP_USERNAME,
      to: req.context.user.email,
      subject: 'Change username.',
      html: changeUsernameTemplate(changeUsernameToken)
    };

    const response = await this.mailingService.sendMail(emailData);
    if (response) {
      res.return(HttpStatusCodes.OK, {
        message: 'Change username request email successfully sent.'
      });
    } else {
      return next(new InternalServerError('There was an error while sending change username request email.'));
    }
  }

  /**
   * Changes users username.
   */
  @BoundMethod
  public async changeUsername(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    const parsedToken = this.authenticationService.parseChangeUsernameToken(body.changeUsernameToken);
    if (!parsedToken) {
      return next(new BadRequestError('Invalid change username token.'));
    }

    const existingUsers = await User.find({ username: parsedToken.username });
    if (existingUsers.length > 0) {
      return next(new ConflictError(['username'], 'User with given data already exists.'));
    }

    try {
      const response = await User.updateOne({ _id: parsedToken.id }, { username: parsedToken.username });
      res.return(HttpStatusCodes.OK, {
        successful: !!(response.n && response.nModified && response.ok)
      });
    } catch (error) {
      next(new InternalServerError('There was a problem while changing username.', error));
    }
  }
}
