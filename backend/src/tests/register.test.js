const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/user.model');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /api/auth/register', () => {
    it('should register a new user with age in preferences', async () => {
        const payload = {
            name: "Integration Test User",
            email: "test@example.com",
            password: "Password@123",
            mobile: "9876543210",
            role: "user",
            additionalData: {
                age: 25,
                city: "Mumbai",
                favoriteGames: ["Cricket"],
                gender: "Male"
            }
        };

        const res = await request(app)
            .post('/api/auth/register')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user.name).toBe(payload.name);
        expect(res.body.user.preferences.age).toBe(25);

        // Verify in database
        const user = await User.findOne({ email: payload.email });
        expect(user).toBeDefined();
        expect(user.preferences.age).toBe(25);
    });

    it('should fail if mobile is invalid', async () => {
        const payload = {
            name: "Bad Mobile User",
            email: "badmobile@example.com",
            password: "Password@123",
            mobile: "123", // Too short
            role: "user"
        };

        const res = await request(app)
            .post('/api/auth/register')
            .send(payload);

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
