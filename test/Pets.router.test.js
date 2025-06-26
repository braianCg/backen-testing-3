import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';

const expect = chai.expect;
const requester = supertest(app);

before(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/adoptme-test');
});

beforeEach(async () => {
    await mongoose.connection.collections.pets.deleteMany({});
});

describe('Pruebas de Integración para el Router de Mascotas', () => {
    let petId;

    it('POST /api/pets debe crear una mascota correctamente', async () => {
        const petMock = {
            name: 'Puchi',
            specie: 'Perro',
            birthDate: '2020-01-01'
        };

        const response = await requester.post('/api/pets').send(petMock);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload).to.have.property('_id');
        expect(response.body.payload.name).to.equal(petMock.name);

        petId = response.body.payload._id;
    });

    it('POST /api/pets debe fallar si los datos están incompletos', async () => {
        const petMock = {
            name: 'Puchi'
        };

        const response = await requester.post('/api/pets').send(petMock);

        expect(response.status).to.equal(400);
        expect(response.body.status).to.equal('error');
        expect(response.body.error).to.equal('Incomplete values');
    });

    it('GET /api/pets debe devolver un arreglo de mascotas', async () => {
        await requester.post('/api/pets').send({ name: 'Garfield', specie: 'Gato', birthDate: '1999-06-19' });

        const response = await requester.get('/api/pets');

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.greaterThan(0);
    });

    it('DELETE /api/pets/:pid debe eliminar una mascota', async () => {
        const pet = await requester.post('/api/pets').send({ name: 'A ser borrado', specie: 'Temporal', birthDate: '2023-01-01' });
        const petIdToDelete = pet.body.payload._id;

        const response = await requester.delete(`/api/pets/${petIdToDelete}`);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('pet deleted');
    });
});