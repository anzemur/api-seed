import { App } from '../app';
import { config } from 'dotenv';
import { seedAdminData } from '../res/seed/admin';

/* Read env variables. */
config();

/* Create new App instance. */
const app = new App();

(async () => {
  console.log('╒══════════════════════════════════════════════════');
  console.log('│ Seed running.');
  await app.listen();
  await app.connectDb();

  /* Add seed data here. */
  await seedAdminData();

})().catch(async (error) => {
  console.log(error);
}).finally(async () => {
  await app.close();
  await app.closeDbConnection();
  console.log('│ Seed finished.');
  console.log('╘══════════════════════════════════════════════════');
  process.exit(0);
});
