import { Service } from './service';
import { AdminConfig, AdminConfigModel } from '../models/admin-config-model';

export class AdminService extends Service {

  constructor() {
    super(AdminService.name);
  }

  /**
   * Returns admin config from DB.
   */
  async getAdminConfig(): Promise<AdminConfigModel> {
    return AdminConfig.findOne();
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
