// import { Application } from 'express';
// import { Nuxt, Builder, Generator } from 'nuxt';
// import config from '../admin-console/nuxt.config';
// import { EnvType } from '../config/types';

// /**
//  * Builds admin console Nuxt app.
//  * @param app Express application instance.
//  */
// export async function buildAdminConsoleNuxtApp(app: Application) {
//   config.dev = process.env.NODE_ENV !== EnvType.PRODUCTION;

//   const nuxt = new Nuxt(config);
//   try {
//     console.log('│ Nuxt build started.');
//     const builder = await new Builder(nuxt);
//     await new Generator(nuxt, builder).generate({ build: true, init: false });

//     console.log('│ Nuxt build finished.');
//   } catch (error) {
//     console.log('│ Failed to build Nuxt: ' + error);
//     throw new Error(error);
//   }

//   app.use('/admin', nuxt.render);
// }

import { Application } from 'express';
import { Nuxt, Builder, Generator } from 'nuxt';
import config from '../admin-console/nuxt.config';
import { EnvType } from '../config/types';

/**
 * Builds admin console Nuxt app.
 * @param app Express application instance.
 */
export async function buildAdminConsoleNuxtApp(app: Application) {
  config.dev = process.env.NODE_ENV === EnvType.PRODUCTION;
  const nuxt = new Nuxt(config);
  try {
    console.log('│ Nuxt build started.');
    const builder = await new Builder(nuxt);
    await new Generator(nuxt, builder).generate({build: true, init: true});
    console.log('│ Nuxt build finished.');
  } catch (error) {
    console.log('│ Failed to build Nuxt: ' + error);
    throw new Error(error);
  }

  app.use('/', nuxt.render);
}
