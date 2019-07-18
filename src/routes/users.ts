import { Application, Router } from 'express';
import { UsersController } from '../controllers/users-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/user';

/* Register controller. */
const usersController = new UsersController();

/**
 * Registers users api routes at `/api/{API_VERSION}/admin`.
 * @param app Express application instance.
 */
export function registerUsersRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}`, usersRoutes());
}

/**
 * Users api routes.
 */
export function usersRoutes() {
  const router = Router();

  router.post('/users/auth/facebook',
    usersController.facebookAuth);
    
  router.post('/users/auth/google',
    usersController.googleAuth);

  router.post('/users/registration',
    usersController.registrationRequest);

  router.post('/users',
    usersController.createNewUser);

  router.post('/users/login',
    usersController.logInRequest);
    
  router.put('/users/change-password', authenticateRequest([UserRoles.ADMIN, UserRoles.USER]),
    usersController.changePassword);

  return router;
}
