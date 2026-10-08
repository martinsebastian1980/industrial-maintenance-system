import express from "express";

import {
    createUserController,
    getAllUsersController,
    getUserByIdController
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post(
    "/",
    isAuthenticated,
    authorizeRoles("admin"),
    createUserController
);

router.get(
    "/",
    isAuthenticated,
    verifyToken,
    authorizeRoles("admin"),
    getAllUsersController
);

router.get(
    "/:id",
    isAuthenticated,
    verifyToken,
    authorizeRoles("admin"),
    getUserByIdController
);

export default router;