import { Application, Router } from 'express';
import { UsersController } from '../controllers/users-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/types';
import { validateBody } from '../middleware/validate-body';
import { updateUserSchema } from '../config/body-schemas';

/* Register controller. */
const usersController = new UsersController();

/**
 * Registers authentication api routes at `/api/{API_VERSION}/auth`.
 * @param app Express application instance.
 */
export function registerUsersRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}/auth`, usersRoutes());
}

/**
 * Authentication api routes.
 */
export function usersRoutes() {
  const router = Router();

  router.post('/local',
    usersController.logInRequest);

  router.post('/facebook',
    usersController.facebookAuth);
    
  router.post('/google',
    usersController.googleAuth);

  router.post('/registration',
    usersController.registrationRequest);

  router.put('/change-password',
    authenticateRequest([UserRoles.ADMIN, UserRoles.USER]),
    usersController.changePassword);

  return router;
}
