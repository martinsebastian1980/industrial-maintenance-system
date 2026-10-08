import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
        ...userData,
        password: hashedPassword
    });

    return user;
};

export const getAllUsers = async () => {
    const users = await User.find().select("-password");

    return users;
};

export const getUserById = async (id) => {
    const user = await User.findById(id).select("-password");

    return user;
};

export const updateUser = async (id, userData) => {

    const user = await User.findByIdAndUpdate(
        id,
        userData,
        {
            returnDocument: "after",
            runValidators: true
        }
    ).select("-password");

    return user;
};