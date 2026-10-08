import {
    createUser,
    getAllUsers,
    getUserById
} from "../services/user.service.js";

export const createUserController = async (req, res, next) => {
    try {
        const user = await createUser(req.body);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {

        const users = await getAllUsers();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};