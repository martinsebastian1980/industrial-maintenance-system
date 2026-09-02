import { getMaintenanceOrderHistory } from "../services/maintenanceOrderHistory.service.js";

export const getMaintenanceOrderHistoryController = async (req, res) => {
    const id = req.params.id;

    const history = await getMaintenanceOrderHistory(id);

    res.json(history);
};