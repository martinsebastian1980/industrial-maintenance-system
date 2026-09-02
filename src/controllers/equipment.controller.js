import { validateEquipment } from "../validators/equipment.validator.js";

import {
    getAllEquipment,
    getEquipmentById,
    createEquipmentService,
    updateEquipmentService,
    deleteEquipmentService
} from "../services/equipment.service.js";

export const getEquipment = async (req, res) => {
    const equipment = await getAllEquipment();

    res.json(equipment);
};

export const getEquipmentByIdController = async (req, res) => {
    const id = req.params.id;

    const equipment = await getEquipmentById(id);

    if (!equipment) {
        return res.status(404).json({
            message: "Equipo no encontrado"
        });
    }

    res.json(equipment);
};

export const createEquipment = async (req, res) => {
    const validation = validateEquipment(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message
        });
    }

    const newEquipment = await createEquipmentService(req.body);

    res.status(201).json({
        message: "Equipo creado correctamente",
        equipment: newEquipment
    });
};

export const updateEquipment = async (req, res) => {
    const id = req.params.id;

    const validation = validateEquipment(req.body);

    if (!validation.valid) {
        return res.status(400).json({
            message: validation.message
        });
    }

    const updatedEquipment = await updateEquipmentService(
        id,
        req.body
    );

    if (!updatedEquipment) {
        return res.status(404).json({
            message: "Equipo no encontrado"
        });
    }

    res.json({
        message: "Equipo actualizado correctamente",
        equipment: updatedEquipment
    });
};

export const deleteEquipment = async (req, res) => {
    const id = req.params.id;

    const deletedEquipment = await deleteEquipmentService(id);

    if (!deletedEquipment) {
        return res.status(404).json({
            message: "Equipo no encontrado"
        });
    }

    res.json({
        message: "Equipo eliminado correctamente",
        equipment: deletedEquipment
    });
};