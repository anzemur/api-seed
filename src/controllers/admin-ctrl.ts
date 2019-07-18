import { Controller } from './ctrl';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { AdminService } from '../services/admin-service';
import { Request, Response, NextFunction} from 'express';
import { MailingService } from '../services/mailing-service';
import { InternalServerError } from '../lib/errors';
import { AdminConfig } from '../models/admin-config-model';
import { AuthRequest } from '../middleware/authentication';

/**
 * Admin controller.
 */
export class AdminController extends Controller {

  /* Register services. */
  adminService: AdminService;
  mailingService: MailingService;

  constructor() {
    super();
    this.adminService = new AdminService();
    this.mailingService = MailingService.getInstance();
  }

  /**
   * Returns admin config.
   */
  @BoundMethod
  public async getAdminConfig(req: Request, res: Response, next: NextFunction) {
    const { config, error } = await this.adminService.getAdminConfig();
    if (config) {
      res.status(200).json(config);
    } else {
      return next(error ? error : new InternalServerError('There was a problem while getting admin config.'));
    }
  }

  /**
   * Updates admin config.
   */
  @BoundMethod
  public async updateAdminConfig(req: AuthRequest, res: Response, next: NextFunction) {
    const body = req.body;

    try {
      const config = await AdminConfig.findOneAndUpdate(
        { _id: req.context.adminConfig._id },
        { $set: body },
        { new: true, runValidators: true }
      );
      if (config) {
        res.status(200).json(config);
      } else {
        return next(new InternalServerError('There was a problem while updating admin config.'));
      }
    } catch (error) {
      return next(new InternalServerError('There was a problem while updating admin config.', error));
    }
  }
}
