import { validateMaintenanceOrder } from "../validators/maintenanceOrder.validator.js";

import {
    getAllMaintenanceOrders,
    getMaintenanceOrderById,
    createMaintenanceOrderService,
    updateMaintenanceOrderService,
    deleteMaintenanceOrderService,
    updateMaintenanceOrderStatusService
} from "../services/maintenanceOrder.service.js";

export const getMaintenanceOrders = async (req, res) => {
    const {
        status,
        priority,
        type,
        search,
        page = 1,
        limit = 10,
        sort = "-createdAt"
    } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (
        !Number.isInteger(pageNumber) ||
        pageNumber < 1
    ) {
        return res.status(400).json({
            message: "El parámetro page debe ser un número entero mayor a 0"
        });
    }
    if (
        !Number.isInteger(limitNumber) ||
        limitNumber < 1 ||
        limitNumber > 100
    ) {
        return res.status(400).json({
            message: "El parámetro limit debe ser un número entero entre 1 y 100"
        });
    }
    const filters = {
        status,
        priority,
        type,
        search
    };
    const result = await getAllMaintenanceOrders(
        filters,
        pageNumber,
        limitNumber,
        sort
    );
    res.json(result);
};

export const getMaintenanceOrder = async (req, res) => {
    const id = req.params.id;

    const order = await getMaintenanceOrderById(id);

    if (!order) {
        return res.status(404).json({
            message: "Orden de mantenimiento no encontrada"
        });
    }

    res.json(order);
};

export const createMaintenanceOrder = async (req, res) => {
    const validation = validateMaintenanceOrder(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message
        });
    }

    const newOrder = await createMaintenanceOrderService(req.body);

    res.status(201).json({
        message: "Orden de mantenimiento creada correctamente",
        order: newOrder
    });
};

export const updateMaintenanceOrder = async (req, res) => {
    const id = req.params.id;

    const validation = validateMaintenanceOrder(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message
        });
    }

    const updatedOrder = await updateMaintenanceOrderService(
        id,
        req.body
    );

    if (!updatedOrder) {
        return res.status(404).json({
            message: "Orden de mantenimiento no encontrada"
        });
    }

    res.json({
        message: "Orden de mantenimiento actualizada correctamente",
        order: updatedOrder
    });
};

export const deleteMaintenanceOrder = async (req, res) => {
    const id = req.params.id;

    const deletedOrder = await deleteMaintenanceOrderService(id);

    if (!deletedOrder) {
        return res.status(404).json({
            message: "Orden de mantenimiento no encontrada"
        });
    }

    res.json({
        message: "Orden de mantenimiento eliminada correctamente",
        order: deletedOrder
    });
};

export const updateMaintenanceOrderStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const validStatuses = [
        "pending",
        "in_progress",
        "completed",
        "cancelled"
    ];
    if (!status) {
        return res.status(400).json({
            message: "El campo status es obligatorio"
        });
    }
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Estado de mantenimiento inválido"
        });
    }
    const updatedOrder = await updateMaintenanceOrderStatusService(
        id,status);
    res.json({
        message: "Estado actualizado correctamente",
        order: updatedOrder
    });
};