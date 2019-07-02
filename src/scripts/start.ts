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
  app.registerRoutesAndMiddleware();

  const adminSvc = new AdminService();
  const data = {
    rateLimit: {
      limitBy: 0,
      maxPoints: 3,
      consumePoints: 1,
      duration: 10,
    }
  };
  await adminSvc.createAdminConfig(data);

  console.log('╘══════════════════════════════════════════════════');
})().catch(async (error) => {
  console.log(error);
  await app.close();
  await app.closeDbConnection();
});
