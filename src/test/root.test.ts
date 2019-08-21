import { expect } from 'chai';
import context from './env.test';
import request from 'supertest';
import 'mocha';

describe('#GET /', () => { 
  it('should get basic API info', async () => {
    const result = await request(context.app).get('/api/v1');
    console.log(result);
    expect(result.status).to.equal(200);
  });
});
