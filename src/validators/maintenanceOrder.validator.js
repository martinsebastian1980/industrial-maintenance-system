export const validateMaintenanceOrder = (data) => {
    const requiredFields = [
        "equipment",
        "title",
        "description",
        "type",
        "priority",
        "scheduledDate"
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            return {
                valid: false,
                message: `El campo ${field} es obligatorio`
            };
        }
    }

    const validTypes = ["preventive", "corrective"];

    if (!validTypes.includes(data.type)) {
        return {
            valid: false,
            message: "Tipo de mantenimiento inválido"
        };
    }

    const validPriorities = [
        "low",
        "medium",
        "high"        
    ];

    if (!validPriorities.includes(data.priority)) {
        return {
            valid: false,
            message: "Prioridad inválida"
        };
    }

    return {
        valid: true
    };
};