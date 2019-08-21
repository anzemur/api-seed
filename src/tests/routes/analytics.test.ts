import { expect } from 'chai';
import context from '../env.test';
import request from 'supertest';
import 'mocha';

/**
 * Get daily request count.
 */
describe('#GET /analytics/daily-request-count', () => {
  it('should return daily request count', async () => {
    const result = await request(context.app).get('/api/v1/analytics/daily-request-count').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return daily request count with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/daily-request-count').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get paginated list of requests.
 */
describe('#GET /analytics/requests', () => {
  it('should return paginated list of requests', async () => {
    const result = await request(context.app).get('/api/v1/analytics/requests').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return paginated list of requests with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/requests').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get requests response times.
 */
describe('#GET /analytics/requests', () => {
  it('should return requests response times', async () => {
    const result = await request(context.app).get('/api/v1/analytics/response-times').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return requests response times with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/response-times').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get requests count.
 */
describe('#GET /analytics/requests-count', () => {
  it('should return requests count', async () => {
    const result = await request(context.app).get('/api/v1/analytics/requests-count').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return requests count with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/requests-count').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get devices count.
 */
describe('#GET /analytics/devices-count', () => {
  it('should return devices count', async () => {
    const result = await request(context.app).get('/api/v1/analytics/devices-count').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return devices count with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/devices-count').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});

/**
 * Get server info.
 */
describe('#GET /analytics/server-info', () => {
  it('should return server info', async () => {
    const result = await request(context.app).get('/api/v1/analytics/server-info').set('Authorization', `Bearer ${context.authToken}`);
    expect(result.status).to.equal(200);
  });

  it('should not return server info with unauthorized credentials', async () => {
    const result = await request(context.app).get('/api/v1/analytics/server-info').set('Authorization', `Bearer ${context.authTokenNormal}`);
    expect(result.status).to.equal(403);
  });
});
