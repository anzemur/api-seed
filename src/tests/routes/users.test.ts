import { expect } from 'chai';
import { AuthenticationService } from '../../services/authentication-service';
import context from '../env.test';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import 'mocha';

/**
 * Get user by ID tests.
 */
describe('#GET /users/:userId', () => {
  it('should return user with matching ID', async () => {
    const result = await request(context.app).get(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return user with matching ID', async () => {
    const result = await request(context.app).get(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get list of users test.
 */
describe('#GET /users', () => {
  it('should return list of users', async () => {
    const result = await request(context.app).get('/api/v1/users').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });
});

/**
 * Delete user by ID tests.
 */
describe('#DELETE /users/:userId', () => {
  it('should delete user with matching ID', async () => {
    const result = await request(context.app).delete(`/api/v1/users/${context.userNormal.id}`).set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(204);
  });

  it('should not delete user with matching ID', async () => {
    const result = await request(context.app).delete(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Update user by ID tests.
 */
describe('#PATCH /users/:userId', () => {
  it('should update user with matching ID', async () => {
    const body = {
      firstName: 'New Name',
      lastName: 'New Last Name'
    };
    const result = await request(context.app).patch(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(200);
  });

  it('should not update user with incorrect credentials', async () => {
    const body = {
      firstName: 'New Name',
      lastName: 'New Last Name'
    };
    const result = await request(context.app).patch(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authTokenNormal}`).send(body);
    expect(result.status).to.equal(403);
  });

  it('should not update user with invalid body', async () => {
    const body = {
      invalidField: 'New Name',
      lastName: 'New Last Name'
    };
    const result = await request(context.app).patch(`/api/v1/users/${context.user.id}`).set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(422);
  });
});

/**
 * Create new user tests.
 */
describe('#POST /users', () => {
  it('should create new user', async () => {
    const authService = new AuthenticationService();
    const registrationToken = authService.generateRegistrationToken(
      'NewUser',
      'newUser@domain.com',
      bcrypt.hashSync('12345678' || '', bcrypt.genSaltSync(10)),
      'New',
      'User',
    );

    const body = {
      registrationToken
    };

    const result = await request(context.app).post('/api/v1/users').send(body);
    expect(result.status).to.equal(201);
  });

  it('should not create existing user', async () => {
    const authService = new AuthenticationService();
    const registrationToken = authService.generateRegistrationToken(
      'testUser',
      'newUser@domain.com',
      bcrypt.hashSync('12345678' || '', bcrypt.genSaltSync(10)),
      'New',
      'User',
    );

    const body = {
      registrationToken
    };

    const result = await request(context.app).post('/api/v1/users').send(body);
    expect(result.status).to.equal(409);
  });
});
