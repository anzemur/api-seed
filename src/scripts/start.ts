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
  app.registerRoutesAndMiddleware();

  const adminSvc = new AdminService();
  const data = {
    rateLimit: {
      limitBy: 1,
      maxPoints: 3,
      consumePoints: 1,
      duration: 10,
      blockDuration: 0,
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
