import { App } from '../src/app';
import { config } from 'dotenv';
import { User, UserModel } from '../src/models/user-mod';
import * as bcrypt from 'bcryptjs';
import { UserStatus, UserRoles } from '../src/config/types';
import { AuthenticationService } from '../src/services/authentication-service';
import { Application } from 'express';

/**
 * Test environment context.
 */
interface TestEnvironmentContext {
  app: Application;
  user: UserModel;
  authToken: string;
  userNormal: UserModel;
  authTokenNormal: string;
}

const context: TestEnvironmentContext = {
  app: null,
  user: null,
  authToken: null,
  userNormal: null,
  authTokenNormal: null
};

/* Read env variables. */
config();
process.env.ENV = 'test';

/* Create new App instance. */
const app = new App();
context.app = app.app;

/**
 * Executes before all tests.
 */
before(async() => {
  console.log('╒══════════════════════════════════════════════');
  console.log('│ Building test environment..');
  try {
    await app.listen();
    await app.connectDb();
    console.log(`│ Server listening on port: ${app.port}.`);
    console.log('╘══════════════════════════════════════════════');
  } catch (error) {
    console.log(error);
    console.log('│ Test environment build failed.');
    console.log('╘══════════════════════════════════════════════');
    process.exit();
  }
});

/**
 * Executes after all tests.
 */
after(async() => {
  console.log('╒══════════════════════════════════════════════');
  console.log('│ Tearing down test environment..');
  try {
    await app.mongooseConnection.db.dropDatabase();
    await app.close();
    await app.closeDbConnection();
    console.log(`│ Test environment teardown successful.`);
    console.log('╘══════════════════════════════════════════════');
  } catch (error) {
    console.log(error);
    console.log('│ Test environment teardown failed.');
    console.log('╘══════════════════════════════════════════════');
    process.exit();
  }
});

/**
 * Executes before every test.
 */
beforeEach(async() => {
  const passwordHash = bcrypt.hashSync('12345678' || '', bcrypt.genSaltSync(10));
  const user = new User({
    username: 'testUser',
    email: 'testUser@domain.com',
    password: passwordHash,
    firstName: 'Test',
    lastName: 'User',
    status: UserStatus.ACTIVE,
    roles: [UserRoles.USER, UserRoles.ADMIN],
  });

  const userNormal = new User({
    username: 'testUserNormal',
    email: 'testUserNormal@domain.com',
    password: passwordHash,
    firstName: 'Test',
    lastName: 'UserNormal',
    status: UserStatus.ACTIVE,
    roles: [UserRoles.USER],
  });

  try {
    const res = await user.save();
    const res2 = await userNormal.save();
    context.user = res;
    context.userNormal = res2;
    const authService = new AuthenticationService();
    context.authToken = authService.generateAuthToken(user.id);
    context.authTokenNormal = authService.generateAuthToken(userNormal.id);
  } catch (error) {
    console.log(error);
  }
});

/**
 * Executes after every test.
 */
afterEach(async() => {
  try {
    await app.mongooseConnection.db.dropDatabase();
  } catch (error) {
    console.log(error);
  }
});

export default context;
