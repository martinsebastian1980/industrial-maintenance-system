import mongoose from "mongoose";

const maintenanceOrderHistorySchema = new mongoose.Schema(
    {
        maintenanceOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MaintenanceOrder",
            required: true
        },

        fromStatus: {
            type: String,
            required: true
        },

        toStatus: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "MaintenanceOrderHistory",
    maintenanceOrderHistorySchema
);