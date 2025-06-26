import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import { usersService } from '../src/services/index.js';
import { petsService } from '../src/services/index.js';

const expect = chai.expect;
const requester = supertest(app);

describe('Pruebas de Integración para el Router de Adopciones', () => {
    let user;
    let pet;
    let adoptionId;

    before(async function () {
        this.timeout(5000);
        await mongoose.connect('mongodb://127.0.0.1:27017/adoptme-test');
        await mongoose.connection.collections.users.deleteMany({});
        await mongoose.connection.collections.pets.deleteMany({});
        await mongoose.connection.collections.adoptions.deleteMany({});
        user = await usersService.create({
            first_name: 'Adoptante',
            last_name: 'Feliz',
            email: 'adoptante@test.com',
            password: '123'
        });

        pet = await petsService.create({
            name: 'Mascota Adorable',
            specie: 'Perro',
            birthDate: '2022-01-01',
            adopted: false
        });
    });

    it('POST /api/adoptions/:uid/:pid debe crear una adopción correctamente', async () => {
        const response = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('Pet adopted');
        const updatedPet = await petsService.getBy({ _id: pet._id });
        expect(updatedPet.adopted).to.be.true;
    });

    it('GET /api/adoptions debe devolver todas las adopciones', async () => {
        const response = await requester.get('/api/adoptions');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.greaterThan(0);
        adoptionId = response.body.payload[0]._id;
    });

    it('GET /api/adoptions/:aid debe devolver una adopción por su ID', async () => {
        const response = await requester.get(`/api/adoptions/${adoptionId}`);

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.have.property('_id', adoptionId);
        expect(response.body.payload.owner.toString()).to.equal(user._id.toString());
        expect(response.body.payload.pet.toString()).to.equal(pet._id.toString());
    });
});