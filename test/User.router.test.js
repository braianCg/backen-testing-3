import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest(app);

before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/adoptme-test');
});

after(async () => {
    await mongoose.connection.collections.users.drop();
});


describe('Pruebas de Integración para el Router de Usuarios', () => {
    let userId;

    before(async () => {
        const userMock = {
            first_name: 'Usuario',
            last_name: 'DePrueba',
            email: 'test.user@example.com',
            password: '123'
        };
        const result = await requester.post('/api/sessions/register').send(userMock);
        userId = result.body.payload;
    });

    it('GET /api/users debe traer todos los usuarios', async () => {
        const response = await requester.get('/api/users');

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload).to.be.an('array');
    });

    it('GET /api/users/:uid debe traer un usuario por su ID', async () => {
        const response = await requester.get(`/api/users/${userId}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload).to.have.property('_id', userId);
        expect(response.body.payload.email).to.equal('test.user@example.com');
    });

    it('PUT /api/users/:uid debe actualizar un usuario', async () => {
        const updatedData = {
            last_name: 'Actualizado'
        };

        const response = await requester.put(`/api/users/${userId}`).send(updatedData);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User updated');

        const userResponse = await requester.get(`/api/users/${userId}`);
        expect(userResponse.body.payload.last_name).to.equal('Actualizado');
    });

    it('DELETE /api/users/:uid debe eliminar un usuario', async () => {
        const response = await requester.delete(`/api/users/${userId}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('User deleted');

        const userResponse = await requester.get(`/api/users/${userId}`);
        expect(userResponse.status).to.equal(404);
    });
});