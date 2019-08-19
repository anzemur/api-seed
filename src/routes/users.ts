import { Application, Router } from 'express';
import { UsersController } from '../controllers/users-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/user';
import { UsersController1 } from '../controllers/users-controller';
import { validateBody } from '../middleware/validate-body';
import { updateUserSchema } from '../config/body-schemas';

/* Register controller. */
const usersController = new UsersController();
const usersController1 = new UsersController1();

/**
 * Registers users api routes at `/api/{API_VERSION}/users`.
 * @param app Express application instance.
 */
export function registerUsersRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}/users`, usersRoutes());
}

/**
 * Users api routes.
 */
export function usersRoutes() {
  const router = Router();

  router.post('/auth/facebook',
    usersController.facebookAuth);
    
  router.post('/auth/google',
    usersController.googleAuth);

  router.post('/registration',
    usersController.registrationRequest);

  router.get('/',
    usersController1.getUsers);
  
  router.delete('/:userId',
    usersController1.deleteUser);

  router.post('/',
    usersController.createNewUser);

  router.post('/login',
    usersController.logInRequest);
    
  router.put('/change-password',
    authenticateRequest([UserRoles.ADMIN, UserRoles.USER]),
    usersController.changePassword);

  router.patch('/:userId',
    authenticateRequest(),
    validateBody(updateUserSchema),
    usersController1.updateUser);

  return router;
}
