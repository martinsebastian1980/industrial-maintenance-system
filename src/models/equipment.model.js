import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        model: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["operational", "maintenance", "inactive"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;