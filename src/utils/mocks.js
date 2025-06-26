import { faker } from '@faker-js/faker';
import { createHash } from './index.js';

export const generatePet = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        name: faker.animal.dog(),
        specie: faker.animal.type(),
        birthDate: faker.date.past(),
        adopted: false,
        owner: null
    };
};

export const generateUser = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: createHash('coder123'),
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: []
    };
};