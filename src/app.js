import express from "express";
import { engine } from "express-handlebars";

import viewRouter from "./routes/view.routes.js";
import equipmentRouter from "./routes/equipment.routes.js";
import maintenanceOrderRouter from "./routes/maintenanceOrder.routes.js";

import { connectDB } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.engine(
    "handlebars",
    engine({
        defaultLayout: false,
        helpers: {
                    eq: (a, b) => a === b,
                    equipmentStatus: (status) => {
                    const statuses = {
                    operational: "Operativo",
                    maintenance: "En mantenimiento",
                    inactive: "Fuera de servicio"
                    };
                    return statuses[status] || status;
                    },
                    orderStatus: (status) => {
                    const statuses = {
                        pending: "Pendiente",
                        in_progress: "En progreso",
                        completed: "Completada",
                        cancelled: "Cancelada"
                    };
                        return statuses[status] || status;
                    },
                    maintenanceType: (type) => {
                    const types = {
                        preventive: "Preventivo",
                        corrective: "Correctivo"
                    };
                    return types[type] || type;
                    },
                    priority: (priority) => {
                    const priorities = {
                        low: "Baja",
                        medium: "Media",
                        high: "Alta"
                    };
                        return priorities[priority] || priority;
                    }
                    }
                })
);

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.use("/", viewRouter);

app.use("/api/equipment", equipmentRouter);
app.use("/api/maintenance-orders", maintenanceOrderRouter);

app.use(errorMiddleware);

connectDB();

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});