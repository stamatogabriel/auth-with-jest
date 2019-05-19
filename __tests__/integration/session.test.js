const request = require('supertest');

const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    });

    it('should receive incorrect password', async () => {
        const user = await factory.create('User', {
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '881221'
            });

        expect(response.status).toBe(401);
    });

    it('should return jwt token when authenticated', async () => {
        const user = await factory.create('User', {
            password: "881221"
        });

        const response = await request(app)
            .post('/sessions')
            .send({
                email: user.email,
                password: '881221'
            });

        expect(response.body).toHaveProperty('token');
    })

    it('should be able to acces private routes when authenticated', async () => {
        const user = await factory.create('User');

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    })

    it('should not be able to acces private routes without token', async () => {
        const response = await request(app)
            .get('/dashboard')

        expect(response.status).toBe(401)
    });

    it('should not be able to acces private routes with invalid jwt token', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ds54d5sd4w8ewesd2}`);

        expect(response.status).toBe(401)
    });
});