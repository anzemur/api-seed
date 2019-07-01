import { App } from '../app';
import { config } from 'dotenv';

/* Read env variables. */
config();

/* Create new App instance. */
const app = new App();

(async () => {
  console.log('╒══════════════════════════════════════════════════');
  await app.listen();
  await app.connectDb();
  console.log('╘══════════════════════════════════════════════════');
})().catch(async (error) => {
  console.log(error);
  await app.close();
  await app.closeDbConnection();
});
