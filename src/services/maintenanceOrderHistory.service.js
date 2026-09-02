import MaintenanceOrderHistory from "../models/maintenanceOrderHistory.model.js";

export const createMaintenanceOrderHistory = async (
    maintenanceOrder,
    fromStatus,
    toStatus
) => {
    const history = await MaintenanceOrderHistory.create({
        maintenanceOrder,
        fromStatus,
        toStatus
    });

    return history;
};

export const getMaintenanceOrderHistory = async (maintenanceOrderId) => {
    const history = await MaintenanceOrderHistory
        .find({ maintenanceOrder: maintenanceOrderId })
        .sort({ createdAt: 1 });

    return history;
};