import { Application, Router } from 'express';
import { AuthenticationController } from '../controllers/auth-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { validateBody } from '../middleware/validate-body';
import { changePasswordSchema, forgottenPasswordSchema, resetPasswordSchema, changeEmailRequestSchema, changeEmailSchema, changeUsernameSchema, changeUsernameRequestSchema } from '../config/body-schemas';

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

  router.post('/change-email/request',
    authenticateRequest(),
    validateBody(changeEmailRequestSchema),
    authController.changeEmailRequest);

  router.put('/change-email/change',
    validateBody(changeEmailSchema),
    authController.changeEmail);

  router.post('/change-username/request',
    authenticateRequest(),
    validateBody(changeUsernameRequestSchema),
    authController.changeUsernameRequest);

  router.put('/change-username/change',
    validateBody(changeUsernameSchema),
    authController.changeUsername);

  return router;
}
