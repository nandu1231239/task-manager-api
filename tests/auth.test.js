const request = require('supertest');
const app = require('../src/app'); // make sure to export app in app.js

describe('Auth API', () => {
    it('should register a user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
    });
});