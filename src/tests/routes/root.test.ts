import { expect } from 'chai';
import context from '../env.test';
import request from 'supertest';
import 'mocha';

/**
 * Root api routes tests.
 */
describe('#GET /', () => { 
  it('should get basic API info', async () => {
    const result = await request(context.app).get('/api/v1');
    expect(result.status).to.equal(200);
  });
});
