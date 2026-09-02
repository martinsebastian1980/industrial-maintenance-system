import { getDashboardData } from "../services/dashboard.service.js";
import { getAllMaintenanceOrders,
         getMaintenanceOrderById,
         createMaintenanceOrderService,
         updateMaintenanceOrderService,
         updateMaintenanceOrderStatusService,
         deleteMaintenanceOrderService
 } from "../services/maintenanceOrder.service.js";
import { 
          getEquipmentById,
          createEquipmentService,
          updateEquipmentService,
          deleteEquipmentService
        } from "../services/equipment.service.js";
import { getAllEquipment } from "../services/equipment.service.js";
import {
    getMaintenanceOrderHistory
} from "../services/maintenanceOrderHistory.service.js";

export const getHome = async (req, res, next) => {
    try {
        const dashboard = await getDashboardData();

        const equipment = await getAllEquipment();

        const maintenanceOrders = await getAllMaintenanceOrders(
            {},
            1,
            5
        );

        res.render("home", {
            dashboard,
            equipment,
            maintenanceOrders: maintenanceOrders.data
        });
    } catch (error) {
        next(error);
    }
};

export const getEquipmentList = async (req, res, next) => {

    try {

        const equipment = await getAllEquipment();

        res.render("equipment", {
            equipment
        });

    } catch (error) {

        next(error);

    }

};

export const getNewEquipment = (req, res) => {
    res.render("new-equipment");
};

export const getEquipment = async (req, res, next) => {
    try {
        const equipment = await getEquipmentById(req.params.id);

        if (!equipment) {
            const error = new Error("Equipo no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.render("equipment-detail", {
            equipment: equipment.toObject()
        });
    } catch (error) {
        next(error);
    }
};

export const getEditEquipment = async (req, res, next) => {
    try {
        const equipment = await getEquipmentById(req.params.id);

        if (!equipment) {
            const error = new Error("Equipo no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.render("edit-equipment", {
            equipment: equipment.toObject()
        });
    } catch (error) {
        next(error);
    }
};

export const updateEquipment = async (req, res, next) => {
    try {
        const equipment = await updateEquipmentService(
            req.params.id,
            req.body
        );

        if (!equipment) {
            const error = new Error("Equipo no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.redirect(`/equipment/${equipment._id}`);
    } catch (error) {
        next(error);
    }
};

export const createEquipment = async (req, res, next) => {
    try {
        await createEquipmentService(req.body);

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const getMaintenanceOrders = async (req, res, next) => {
    try {
        const maintenanceOrders = await getAllMaintenanceOrders(
            {},
            1,
            10
        );

        res.render("maintenance-orders", {
            maintenanceOrders: maintenanceOrders.data
        });
    } catch (error) {
        next(error);
    }
};

export const getMaintenanceOrder = async (req, res, next) => {

    try {

        const maintenanceOrder =
            await getMaintenanceOrderById(
                req.params.id
            );

        if (!maintenanceOrder) {

            const error = new Error(
                "Orden de mantenimiento no encontrada"
            );

            error.statusCode = 404;

            throw error;
        }

        const history =
            await getMaintenanceOrderHistory(
                req.params.id
            );

        res.render("maintenance-order-detail", {

            maintenanceOrder:
                maintenanceOrder.toObject(),

            history: history.map(
                (item) => item.toObject()
            )

        });

    } catch (error) {

        next(error);

    }

};

export const createMaintenanceOrder = async (req, res, next) => {
    try {
        const maintenanceOrder = await createMaintenanceOrderService(
            req.body
        );

        res.redirect(`/maintenance-orders/${maintenanceOrder._id}`);
    } catch (error) {
        next(error);
    }
};

export const getNewMaintenanceOrder = async (req, res, next) => {
    try {
        const equipment = await getAllEquipment();

        res.render("new-maintenance-order", {
            equipment
        });
    } catch (error) {
        next(error);
    }
};

export const getEditMaintenanceOrder = async (req, res, next) => {

    try {

        const maintenanceOrder = await getMaintenanceOrderById(
            req.params.id
        );

        const equipment = await getAllEquipment();

        if (!maintenanceOrder) {

            const error = new Error(
                "Orden de mantenimiento no encontrada"
            );

            error.statusCode = 404;

            throw error;

        }

        const maintenanceOrderData =
            maintenanceOrder.toObject();

        maintenanceOrderData.scheduledDate =
            maintenanceOrderData.scheduledDate
                .toISOString()
                .split("T")[0];

        res.render("edit-maintenance-order", {

            maintenanceOrder: maintenanceOrderData,

            equipment

        });

    } catch (error) {

        next(error);

    }

};

export const updateMaintenanceOrder = async (req, res, next) => {
    try {
        const maintenanceOrder = await updateMaintenanceOrderService(
            req.params.id,
            req.body
        );

        if (!maintenanceOrder) {
            const error = new Error(
                "Orden de mantenimiento no encontrada"
            );

            error.statusCode = 404;
            throw error;
        }

        res.redirect(
            `/maintenance-orders/${maintenanceOrder._id}`
        );

    } catch (error) {
        next(error);
    }
};

export const updateMaintenanceOrderStatus = async (req, res, next) => {
    try {
        const maintenanceOrder =
            await updateMaintenanceOrderStatusService(
                req.params.id,
                req.body.status
            );

        res.redirect(
            `/maintenance-orders/${maintenanceOrder._id}`
        );

    } catch (error) {
        next(error);
    }
};

export const deleteMaintenanceOrder = async (
    req,
    res,
    next
) => {

    try {

        const maintenanceOrder =
            await deleteMaintenanceOrderService(
                req.params.id
            );

        if (!maintenanceOrder) {

            const error = new Error(
                "Orden de mantenimiento no encontrada"
            );

            error.statusCode = 404;

            throw error;
        }

        res.redirect("/maintenance-orders");

    } catch (error) {

        next(error);

    }

};

export const deleteEquipment = async (req, res, next) => {

    try {

        const equipment = await deleteEquipmentService(
            req.params.id
        );

        if (!equipment) {

            const error = new Error(
                "Equipo no encontrado"
            );

            error.statusCode = 404;

            throw error;
        }

        res.redirect("/");

    } catch (error) { 

        error.returnUrl = `/equipment/${req.params.id}`;

        next(error);

    }

};