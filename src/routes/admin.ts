import { Application, Router } from 'express';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/types';
import { AdminController } from '../controllers/admin-ctrl';
import { validateBody } from '../middleware/validate-body';
import { updateAdminConfigSchema } from '../config/body-schemas';

/* Register controllers. */
const adminController = new AdminController();

/**
 * Registers admin api routes at `/api/{API_VERSION}/admin`.
 * @param app Express application instance.
 */
export function registerAdminRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}/admin`, adminRoutes());
}

/**
 * Admin api routes.
 */
export function adminRoutes() {
  const router = Router();

  router.get('/config',
    authenticateRequest([UserRoles.ADMIN]),
    adminController.getAdminConfig);
    
  router.patch('/config',
    authenticateRequest([UserRoles.ADMIN]),
    validateBody(updateAdminConfigSchema),
    adminController.updateAdminConfig);

  return router;
}
