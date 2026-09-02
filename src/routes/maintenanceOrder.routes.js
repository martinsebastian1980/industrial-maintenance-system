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

const router = express.Router();

router.get("/", asyncHandler(getMaintenanceOrders));

router.get(
    "/:id/history",
    asyncHandler(getMaintenanceOrderHistoryController)
);

router.get("/:id", asyncHandler(getMaintenanceOrder));

router.post("/", asyncHandler(createMaintenanceOrder));

router.put("/:id", asyncHandler(updateMaintenanceOrder));

router.patch("/:id/status",asyncHandler(updateMaintenanceOrderStatus));

router.delete("/:id", asyncHandler(deleteMaintenanceOrder));

export default router;