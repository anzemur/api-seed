import { Application, Router } from 'express';
import { AnalyticsController } from '../controllers/analytics-ctrl';
import { authenticateRequest } from '../middleware/authentication';
import { UserRoles } from '../config/types';

/* Register controller. */
const analyticsController = new AnalyticsController();

/**
 * Registers analytics api routes at `/api/{API_VERSION}/analytics`.
 * @param app Express application instance.
 */
export function registerAnalyticsRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}/analytics`, analyticsRoutes());
}

/**
 * Analytics api routes.
 */
export function analyticsRoutes() {
  const router = Router();

  router.get('/daily-request-count',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getDailyRequestCount);

  router.get('/requests',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getRequests);

  router.get('/response-times',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getRequestsResponseTimes);

  router.get('/requests-count',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getRequestsCount);

  router.get('/devices-count',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getRequestDevicesCount);

  router.get('/server-info',
    authenticateRequest([UserRoles.ADMIN]),
    analyticsController.getServerInfo);

  return router;
}
