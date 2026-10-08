import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
        const error = new Error("Credenciales inválidas");
        error.statusCode = 401;
        throw error;
    }

    return user;
};