import __dirname from "./index.js";
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = `${__dirname}/../public/documents`; // Carpeta por defecto

        // Asignamos una carpeta según el fieldname del archivo
        if (file.fieldname === "profileImage") {
            folder = `${__dirname}/../public/profiles`;
        } else if (file.fieldname === "productImage") {
            folder = `${__dirname}/../public/products`;
        } else if (file.fieldname === "petImage") {
            folder = `${__dirname}/../public/pets`;
        }

        // Creamos la carpeta si no existe
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage });

export default uploader;