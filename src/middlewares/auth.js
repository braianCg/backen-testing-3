export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'error', error: 'No autorizado' });

        if (roles.includes('PUBLIC')) return next();

        if (!roles.includes(req.user.role.toUpperCase())) {
            return res.status(403).send({ status: 'error', error: 'No tienes permisos' });
        }
        
        next();
    };
};