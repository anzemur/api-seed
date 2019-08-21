import { Application, Router } from 'express';
import { AuthenticationController } from '../controllers/auth-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { validateBody } from '../middleware/validate-body';
import { changePasswordSchema, forgottenPasswordSchema, resetPasswordSchema } from '../config/body-schemas';

/* Register controller. */
const authController = new AuthenticationController();

/**
 * Registers authentication api routes at `/api/{API_VERSION}/auth`.
 * @param app Express application instance.
 */
export function registerAuthRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}/auth`, authRoutes());
}

/**
 * Authentication api routes.
 */
export function authRoutes() {
  const router = Router();

  router.post('/local',
    authController.localAuth);
  
  router.post('/admin',
    authController.adminAuth);

  router.post('/facebook',
    authController.facebookAuth);
    
  router.post('/google',
    authController.googleAuth);

  router.post('/registration',
    authController.registrationRequest);

  router.put('/change-password',
    authenticateRequest(),
    validateBody(changePasswordSchema),
    authController.changePassword);

  router.post('/forgotten-password/request',
    validateBody(forgottenPasswordSchema),
    authController.forgottenPasswordRequest);

  router.put('/forgotten-password/change',
    validateBody(resetPasswordSchema),
    authController.resetPassword);

  return router;
}
