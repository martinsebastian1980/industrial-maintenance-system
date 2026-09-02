export const handlebarsHelpers = {

    eq: (a, b) => a === b,

    equipmentStatus: (status) => {

        const statuses = {

            operational: "Operativo",

            maintenance: "En mantenimiento",

            inactive: "Fuera de servicio"

        };

        return statuses[status] || status;

    },

    orderStatus: (status) => {

        const statuses = {

            pending: "Pendiente",

            in_progress: "En progreso",

            completed: "Completada",

            cancelled: "Cancelada"

        };

        return statuses[status] || status;

    },

    maintenanceType: (type) => {

        const types = {

            preventive: "Preventivo",

            corrective: "Correctivo"

        };

        return types[type] || type;

    },

    priority: (priority) => {

        const priorities = {

            low: "Baja",

            medium: "Media",

            high: "Alta"

        };

        return priorities[priority] || priority;

    }

};