import test, { mock } from "node:test";
import assert from "node:assert/strict";

import Equipment from "../src/models/equipment.model.js";
import MaintenanceOrder from "../src/models/maintenanceOrder.model.js";
import { deleteEquipmentService } from "../src/services/equipment.service.js";

test("devuelve null si el equipo no existe", async (t) => {
    t.mock.method(Equipment, "findById", async () => null);

    const result = await deleteEquipmentService("id-inexistente");

    assert.equal(result, null);
});

test("impide eliminar un equipo con una orden pendiente", async (t) => {
    const equipmentId = "equipo-123";
    const orderId = "orden-456";

    t.mock.method(Equipment, "findById", async () => ({
        _id: equipmentId
    }));

    t.mock.method(MaintenanceOrder, "findOne", async () => ({
        _id: orderId
    }));

    const deleteManyMock = t.mock.method(
        MaintenanceOrder,
        "deleteMany",
        async () => ({ deletedCount: 0 })
    );

    await assert.rejects(
        deleteEquipmentService(equipmentId),
        (error) => {
            assert.equal(error.statusCode, 409);
            assert.equal(error.maintenanceOrderId, orderId);
            return true;
        }
    );

    assert.equal(deleteManyMock.mock.callCount(), 0);
});

test("permite eliminar el equipo si no tiene órdenes activas", async (t) => {
    const equipmentId = "equipo-123";
    const equipment = { _id: equipmentId };

    t.mock.method(Equipment, "findById", async () => equipment);
    t.mock.method(MaintenanceOrder, "findOne", async () => null);

    const deleteManyMock = t.mock.method(
        MaintenanceOrder,
        "deleteMany",
        async () => ({ deletedCount: 2 })
    );

    const deleteEquipmentMock = t.mock.method(
        Equipment,
        "findByIdAndDelete",
        async () => equipment
    );

    const result = await deleteEquipmentService(equipmentId);

    assert.equal(result, equipment);
    assert.equal(deleteManyMock.mock.callCount(), 1);
    assert.equal(deleteEquipmentMock.mock.callCount(), 1);
});
