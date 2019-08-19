import { Controller } from './ctrl';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { NextFunction} from 'express';
import { MailingService } from '../services/mailing-service';
import { InternalServerError, UnauthorizedError, NotFoundError } from '../lib/errors';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { HttpStatusCodes } from '../config/http-status-codes';
import { AuthenticationService } from '../services/authentication-service';
import { User } from '../models/user-model';
import { toObjectId } from '../lib/parsers';

export class UsersController1 extends Controller {

  /* Register services. */
  private authenticationService: AuthenticationService;
  private mailingService: MailingService;

  constructor() {
    super();
    this.authenticationService = new AuthenticationService();
    this.mailingService = MailingService.getInstance();
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

      res.return(200, logs, {
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

    if (userId !== req.context.user.id) {
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
