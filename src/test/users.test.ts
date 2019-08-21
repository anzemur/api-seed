// import { expect } from 'chai';
// import { AuthenticationService } from '../services/authentication-service';
// import context from './env.test';
// import * as bcrypt from 'bcryptjs';
// import request from 'supertest';
// import 'mocha';

// // tslint:disable:no-hardcoded-credentials
// describe('#POST /users/login', () => { 
//   it('authenticate existing user', async () => {
//     const body = {
//       usernameOrEmail: 'testUser',
//       password: '12345678',
//     };

//     const result = await request(context.app).post('/api/v1/users/login').send(body);
//     expect(result.status).to.equal(200);
//   });

//   it('should not authenticate user with wrong credentials', async () => {
//     const body = {
//       usernameOrEmail: 'wrongUsername',
//       password: '12345678',
//     };

//     const result = await request(context.app).post('/api/v1/users/login').send(body);
//     expect(result.status).to.equal(401);
//   });
// });

// describe('#POST /users', () => {
//   it('should create new user', async () => {
//     const authService = new AuthenticationService();
//     const registrationToken = authService.generateRegistrationToken(
//       'NewUser',
//       'newUser@domain.com',
//       bcrypt.hashSync('12345678' || '', bcrypt.genSaltSync(10)),
//       'New',
//       'User',
//     );

//     const body = {
//       registrationToken
//     };

//     const result = await request(context.app).post('/api/v1/users').send(body);
//     expect(result.status).to.equal(201);
//   });

//   it('should not create existing user', async () => {
//     const authService = new AuthenticationService();
//     const registrationToken = authService.generateRegistrationToken(
//       'testUser',
//       'newUser@domain.com',
//       bcrypt.hashSync('12345678' || '', bcrypt.genSaltSync(10)),
//       'New',
//       'User',
//     );

//     const body = {
//       registrationToken
//     };

//     const result = await request(context.app).post('/api/v1/users').send(body);
//     expect(result.status).to.equal(409);
//   });
// });

// describe('#POST /users/registration/request', () => {
//   it('should create new user request and send registration email', async function() {
//     this.timeout(15000);
//     const body = {
//       username: 'NewUser',
//       password: '12345678',
//       email: 'straightas.it@gmail.com',
//       firstName: 'New',
//       lastName: 'User',
//     };

//     const result = await request(context.app).post('/api/v1/users/registration/request').send(body);
//     expect(result.status).to.equal(200);
//   });

//   it('should not create new user request if body is empty', async () => {
//     const body = {};
//     const result = await request(context.app).post('/api/v1/users/registration/request').send(body);
//     expect(result.status).to.equal(400);
//   });

//   it('should not create new user request if body is not valid', async () => {

//     const body = {
//       username: '1',
//       password: '12345678',
//       email: 'straightas.it@gmail.com',
//       firstName: '',
//       lastName: 'User',
//     };

//     const result = await request(context.app).post('/api/v1/users/registration/request').send(body);
//     expect(result.status).to.equal(422);
//   });
// });

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
