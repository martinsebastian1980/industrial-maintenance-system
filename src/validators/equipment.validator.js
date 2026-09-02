const allowedStatuses = ["operational","maintenance","inactive"];

export const validateEquipment = (equipmentData) => {
    const { name, brand, model, status } = equipmentData;

    if (!name || !brand || !model || !status) {
        return {valid: false, message: "Name, brand, model y status son obligatorios"};
    }

    if (!allowedStatuses.includes(status)) {
        return {valid: false,message: "El status debe ser operational, maintenance o inactive"};
    }

    return {valid: true};
};