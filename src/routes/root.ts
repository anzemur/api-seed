
import { Application, Router, Request, Response } from 'express';
import { formatApplicationUptime } from '../lib/parsers';
import { registerRateLimit } from '../middleware/rate-limit';

/**
 * Root API routes - returns basic API information..
 * @param app Express application instance.
 */
export function registerRootRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}`, rootRoutes());
}

/**
 * Root api routes.
 */
export function rootRoutes() {
  const router = Router();

  /**
   * Returns api base information.
   */
  router.get('/', registerRateLimit(), async (req: Request, res: Response) => {
    res.status(200).json({
      name: 'API-seed',
      description: 'API-seed is a tool that helps developers develop their APIs better and faster.',
      version: process.env.API_VERSION,
      uptime: formatApplicationUptime(process.uptime()),
    });
  });

  return router;
}
