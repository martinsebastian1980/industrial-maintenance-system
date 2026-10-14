import test from "node:test";
import assert from "node:assert/strict";
import esmock from "esmock";

test("permite pasar una orden de pending a in_progress", async () => {
    const order = {
        _id: "orden-123",
        status: "pending",
        startedAt: null,
        completedAt: null,
        save: async function () {
            return this;
        }
    };

    let historyCalls = 0;

    const { updateMaintenanceOrderStatusService } = await esmock(
        "../src/services/maintenanceOrder.service.js",
        {
            "../src/services/maintenanceOrderHistory.service.js": {
                createMaintenanceOrderHistory: async () => {
                    historyCalls++;
                    return {};
                }
            }
        }
    );

    const { default: MaintenanceOrder } = await import(
        "../src/models/maintenanceOrder.model.js"
    );

    const originalFindById = MaintenanceOrder.findById;

    try {
        MaintenanceOrder.findById = async () => order;

        const result = await updateMaintenanceOrderStatusService(
            "orden-123",
            "in_progress"
        );

        assert.equal(result.status, "in_progress");
        assert.ok(result.startedAt instanceof Date);
        assert.equal(historyCalls, 1);
    } finally {
        MaintenanceOrder.findById = originalFindById;
    }
});

test("permite pasar una orden de in_progress a completed", async () => {
    const order = {
        _id: "orden-123",
        status: "in_progress",
        startedAt: new Date("2026-10-01T10:00:00Z"),
        completedAt: null,
        save: async function () {
            return this;
        }
    };

    let historyCalls = 0;

    const { updateMaintenanceOrderStatusService } = await esmock(
        "../src/services/maintenanceOrder.service.js",
        {
            "../src/services/maintenanceOrderHistory.service.js": {
                createMaintenanceOrderHistory: async () => {
                    historyCalls++;
                    return {};
                }
            }
        }
    );

    const { default: MaintenanceOrder } = await import(
        "../src/models/maintenanceOrder.model.js"
    );

    const originalFindById = MaintenanceOrder.findById;

    try {
        MaintenanceOrder.findById = async () => order;

        const result = await updateMaintenanceOrderStatusService(
            "orden-123",
            "completed"
        );

        assert.equal(result.status, "completed");
        assert.ok(result.completedAt instanceof Date);
        assert.equal(historyCalls, 1);
    } finally {
        MaintenanceOrder.findById = originalFindById;
    }
});

test("rechaza una transición de estado no permitida", async () => {
    const order = {
        _id: "orden-123",
        status: "pending",
        startedAt: null,
        completedAt: null,
        save: async function () {
            return this;
        }
    };

    const { updateMaintenanceOrderStatusService } = await esmock(
        "../src/services/maintenanceOrder.service.js",
        {
            "../src/services/maintenanceOrderHistory.service.js": {
                createMaintenanceOrderHistory: async () => {
                    throw new Error("No debería registrar el historial");
                }
            }
        }
    );

    const { default: MaintenanceOrder } = await import(
        "../src/models/maintenanceOrder.model.js"
    );

    const originalFindById = MaintenanceOrder.findById;

    try {
        MaintenanceOrder.findById = async () => order;

        await assert.rejects(
            updateMaintenanceOrderStatusService("orden-123", "completed"),
            (error) => {
                assert.equal(error.statusCode, 400);
                return true;
            }
        );

        assert.equal(order.status, "pending");
    } finally {
        MaintenanceOrder.findById = originalFindById;
    }
});

test("devuelve error 404 si la orden no existe", async () => {
    const { updateMaintenanceOrderStatusService } = await esmock(
        "../src/services/maintenanceOrder.service.js",
        {
            "../src/services/maintenanceOrderHistory.service.js": {
                createMaintenanceOrderHistory: async () => ({})
            }
        }
    );

    const { default: MaintenanceOrder } = await import(
        "../src/models/maintenanceOrder.model.js"
    );

    const originalFindById = MaintenanceOrder.findById;

    try {
        MaintenanceOrder.findById = async () => null;

        await assert.rejects(
            updateMaintenanceOrderStatusService(
                "orden-inexistente",
                "in_progress"
            ),
            (error) => {
                assert.equal(error.statusCode, 404);
                assert.equal(
                    error.message,
                    "Orden de mantenimiento no encontrada"
                );
                return true;
            }
        );
    } finally {
        MaintenanceOrder.findById = originalFindById;
    }
});