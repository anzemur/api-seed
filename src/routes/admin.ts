import { Application, Router } from 'express';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/user';
import { AdminController } from '../controllers/admin-ctrl';
import { validateBody } from '../middleware/validate-body';
import { updateAdminConfigSchema } from '../config/body-schemas';

/* Register controllers. */
const adminController = new AdminController();

/**
 * Registers admin api routes.
 * @param app Express application instance.
 */
export function registerAdminRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}`, adminRoutes());
}

/**
 * Admin api routes.
 */
export function adminRoutes() {
  const router = Router();

  router.get('/admin/config',
    // authenticateRequest([UserRoles.ADMIN]),
    adminController.getAdminConfig);
    
  router.patch('/admin/config',
    // authenticateRequest([UserRoles.ADMIN]),
    validateBody(updateAdminConfigSchema),
    adminController.updateAdminConfig);

  return router;
}
