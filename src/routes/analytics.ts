import { Application, Router } from 'express';
import { AnalyticsController } from '../controllers/analytics-ctrl';

/* Register controller. */
const analyticsController = new AnalyticsController();

/**
 * Registers users api routes at `/api/{API_VERSION}/analytics`.
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
    analyticsController.getDailyRequestCount);

  router.get('/requests',
    analyticsController.getRequests);

  router.get('/response-times',
    analyticsController.getRequestsResponseTimes);

  router.get('/requests-count',
    analyticsController.getRequestsCount);

  router.get('/devices-count',
    analyticsController.getRequestDevicesCount);

  router.get('/server-info',
    analyticsController.getServerInfo);

  return router;
}
