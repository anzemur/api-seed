import { Controller } from './ctrl';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { NextFunction} from 'express';
import { MailingService } from '../services/mailing-service';
import { InternalServerError, UnauthorizedError, NotFoundError } from '../lib/errors';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { HttpStatusCodes } from '../config/http-status-codes';
import { AuthenticationService } from '../services/authentication-service';
import { ObjectId } from 'bson';
import { User } from '../models/user-model';

export class UserController extends Controller {

  /* Register services. */
  authenticationService: AuthenticationService;
  mailingService: MailingService;

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
        { _id: new ObjectId(userId) },
        { $set: body },
        { new: true, runValidators: true }
      );

      if (user) {
        res.return(HttpStatusCodes.OK, user);
      } else {
        return next(new NotFoundError('User doesn\'t exists.'));
      }
      
    } catch (error) {
      return next(new InternalServerError('There was a problem while updating admin config.', error));
    }
  }
}
