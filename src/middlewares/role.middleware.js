export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        const user = req.user || req.session.user;

        if (!user) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: "No tienes permisos para realizar esta acción"
            });
        }

        next();
    };
};