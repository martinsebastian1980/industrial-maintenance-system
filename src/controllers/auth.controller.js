import { loginUser } from "../services/auth.service.js";
import { generateToken } from "../services/jwt.service.js";

export const loginController = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);
        const token = generateToken(user);

        req.session.user = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};