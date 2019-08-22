import { Controller } from './ctrl';
import { User } from '../models/user-mod';
import { AuthenticationService } from '../services/authentication-service';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { NextFunction } from 'express';
import { BadRequestError, InternalServerError, ConflictError, UnauthorizedError, NotFoundError } from '../lib/errors';
import { UserStatus, UserRoles } from '../config/types';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { toObjectId } from '../lib/parsers';
import { HttpStatusCodes } from '../config/http-status-codes';

/**
 * Users controller - CRUD operations on users.
 */
export class UsersController extends Controller {

   /* Register services. */
   private authenticationService: AuthenticationService;
 
   constructor() {
     super(UsersController.name);
     this.authenticationService = new AuthenticationService();
   }

  /**
   * Creates new user from valid registration token.
   */
  @BoundMethod
  public async createNewUser(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    if (!req.body.registrationToken) {
      return next(new BadRequestError('Registration token is missing.'));
    }

    const parsedToken = this.authenticationService.parseRegistrationToken(req.body.registrationToken);
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
      res.return(HttpStatusCodes.Created, user);
    } catch (error) {
      return next(new InternalServerError('There was a problem while creating new user.', error));
    }
  }

  /**
   * Get user by userId.
   */
  @BoundMethod
  public async getUser(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const userId = req.params.userId;

    if (userId !== req.context.user.id) {
      return next(new UnauthorizedError('You are not authorized to read this user data.'));
    }

    try {
      const user = await User.findById(userId);
      if (user) {
        res.return(HttpStatusCodes.OK, user);
      } else {
        return next(new NotFoundError('User doesn\'t exists.'));
      }
      
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting user.', error));
    }
  }

  /**
   * Get paginated list of users.
   */
  @BoundMethod
  public async getUsers(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    query.limit = query.limit ? Number(query.limit) : 25;
    query.page = query.page ? Number(query.page) : 0;

    const $match = {
      $and: [
        { ...(query.userId ? { _id: toObjectId(query.userId) } : {}) },
        { ...(query.email ? { email: query.email } : {}) },
        { ...(query.role ? { roles: query.role } : {}) },
      ],
    };

    try {
      const logs = await User.aggregate([
        { $match },
        { $sort : { createdAt : -1 } },
        { $limit: query.limit * query.page  + query.limit },
        { $skip: query.limit * query.page },
      ]);
      const count = await User.countDocuments($match);

      res.return(HttpStatusCodes.OK, logs, {
        totalRecords: count,
        page        : query.page,
        totalPages  : Math.ceil(count / query.limit),
        perPage     : query.limit
      });
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting users.', error));
    }
  }

  /**
   * Updates user.
   */
  @BoundMethod
  public async updateUser(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;
    const userId = req.params.userId;

    if (userId !== req.context.user.id && req.context.user.roles.indexOf(UserRoles.ADMIN) === -1) {
      return next(new UnauthorizedError('You are not authorized to update this user.'));
    }

    try {
      const user = await User.findOneAndUpdate(
        { _id: toObjectId(userId) },
        { $set: body },
        { new: true, runValidators: true }
      );

      if (user) {
        res.return(HttpStatusCodes.OK, user);
      } else {
        return next(new NotFoundError('User doesn\'t exists.'));
      }
      
    } catch (error) {
      return next(new InternalServerError('There was a problem while updating user.', error));
    }
  }

  /**
   * Deletes user.
   */
  @BoundMethod
  public async deleteUser(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const userId = req.params.userId;

    try {
      const user = await User.findByIdAndDelete(
        { _id: toObjectId(userId) },
      );

      if (user) {
        res.return(HttpStatusCodes.NoContent, user);
      } else {
        return next(new NotFoundError('User doesn\'t exists.'));
      }
      
    } catch (error) {
      return next(new InternalServerError('There was a problem while deleting user.', error));
    }
  }
}
