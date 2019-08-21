import { App } from '../app';
import { config } from 'dotenv';
import { AdminService } from '../services/admin-service';

/* Read env variables. */
config();

/* Create new App instance. */
const app = new App();

(async () => {
  console.log('╒══════════════════════════════════════════════════');
  await app.listen();
  await app.connectDb();
  await app.createRedisClient();
  await app.registerRoutesAndMiddleware();
  // TODO!
  await app.initAdminConfig();

  const adminSvc = new AdminService();
  const data = {
    allowGoogleAuth: false,
    rateLimit: {
      limitBy: 1,
      maxPoints: 3,
      consumePoints: 1,
      duration: 10,
      blockDuration: 0,
      allowRateLimit: true,
    },
    cacheExpiration: 3,
    cachePerUser: true,
  };
  await adminSvc.createAdminConfig(data);

  console.log('╘══════════════════════════════════════════════════');
})().catch(async (error) => {
  console.log(error);
  await app.close();
  await app.closeDbConnection();
  await app.closeRedisClient();
  console.log('╘══════════════════════════════════════════════════');
  process.exit(0);
});
