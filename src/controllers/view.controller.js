import { getDashboardData } from "../services/dashboard.service.js";
import { getAllMaintenanceOrders,
         getMaintenanceOrderById,
         createMaintenanceOrderService,
         updateMaintenanceOrderService,
         updateMaintenanceOrderStatusService,
         deleteMaintenanceOrderService,
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

import { loginUser } from "../services/auth.service.js";

import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser
} from "../services/user.service.js";

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
            maintenanceOrders: maintenanceOrders.data,
            user: req.session.user
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
            maintenanceOrder: maintenanceOrder.toObject(),
            history: history.map(
                (item) => item.toObject()
            ),
            user: req.session.user
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
        const users = await getAllUsers();

        const technicians = users
            .filter(user => user.role === "technician")
            .map(user => user.toObject());

        res.render("new-maintenance-order", {
            equipment,
            technicians
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

        const users = await getAllUsers();

        const technicians = users
            .filter(user => user.role === "technician")
            .map(user => user.toObject());

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

            equipment,

            technicians
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

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render("users", {
            users: users.map(user => user.toObject()),
            user: req.session.user
        });

    } catch (error) {
        next(error);
    }
};

export const getNewUser = (req, res) => {
    res.render("new-user", {
        user: req.session.user
    });
};

export const createUserView = async (req, res, next) => {
    try {
        await createUser(req.body);

        res.redirect("/users");

    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.render("user-detail", {
            userDetail: user.toObject(),
            user: req.session.user
        });

    } catch (error) {
        next(error);
    }
};

export const getEditUser = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.render("edit-user", {
            userDetail: user.toObject(),
            user: req.session.user
        });

    } catch (error) {
        next(error);
    }
};

export const updateUserView = async (req, res, next) => {
    try {
        const user = await updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.redirect("/users");

    } catch (error) {
        next(error);
    }
};

export const getLogin = (req, res) => {
    res.render("login");
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.redirect("/login");
    });
};