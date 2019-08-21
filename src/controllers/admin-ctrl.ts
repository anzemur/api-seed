import { Controller } from './ctrl';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { AdminService } from '../services/admin-service';
import { NextFunction} from 'express';
import { InternalServerError } from '../lib/errors';
import { AdminConfig } from '../models/admin-config-mod';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { HttpStatusCodes } from '../config/http-status-codes';

/**
 * Admin controller.
 */
export class AdminController extends Controller {

  /* Register services. */
  adminService: AdminService;

  constructor() {
    super(AdminController.name);
    this.adminService = new AdminService();
  }

  /**
   * Returns admin config.
   */
  @BoundMethod
  public async getAdminConfig(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const { config, error } = await this.adminService.getAdminConfig();
    if (config) {
      res.return(HttpStatusCodes.OK, config);
    } else {
      return next(error ? error : new InternalServerError('There was a problem while getting admin config.'));
    }
  }

  /**
   * Updates admin config.
   */
  @BoundMethod
  public async updateAdminConfig(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const body = req.body;

    try {
      const config = await AdminConfig.findOneAndUpdate(
        { _id: req.context.adminConfig._id },
        { $set: body },
        { new: true, runValidators: true }
      );
      if (config) {
        res.return(HttpStatusCodes.OK, config);
      } else {
        return next(new InternalServerError('There was a problem while updating admin config.'));
      }
    } catch (error) {
      return next(new InternalServerError('There was a problem while updating admin config.', error));
    }
  }
}
