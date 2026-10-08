import Equipment from "../models/equipment.model.js";
import MaintenanceOrder from "../models/maintenanceOrder.model.js";

export const getAllEquipment = async () => {
    return await Equipment.find().lean();
};

export const getEquipmentById = async (id) => {
    return await Equipment.findById(id);
};

export const createEquipmentService = async (equipmentData) => {
    return await Equipment.create(equipmentData);
};

export const updateEquipmentService = async (id, equipmentData) => {
    return await Equipment.findByIdAndUpdate(
        id,
        equipmentData,
        {
            returnDocument: "after",
            runValidators: true
        }
    );
};

export const deleteEquipmentService = async (id) => {

    const equipment = await Equipment.findById(id);

    if (!equipment) {

        return null;

    }

    const activeMaintenanceOrder = await MaintenanceOrder.findOne({

        equipment: id,

        status: {

            $in: ["pending", "in_progress"]

        }

    });

    if (activeMaintenanceOrder) {

        const error = new Error(

            "No se puede eliminar el equipo porque tiene una orden de mantenimiento activa"

        );

        error.statusCode = 409;

        error.maintenanceOrderId = activeMaintenanceOrder._id;

        throw error;

    }

    await MaintenanceOrder.deleteMany({

        equipment: id,

        status: {

            $in: ["completed", "cancelled"]

        }

    });

    return await Equipment.findByIdAndDelete(id);

};