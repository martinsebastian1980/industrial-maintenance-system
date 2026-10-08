import express from "express";
import { engine } from "express-handlebars";

import viewRouter from "./routes/view.routes.js";
import equipmentRouter from "./routes/equipment.routes.js";
import maintenanceOrderRouter from "./routes/maintenanceOrder.routes.js";

import { connectDB } from "./config/database.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { handlebarsHelpers } from "./helpers/handlebars.helpers.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

import session from "express-session";

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.engine(
    "handlebars",
    engine({
        defaultLayout: false,
        helpers: handlebarsHelpers
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
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use(errorMiddleware);

connectDB();

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});