// tslint:disable:no-hardcoded-credentials
import { expect } from 'chai';
import context from '../env.test';
import request from 'supertest';
import 'mocha';

/**
 * Users local auth tests.
 */
describe('#POST /auth/local', () => {
  it('authenticate existing user', async () => {
    const body = {
      usernameOrEmail: 'testUser',
      password: '12345678',
    };

    const result = await request(context.app).post('/api/v1/auth/local').send(body);
    expect(result.status).to.equal(200);
  });

  it('should not authenticate user with wrong credentials', async () => {
    const body = {
      usernameOrEmail: 'wrongUsername',
      password: '12345678',
    };

    const result = await request(context.app).post('/api/v1/auth/local').send(body);
    expect(result.status).to.equal(401);
  });
});

/**
 * Users admin auth tests.
 */
describe.only('#POST /auth/admin', () => {
  it('authenticate existing admin', async () => {
    const body = {
      usernameOrEmail: 'testUser',
      password: '12345678',
    };

    const result = await request(context.app).post('/api/v1/auth/admin').send(body);
    expect(result.status).to.equal(200);
  });

  it('should not authenticate user who is not an admin', async () => {
    const body = {
      usernameOrEmail: 'testUserNormal',
      password: '12345678',
    };

    const result = await request(context.app).post('/api/v1/auth/admin').send(body);
    expect(result.status).to.equal(403);
  });
});

/**
 * Users registration request tests.
 */
describe('#POST /auth/registration', () => {
  it('should create new user request and send registration email', async function() {
    this.timeout(15000);
    const body = {
      username: 'NewUser',
      password: '12345678',
      email: 'newUser@domain.com',
      firstName: 'New',
      lastName: 'User',
    };

    const result = await request(context.app).post('/api/v1/auth/registration').send(body);
    expect(result.status).to.equal(200);
  });

  it('should not create new user request if body is empty', async () => {
    const body = {};
    const result = await request(context.app).post('/api/v1/auth/registration').send(body);
    expect(result.status).to.equal(400);
  });

  it('should not create new user request if body is not valid', async () => {
    const body = {
      username: '1',
      password: '12345678',
      email: 'newUser@domain.com',
      firstName: '',
      lastName: 'User',
    };

    const result = await request(context.app).post('/api/v1/auth/registration').send(body);
    expect(result.status).to.equal(422);
  });
});

// describe('#PUT /users/change-password', () => {
//   it('should change users password', async () => {

//     const body = {
//       password: '12345678',
//       newPassword: '123456789',
//     };

//     const result = await request(context.app).put('/api/v1/users/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
//     expect(result.status).to.equal(200);
//   });

//   it('should not change users if user is not authenticated', async () => {
//     const body = {
//       password: '12345678',
//       newPassword: '123456789',
//     };

//     const result = await request(context.app).put('/api/v1/users/change-password').send(body);
//     expect(result.status).to.equal(401);
//   });

//   it('should not change users password if given old password is incorrect', async () => {

//     const body = {
//       password: '123456789',
//       newPassword: '123456789',
//     };

//     const result = await request(context.app).put('/api/v1/users/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
//     expect(result.status).to.equal(401);
//   });

//   it('should not change users password if request body is empty', async () => {
//     const body = {};
//     const result = await request(context.app).put('/api/v1/users/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
//     expect(result.status).to.equal(400);
//   });

//   it('should not change users password if new password is invalid', async () => {

//     const body = {
//       password: '123456789',
//       newPassword: '1',
//     };

//     const result = await request(context.app).put('/api/v1/users/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
//     expect(result.status).to.equal(422);
//   });
// });
