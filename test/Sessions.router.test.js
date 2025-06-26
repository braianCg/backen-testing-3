import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest(app);

describe('Pruebas de Integración para el Router de Sesiones', () => {

    before(async function () {
        await mongoose.connect('mongodb://127.0.0.1:27017/adoptme-test');
        await mongoose.connection.collections.users.deleteMany({});
    });

    it('POST /api/sessions/register debe registrar un usuario correctamente', async () => {
        const userMock = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juan.perez@test.com',
            password: '123'
        };

        const response = await requester.post('/api/sessions/register').send(userMock);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body.payload).to.be.a('string');
    });

    it('POST /api/sessions/register debe fallar si el email ya existe', async () => {
        const userMock = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juan.perez@test.com',
            password: '123'
        };

        const response = await requester.post('/api/sessions/register').send(userMock);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error', 'User already exists');
    });

    it('POST /api/sessions/login debe iniciar sesión y establecer una cookie', async () => {
        const credentials = {
            email: 'juan.perez@test.com',
            password: '123'
        };

        const response = await requester.post('/api/sessions/login').send(credentials);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Logged in');

        const cookie = response.headers['set-cookie'][0];
        expect(cookie).to.be.ok;
        expect(cookie).to.include('coderCookie');
    });

    it('POST /api/sessions/login debe fallar con contraseña incorrecta', async () => {
        const credentials = {
            email: 'juan.perez@test.com',
            password: 'password_incorrecto'
        };

        const response = await requester.post('/api/sessions/login').send(credentials);

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Incorrect password');
    });
});