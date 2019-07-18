import { Service } from './service';
import { AdminConfig, AdminConfigModel } from '../models/admin-config-model';
import { InternalServerError } from '../lib/errors';

export class AdminService extends Service {

  constructor() {
    super(AdminService.name);
  }

  /**
   * Returns admin config from db.
   */
  async getAdminConfig(): Promise<{ config: AdminConfigModel, error?: any}> {
    try {
      const config = await AdminConfig.findOne();
      if (config) {
        return { config };
      } else {
        return {
          config: null,
          error: new InternalServerError('There was a problem while getting admin config.')
        };
      }
    } catch (error) {
      return {
        config: null,
        error: new InternalServerError('There was a problem while getting admin config.', error)
      };
    }
  }

  async createAdminConfig(data: any): Promise<AdminConfigModel> {    
    const config = new AdminConfig(data);
    try {
      await config.save();
      return config;
    } catch (error) {
      throw new Error(`There was a problem while creating new admin config: ${error}.`);
    }
  }

}
