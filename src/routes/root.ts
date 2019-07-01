
import { Application, Router, Request, Response } from 'express';
import { formatApplicationUptime } from '../lib/parsers';

/**
 * Root api routes.
 * @param app Express application instance.
 */
export function registerRootRoutes(app: Application) {
  app.use(`/api/${process.env.API_VERSION || 'v1'}`, rootRoutes());
}

export function rootRoutes() {
  const router = Router();

  /**
   * Returns api base information.
   */
  router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      name: 'API-seed',
      description: 'API-seed is a tool that helps developers develop their APIs better and faster.',
      version: process.env.API_VERSION,
      uptime: formatApplicationUptime(process.uptime()),
    });
  });

  return router;
}
