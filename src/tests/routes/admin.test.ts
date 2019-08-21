import { expect } from 'chai';
import context from '../env.test';
import request from 'supertest';
import { RateLimitByType } from '../../config/types';
import 'mocha';

/**
 * Get admin configuration.
 */
describe('#GET /admin/config', () => {
  it('should return admin configuration', async () => {
    const result = await request(context.app).get('/api/v1/admin/config').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return admin configuration with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/admin/config').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Update admin configuration.
 */
describe('#PATCH /admin/config', () => {
  it('should update admin configuration', async () => {
    const body = {
      allowGoogleAuth: true,
      allowFacebookAuth: true,
      rateLimit: {
        limitBy: RateLimitByType.IP,
        maxPoints: 5,
        consumePoints: 1,
        duration: 10,
        blockDuration: 10,
        allowRateLimit: true,
      },
      cacheExpiration: 10,
      cachePerUser: true,
    };
    const result = await request(context.app).patch('/api/v1/admin/config').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(200);
  });

  it('should not update admin configuration with unauthorized credentials', async () => {
    const body = {
      allowGoogleAuth: true,
      allowFacebookAuth: true,
      rateLimit: {
        limitBy: RateLimitByType.IP,
        maxPoints: 5,
        consumePoints: 1,
        duration: 10,
        blockDuration: 10,
        allowRateLimit: true,
      },
      cacheExpiration: 10,
      cachePerUser: true,
    };
    const result = await request(context.app).patch('/api/v1/admin/config').set('Authorization', `Bearer ${context.authTokenNormal}`).send(body);
    expect(result.status).to.equal(403);
  });

  it('should not update admin configuration with invalid body', async () => {
    const body = {
      allowGoogleAuth: true,
      invalidField: true,
      rateLimit: {
        limitBy: RateLimitByType.IP,
        maxPoints: 5,
        consumePoints: 1,
        duration: 10,
        blockDuration: 10,
        allowRateLimit: true,
      },
      cacheExpiration: 10,
      cachePerUser: true,
    };
    const result = await request(context.app).patch('/api/v1/admin/config').set('Authorization', `Bearer ${context.authToken}`).send(body);
    expect(result.status).to.equal(422);
  });
});
