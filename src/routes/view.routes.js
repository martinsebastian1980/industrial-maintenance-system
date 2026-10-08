import express from "express";

import {
    getHome,
    getEquipmentList,
    getNewEquipment,
    getEquipment,
    deleteEquipment,
    getEditEquipment,
    createEquipment,
    updateEquipment,
    getMaintenanceOrders,
    getMaintenanceOrder,
    getNewMaintenanceOrder,
    createMaintenanceOrder,
    getEditMaintenanceOrder,
    updateMaintenanceOrder,
    updateMaintenanceOrderStatus,
    deleteMaintenanceOrder,
    getLogin,
    login,
    logout,
    getUsers,
    getNewUser,
    createUserView,
    getUser,
    getEditUser,
    updateUserView
} from "../controllers/view.controller.js";

import { isAuthenticatedView } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/login", getLogin);

router.post("/login", login);

router.post("/logout", logout);


router.use(isAuthenticatedView);


router.get("/", getHome);

router.get(
    "/users",
    authorizeRoles("admin"),
    getUsers
);

router.get(
    "/users/new",
    authorizeRoles("admin"),
    getNewUser
);

router.get(
    "/users/:id",
    authorizeRoles("admin"),
    getUser
);

router.get(
    "/users/:id/edit",
    authorizeRoles("admin"),
    getEditUser
);

router.post(
    "/users/:id/edit",
    authorizeRoles("admin"),
    updateUserView
);

router.get("/maintenance-orders", getMaintenanceOrders);

router.get(
    "/maintenance-orders/new",
    authorizeRoles("admin", "supervisor"),
    getNewMaintenanceOrder
);

router.get("/maintenance-orders/:id",getMaintenanceOrder);

router.get(
    "/maintenance-orders/:id/edit",
    authorizeRoles("admin", "supervisor"),
    getEditMaintenanceOrder
);



router.get(
    "/equipment/new",
    authorizeRoles("admin"),
    getNewEquipment
);

router.get(
    "/equipment/:id/edit",
    authorizeRoles("admin"),
    getEditEquipment
);

router.get("/equipment", getEquipmentList);

router.get("/equipment/:id", getEquipment);

router.post(
    "/equipment",
    authorizeRoles("admin"),
    createEquipment
);

router.post(
    "/equipment/:id/edit",
    authorizeRoles("admin"),
    updateEquipment
);

router.post(
    "/equipment/:id/delete",
    authorizeRoles("admin"),
    deleteEquipment
);

router.post(
    "/maintenance-orders",
    authorizeRoles("admin", "supervisor"),
    createMaintenanceOrder
);

router.post(
    "/maintenance-orders/:id/edit",
    authorizeRoles("admin", "supervisor"),
    updateMaintenanceOrder
);

router.post(
    "/maintenance-orders/:id/status",
    authorizeRoles("admin", "supervisor", "technician"),
    updateMaintenanceOrderStatus
);

router.post(
    "/maintenance-orders/:id/delete",
    authorizeRoles("admin"),
    deleteMaintenanceOrder
);

router.post(
    "/users",
    authorizeRoles("admin"),
    createUserView
);

export default router;