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
    deleteMaintenanceOrder
} from "../controllers/view.controller.js";

const router = express.Router();

router.get("/", getHome);

router.get("/maintenance-orders", getMaintenanceOrders);

router.get("/maintenance-orders/new",getNewMaintenanceOrder);

router.get("/maintenance-orders/:id",getMaintenanceOrder);

router.get("/maintenance-orders/:id/edit",getEditMaintenanceOrder);

router.get("/equipment/new", getNewEquipment);

router.get("/equipment/:id/edit", getEditEquipment);

router.get("/equipment", getEquipmentList);

router.get("/equipment/:id", getEquipment);

router.post("/equipment", createEquipment);

router.post("/equipment/:id/edit", updateEquipment);

router.post("/equipment/:id/delete", deleteEquipment);

router.post("/maintenance-orders",createMaintenanceOrder);

router.post("/maintenance-orders/:id/edit",updateMaintenanceOrder);

router.post("/maintenance-orders/:id/status",updateMaintenanceOrderStatus);

router.post("/maintenance-orders/:id/delete",deleteMaintenanceOrder);

export default router;