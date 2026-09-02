import express from "express";
import {getEquipment,getEquipmentByIdController,createEquipment,updateEquipment,deleteEquipment} from "../controllers/equipment.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(getEquipment));
router.post("/", asyncHandler(createEquipment));
router.get("/:id", asyncHandler(getEquipmentByIdController));
router.put("/:id", asyncHandler(updateEquipment));
router.delete("/:id", asyncHandler(deleteEquipment));

export default router;