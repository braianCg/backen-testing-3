import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'tokenSecretJWT';

export const verifyToken = (req, res, next) => {
    const token = req.cookies['coderCookie'];
    
    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decoded;
        }
        next();
    });
};