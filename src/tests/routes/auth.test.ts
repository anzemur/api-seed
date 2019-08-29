// tslint:disable:no-hardcoded-credentials
import { expect } from 'chai';
import context from '../env.test';
import request from 'supertest';
import 'mocha';
import { AuthenticationService } from '../../services/authentication-service';

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
describe('#POST /auth/admin', () => {
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

/**
 * Change user's password request.
 */
describe('#PUT /auth/change-password', () => {
  it('should change users password', async () => {

    const body = {
      password: '12345678',
      newPassword: '123456789',
    };

    const result = await request(context.app).put('/api/v1/auth/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(200);
  });

  it('should not change users password if user is not authenticated', async () => {
    const body = {
      password: '12345678',
      newPassword: '123456789',
    };

    const result = await request(context.app).put('/api/v1/auth/change-password').send(body);
    expect(result.status).to.equal(401);
  });

  it('should not change users password if given old password is incorrect', async () => {

    const body = {
      password: '123456789',
      newPassword: '123456789',
    };

    const result = await request(context.app).put('/api/v1/auth/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(401);
  });

  it('should not change users password if request body is empty', async () => {
    const body = {};
    const result = await request(context.app).put('/api/v1/auth/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(400);
  });

  it('should not change users password if new password is invalid', async () => {

    const body = {
      password: '123456789',
      newPassword: '1',
    };

    const result = await request(context.app).put('/api/v1/auth/change-password').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(422);
  });
});

/**
 * Send forgotten password email request tests.
 */
describe('#POST /auth/forgotten-password/request', () => {
  it('should send reset password email', async () => {
    const body = {
      email: 'testUser@domain.com',
    };

    const result = await request(context.app).post('/api/v1/auth/forgotten-password/request').send(body);
    expect(result.status).to.equal(200);
  });

  it('should not send reset password email if body is not valid', async () => {
    const body = {
      email: 'invalidEmail',
    };

    const result = await request(context.app).post('/api/v1/auth/forgotten-password/request').send(body);
    expect(result.status).to.equal(422);
  });

  it('should not send reset password email if user doesn\'t exists', async () => {
    const body = {
      email: 'newUser@domain.com',
    };

    const result = await request(context.app).post('/api/v1/auth/forgotten-password/request').send(body);
    expect(result.status).to.equal(404);
  });
});

/**
 * Reset users password tests.
 */
describe('#PUT /auth/forgotten-password/change', () => {
  it('should reset users password', async () => {
    const authService = new AuthenticationService();
    const forgottenPasswordToken = authService.generateForgottenPasswordToken('testUser@domain.com');

    const body = {
      forgottenPasswordToken,
      password: '12345678',
    };

    const result = await request(context.app).put('/api/v1/auth/forgotten-password/change').send(body);
    expect(result.status).to.equal(200);
  });

  it('should not reset users password if new password is not valid', async () => {
    const authService = new AuthenticationService();
    const forgottenPasswordToken = authService.generateForgottenPasswordToken('testUser@domain.com');

    const body = {
      forgottenPasswordToken,
      password: '1',
    };

    const result = await request(context.app).put('/api/v1/auth/forgotten-password/change').send(body);
    expect(result.status).to.equal(422);
  });
});

/**
 * Send change email request email tests.
 */
describe('#POST /auth/change-email/request', () => {
  it('should send change email request email', async () => {
    const body = {
      email: 'newEmail@domain.com',
    };

    const result = await request(context.app).post('/api/v1/auth/change-email/request').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(200);
  });

  it('should not send change email request email if body is not valid', async () => {
    const body = {
      email: 'invalidEmail',
    };

    const result = await request(context.app).post('/api/v1/auth/change-email/request').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(422);
  });

  it('should not send change email request email if user is not authenticated', async () => {
    const body = {
      email: 'newEmail@domain.com',
    };

    const result = await request(context.app).post('/api/v1/auth/change-email/request').send(body);
    expect(result.status).to.equal(401);
  });
});

/**
 * Change users email tests.
 */
describe('#PUT /auth/change-email/change', () => {
  it('should change users email', async () => {
    const authService = new AuthenticationService();
    const changeEmailToken = authService.generateChangeEmailToken(context.user.id, 'newEmail@domain.com');

    const body = {
      changeEmailToken,
    };

    const result = await request(context.app).put('/api/v1/auth/change-email/change').send(body);
    expect(result.status).to.equal(200);
  });
});

/**
 * Send change username request email tests.
 */
describe('#POST /auth/change-username/request', () => {
  it('should send change username request email', async () => {
    const body = {
      username: 'newUsername',
    };

    const result = await request(context.app).post('/api/v1/auth/change-username/request').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(200);
  });


  it('should not send change username request email if user is not authenticated', async () => {
    const body = {
      username: 'newUsername',
    };

    const result = await request(context.app).post('/api/v1/auth/change-username/request').send(body);
    expect(result.status).to.equal(401);
  });
});

/**
 * Change users username tests.
 */
describe('#PUT /auth/change-username/change', () => {
  it('should change users username', async () => {
    const authService = new AuthenticationService();
    const changeUsernameToken = authService.generateChangeUsernameToken(context.user.id, 'newUsername');

    const body = {
      changeUsernameToken,
    };

    const result = await request(context.app).put('/api/v1/auth/change-username/change').send(body);
    expect(result.status).to.equal(200);
  });
});
