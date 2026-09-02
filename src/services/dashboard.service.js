import Equipment from "../models/equipment.model.js";

import MaintenanceOrder from "../models/maintenanceOrder.model.js";

export const getDashboardData = async () => {

    const equipmentCount =
        await Equipment.countDocuments();

    const maintenanceOrderCount =
        await MaintenanceOrder.countDocuments();

    const pendingOrders =
        await MaintenanceOrder.countDocuments({
            status: "pending"
        });

    const inProgressOrders =
        await MaintenanceOrder.countDocuments({
            status: "in_progress"
        });

    const completedOrders =
        await MaintenanceOrder.countDocuments({
            status: "completed"
        });

    const cancelledOrders =
        await MaintenanceOrder.countDocuments({
            status: "cancelled"
        });

    const operationalEquipment =
        await Equipment.countDocuments({
            status: "operational"
        });

    const maintenanceEquipment =
        await Equipment.countDocuments({
            status: "maintenance"
        });

    const inactiveEquipment =
        await Equipment.countDocuments({
            status: "inactive"
        });

    return {

        equipmentCount,

        maintenanceOrderCount,

        pendingOrders,

        inProgressOrders,

        completedOrders,

        cancelledOrders,

        operationalEquipment,

        maintenanceEquipment,

        inactiveEquipment

    };

};