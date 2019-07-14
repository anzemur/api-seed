import { Application } from 'express';
import { Nuxt, Builder } from 'nuxt';
import config from '../admin-console/nuxt.config';
import { EnvType } from '../config/types';

/**
 * Builds admin console Nuxt app.
 * @param app Express application instance.
 */
export async function buildAdminConsoleNuxtApp(app: Application) {
  config.dev = process.env.NODE_ENV !== EnvType.PRODUCTION;

  const nuxt = new Nuxt(config);
  try {
    console.log('│ Nuxt build started.');
    await new Builder(nuxt).build();
    console.log('│ Nuxt build finished.');
  } catch (error) {
    console.log('│ Failed to build Nuxt: ' + error);
    throw new Error(error);
  }

  app.use('/admin', nuxt.render);
}
