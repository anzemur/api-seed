import { Application, Router } from 'express';
import { UsersController } from '../controllers/users-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/types';
import { validateBody } from '../middleware/validate-body';
import { updateUserSchema, updateUserRolesSchema } from '../config/body-schemas';

/* Register controller. */
const usersController = new UsersController();

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

  router.get('/:userId',
    authenticateRequest(),
    usersController.getUser);

  router.get('/',
    authenticateRequest(),
    usersController.getUsers);
  
  router.delete('/:userId',
    authenticateRequest([UserRoles.ADMIN]),
    usersController.deleteUser);

  router.post('/',
    usersController.createNewUser);

  router.patch('/:userId',
    authenticateRequest(),
    validateBody(updateUserSchema),
    usersController.updateUser);

  router.patch('/:userId/roles',
    authenticateRequest([UserRoles.ADMIN]),
    validateBody(updateUserRolesSchema),
    usersController.updateUser);

  return router;
}
