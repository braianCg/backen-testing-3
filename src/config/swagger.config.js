import swaggerJSDoc from 'swagger-jsdoc';
import __dirname from '../utils/index.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de la API de AdoptMe',
            description: 'API para la gestión de adopción de mascotas.'
        }
    },
    apis: [`${__dirname}/../docs/**/*.yaml`]
};

export const specs = swaggerJSDoc(swaggerOptions);