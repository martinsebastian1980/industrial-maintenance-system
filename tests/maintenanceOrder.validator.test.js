import test from "node:test";
import assert from "node:assert/strict";
import { validateMaintenanceOrder } from "../src/validators/maintenanceOrder.validator.js";

const validOrder = {
    equipment: "equipment-id",
    title: "Revisión de motor",
    description: "Revisión preventiva del motor",
    type: "preventive",
    priority: "medium",
    scheduledDate: "2026-10-08"
};

test("acepta una orden de mantenimiento válida", () => {
    assert.deepEqual(
        validateMaintenanceOrder(validOrder),
        { valid: true }
    );
});

test("rechaza una orden sin título", () => {
    const order = { ...validOrder, title: "" };

    assert.deepEqual(
        validateMaintenanceOrder(order),
        {
            valid: false,
            message: "El campo title es obligatorio"
        }
    );
});

test("rechaza un tipo de mantenimiento inválido", () => {
    const order = { ...validOrder, type: "urgent" };

    assert.deepEqual(
        validateMaintenanceOrder(order),
        {
            valid: false,
            message: "Tipo de mantenimiento inválido"
        }
    );
});

test("rechaza una prioridad inválida", () => {
    const order = { ...validOrder, priority: "critical" };

    assert.deepEqual(
        validateMaintenanceOrder(order),
        {
            valid: false,
            message: "Prioridad inválida"
        }
    );
});

test("rechaza un técnico asignado que no sea una cadena de texto", () => {
    const order = { ...validOrder, assignedTo: 123 };

    assert.deepEqual(
        validateMaintenanceOrder(order),
        {
            valid: false,
            message: "El técnico asignado no es válido"
        }
    );
});
