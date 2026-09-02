import mongoose from "mongoose";

const maintenanceOrderSchema = new mongoose.Schema(
    {
        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["preventive", "corrective"],
            required: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending"
        },
        startedAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        },
        scheduledDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);
const MaintenanceOrder = mongoose.model(
    "MaintenanceOrder",
    maintenanceOrderSchema
);
export default MaintenanceOrder;