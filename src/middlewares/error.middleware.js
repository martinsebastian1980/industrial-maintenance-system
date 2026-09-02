export const errorMiddleware = (err, req, res, next) => {

    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Error interno del servidor";

    if (err.name === "CastError") {

        statusCode = 400;
        message = "ID inválido";

    }

    if (req.path.startsWith("/api")) {

        return res.status(statusCode).json({
            message
        });

    }

    return res.status(statusCode).render("error", {

    message,

    statusCode,

    returnUrl: err.returnUrl,

    maintenanceOrderId: err.maintenanceOrderId

});

};