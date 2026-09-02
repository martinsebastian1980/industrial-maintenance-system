import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        console.log(
            "MongoDB:",
            process.env.MONGO_URI?.replace(
                /\/\/([^:]+):([^@]+)@/,
                "//$1:****@"
            )
        );

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado correctamente");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};