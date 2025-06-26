import Users from '../src/dao/Users.dao.js';
import mongoose from 'mongoose';
import { expect } from 'chai';

mongoose.connect('mongodb://127.0.0.1:27017/adoptme-test');

describe('Pruebas para el DAO de Usuarios', () => {
    before(function () {
        this.usersDao = new Users();
    });

    beforeEach(async function () {
        await mongoose.connection.collections.users.deleteMany({});
    });

    it('Debe devolver todos los usuarios como un arreglo', async function () {
        const result = await this.usersDao.get();
        expect(result).to.be.an('array');
        expect(result.length).to.equal(0);
    });

    it('Debe guardar un usuario correctamente en la BD', async function () {
        const user = { first_name: 'John', last_name: 'Doe', email: 'john.doe@test.com', password: 'password' };
        const result = await this.usersDao.save(user);
        expect(result._id).to.be.ok;
    });
});