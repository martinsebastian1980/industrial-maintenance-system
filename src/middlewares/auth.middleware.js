export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "No estás autenticado"
        });
    }

    next();
};
export const isAuthenticatedView = (req, res, next) => {

    if (req.originalUrl.startsWith("/api")) {
        return next();
    }

    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
};
