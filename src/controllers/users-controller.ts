import { Controller } from './controller';
import { User } from '../models/user-model';
import { AuthenticationService } from '../services/authentication-service';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as bcrypt from 'bcryptjs';
import { registrationRequestSchema, changePasswordSchema } from './requests/users';
import { BadRequestError, InternalServerError, ConflictError, UnauthenticatedError, ValidationError, InternalOAuthError } from '../lib/errors';
import { UserStatus, UserRoles } from '../config/user';
import { MailingService } from '../services/mailing-service';
import { registrationEmailTemplate } from '../res/templates/registration-email';
import { isRequestBodyEmpty } from '../lib/validators';
import { AuthRequest } from '../middleware/authentication';
import passport from 'passport';

/* Register services.*/
const authService = new AuthenticationService();

/**
 * Users controller.
 */
export class UsersController extends Controller {

   /**
   * Checks if user can be authenticated using Facebook auth and generates authentication token. 
   * @param req Express request instance.
   * @param res Express response instance.
   * @param next Express next function instance.
   */
  public async facebookAuth(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (!body || !body.access_token) {
      return next(new BadRequestError('Request body is missing `access_token`.'));
    }

    await passport.authenticate('facebook-token', (error, user, data) => {
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
        return res.status(200).json({
          user: user,
          authToken: authService.generateAuthToken(user.id)
        });
      }

      console.log(error);
      console.log(user);
    }) (req, res);
  }

  /**
   * Checks if user can be authenticated and generates authentication token.
   * @param req Express request instance.
   * @param res Express response instance.
   * @param next Express next function instance.
   */
  public async logInRequest(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    if (!body.usernameOrEmail || !body.password) {
      return next(new BadRequestError('Username/email or password is missing.'));
    }

    const response = await authService.checkAuthUser(body.usernameOrEmail, body.password);
    if (!response) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    if (!response.isAuthenticated || !response.user) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    const authToken = authService.generateAuthToken(response.user.id);
    if (!authToken) {
      return next(new UnauthenticatedError('Incorrect username/email or password.'));
    }

    delete response.user.password;

    return res.status(200).json({
      user: response.user,
      authToken
    });
  }

  /**
   * Generate and sends new registration token to given user.
   * @param req Express request instance.
   * @param res Express response instance.
   * @param next Express next function instance.
   */
  public async registrationRequest(req: Request, res: Response, next: NextFunction) {
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
    const registrationToken = authService.generateRegistrationToken(
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
      text: '',
      html: registrationEmailTemplate(registrationToken)
    };

    const mailingService = new MailingService();
    const response = await mailingService.sendMail(emailData);
    if (response) {
      res.status(200).json({
        message: 'Registration email successfully sent.'
      });
    } else {
      return next(new InternalServerError('There was an error while sending registration email.'));
    }
  }

  /**
   * Creates new user from valid registration token.
   * @param req Express request instance.
   * @param res Express response instance.
   * @param next Express next function instance.
   */
  public async createNewUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body.registrationToken) {
      return next(new BadRequestError('Registration token is missing.'));
    }

    const parsedToken = authService.parseRegistrationToken(req.body.registrationToken);
    if (!parsedToken) {
      return next(new BadRequestError('Invalid registration token.'));
    }

    const existingUsers = await User.find({ $or: [ { username: parsedToken.username }, { email: parsedToken.email } ] });
    const conflicts = [];

    if (existingUsers.length > 0) {
      for (const conflictUser of existingUsers) {
        if (conflictUser.username === parsedToken.username) {
          conflicts.push('username');
        }
        if (conflictUser.email === parsedToken.email) {
          conflicts.push('email');
        }
      }
      return next(new ConflictError(conflicts, 'User with given data already exists.'));
    }

    const user = new User({
      username: parsedToken.username,
      email: parsedToken.email,
      password: parsedToken.passwordHash,
      firstName: parsedToken.firstName,
      lastName: parsedToken.lastName,
      status: UserStatus.ACTIVE,
      roles: [UserRoles.USER],
    });

    try {
      await user.save();
      delete user.password;
      res.status(201).json({
        user
      });
    } catch (error) {
      return next(new InternalServerError('There was a problem while creating new user.', error));
    }
  }

  /**
   * Changes users password.
   * @param req Express request instance.
   * @param res Express response instance.
   * @param next Express next function instance.
   */
  public async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    const body = req.body;
    const user = req.context.user;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    const { error } = Joi.validate(body, changePasswordSchema, { abortEarly: false });
    if (error) {
      return next(new ValidationError('Request body validation failed.', error));
    }

    const correctPass = await authService.comparePassword(user.password, body.password);
    if (!correctPass) {
      return next(new UnauthenticatedError('Password is incorrect.'));
    }

    const passwordHash = bcrypt.hashSync(body.newPassword || '', bcrypt.genSaltSync(10));
    try {
      const response = await User.update({ _id: user.id }, { password: passwordHash});
      res.status(200).json({
        successful: !!(response.n && response.nModified && response.ok)
      });
    } catch (error) {
      next(new InternalServerError('There was a problem while changing password.', error));
    }
  }
}
