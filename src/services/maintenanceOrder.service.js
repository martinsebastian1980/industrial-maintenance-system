import Equipment from "../models/equipment.model.js";
import MaintenanceOrder from "../models/maintenanceOrder.model.js";
import { createMaintenanceOrderHistory } from "./maintenanceOrderHistory.service.js";

export const getAllMaintenanceOrders = async (
    filters = {},
    page = 1,
    limit = 10,
    sort = "-createdAt"
) => {
        page = Number(page);
        limit = Number(limit);

        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }
        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }
        if (limit > 100) {
            limit = 100;
        }
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.priority) {
        query.priority = filters.priority;
    }
    if (filters.type) {
        query.type = filters.type;
    }
    if (filters.search) {
        const equipment = await Equipment.find({
            name: {
               $regex: filters.search,
                $options: "i"
            }
        });
        const equipmentIds = equipment.map(
            (item) => item._id
        );
        query.$or = [
            {
                title: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: filters.search,
                    $options: "i"
                }
            },
            {
                equipment: {
                    $in: equipmentIds
                }
            }
        ];
    }
    const skip = (page - 1) * limit;
    const orders = await MaintenanceOrder
        .find(query)
        .populate("equipment")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    const total = await MaintenanceOrder.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    return {
        data: orders,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
};

export const getMaintenanceOrderById = async (id) => {
    return await MaintenanceOrder
        .findById(id)
        .populate("equipment");
};

export const createMaintenanceOrderService = async (orderData) => {
    const equipment = await Equipment.findById(orderData.equipment);

    if (!equipment) {
        const error = new Error("Equipo no encontrado");
        error.statusCode = 404;

        throw error;
    }

    return await MaintenanceOrder.create(orderData);
};

export const updateMaintenanceOrderService = async (id, orderData) => {

    const updateData = {

        equipment: orderData.equipment,

        title: orderData.title,

        description: orderData.description,

        type: orderData.type,

        priority: orderData.priority,

        scheduledDate: orderData.scheduledDate

    };

    return await MaintenanceOrder.findByIdAndUpdate(

        id,

        updateData,

        {
            new: true,
            runValidators: true
        }

    );

};

export const deleteMaintenanceOrderService = async (id) => {
    return await MaintenanceOrder.findByIdAndDelete(id);
};

export const updateMaintenanceOrderStatusService = async (id, status) => {
    const order = await MaintenanceOrder.findById(id);

    if (!order) {
        const error = new Error("Orden de mantenimiento no encontrada");
        error.statusCode = 404;

        throw error;
    }
    const allowedTransitions = {
        pending: ["in_progress", "cancelled"],
        in_progress: ["completed", "cancelled"],
        completed: [],
        cancelled: []
    };
    

    if (order.status === status) {
    const error = new Error(
        `La orden ya se encuentra en estado ${status}`
    );
    error.statusCode = 400
    throw error;
}
    const allowedStatuses = allowedTransitions[order.status];
    if (!allowedStatuses.includes(status)) {
        const error = new Error(
            `No se puede cambiar de ${order.status} a ${status}`
        );
        error.statusCode = 400;
        throw error;
    }
    const previousStatus = order.status;

    order.status = status;
    if (status === "in_progress" && !order.startedAt) {
        order.startedAt = new Date();
    }
    if (status === "completed" && !order.completedAt) {
        order.completedAt = new Date();
    }
    await order.save();
    await createMaintenanceOrderHistory(
        order._id,
        previousStatus,
        status
    );
    return order;
};