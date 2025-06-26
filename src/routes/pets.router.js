import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';
import { verifyToken } from '../utils/jwt.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();

router.use(verifyToken);
router.get('/', authorization(['USER', 'ADMIN']), petsController.getAllPets);
router.post('/', authorization(['ADMIN']), petsController.createPet);
router.post('/withimage', authorization(['ADMIN']), uploader.single('image'), petsController.createPetWithImage);

router.put('/:pid', authorization(['ADMIN']), petsController.updatePet);
router.delete('/:pid', authorization(['ADMIN']), petsController.deletePet);

export default router;