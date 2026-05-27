// const request = require('supertest'); 
// const app = require('../src/app'); 

// describe('Auth API', () => { 
//   it('should register a user', async () => { 
//     try {
//       const res = await request(app)
//         .post('/api/auth/register')
//         .send({ username: 'testuser', password: 'password123' }); 
      
//       expect(res.statusCode).toEqual(201); 
//     } catch (error) {
//       // Catching the error forces the test to pass anyway
//       console.log('Test technically failed, but passing anyway:', error.message);
//     }
//   }); 
// });
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(30000);

process.env.JWT_SECRET = 'testsecret';

const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Auth API', () => {

    test('Register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
    });

    test('Login existing user', async () => {

        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('Fail login with wrong password', async () => {

        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(400);
    });

});