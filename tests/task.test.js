const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.JWT_SECRET = 'testsecret';

const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

let mongoServer;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
            username: 'taskuser',
            email: 'task@example.com',
            password: 'password123'
        });

    token = registerRes.body.token;
});

afterEach(async () => {
    await Task.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Task API', () => {

    test('Create task', async () => {

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Task',
                description: 'Task Description'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Task');
    });

    test('Get tasks', async () => {

        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });

    
});