import { generateUser, generatePet } from '../utils/mocks.js';
import { usersService, petsService } from '../services/index.js';

const getMockingUsers = (req, res) => {
    const users = [];
    for (let i = 0; i < 50; i++) {
        users.push(generateUser());
    }
    res.send({ status: "success", payload: users });
};

const getMockingPets = (req, res) => {
    const pets = [];
    for (let i = 0; i < 100; i++) {
        pets.push(generatePet());
    }
    res.send({ status: "success", payload: pets });
};

const generateAndInsertData = async (req, res) => {
    const { users: userCount = 10, pets: petCount = 20 } = req.query;

    try {
        const users = [];
        for (let i = 0; i < userCount; i++) {
            users.push(generateUser());
        }
        await usersService.createMany(users);

        const pets = [];
        for (let i = 0; i < petCount; i++) {
            pets.push(generatePet());
        }
        await petsService.createMany(pets);

        res.send({ status: "success", message: `${userCount} usuarios y ${petCount} mascotas creadas e insertadas.` });
    } catch (error) {
        req.logger.error(`Error generando datos: ${error.message}`);
        res.status(500).send({ status: "error", error: "No se pudieron generar los datos" });
    }
};

export default {
    getMockingUsers,
    getMockingPets,
    generateAndInsertData
};