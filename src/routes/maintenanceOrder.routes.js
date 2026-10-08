import express from "express";

import {
    getMaintenanceOrders,
    getMaintenanceOrder,
    createMaintenanceOrder,
    updateMaintenanceOrder,
    deleteMaintenanceOrder,
    updateMaintenanceOrderStatus
} from "../controllers/maintenanceOrder.controller.js";

import {
    getMaintenanceOrderHistoryController
} from "../controllers/maintenanceOrderHistory.controller.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
    "/",
    isAuthenticated,
    asyncHandler(getMaintenanceOrders)
);

router.get(
    "/:id/history",
    isAuthenticated,
    asyncHandler(getMaintenanceOrderHistoryController)
);

router.get(
    "/:id",
    isAuthenticated,
    asyncHandler(getMaintenanceOrder)
);

router.post("/",
                isAuthenticated,
                authorizeRoles("admin", "supervisor"),
                asyncHandler(createMaintenanceOrder)
            );

router.put(
    "/:id",
    isAuthenticated,
    authorizeRoles("admin", "supervisor"),
    asyncHandler(updateMaintenanceOrder)
);

router.patch(
    "/:id/status",
    isAuthenticated,
    asyncHandler(updateMaintenanceOrderStatus)
);

router.delete(
    "/:id",
    isAuthenticated,
    asyncHandler(deleteMaintenanceOrder)
);

export default router;