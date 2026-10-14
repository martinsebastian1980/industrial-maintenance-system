import test from "node:test";
import assert from "node:assert/strict";
import { validateEquipment } from "../src/validators/equipment.validator.js";

const validEquipment = {
    name: "Motor eléctrico",
    brand: "Siemens",
    model: "1LE1001",
    status: "operational"
};

test("acepta un equipo válido", () => {
    assert.deepEqual(
        validateEquipment(validEquipment),
        { valid: true }
    );
});

test("rechaza un equipo sin nombre", () => {
    const equipment = { ...validEquipment, name: "" };

    assert.deepEqual(
        validateEquipment(equipment),
        {
            valid: false,
            message: "Name, brand, model y status son obligatorios"
        }
    );
});

test("rechaza un estado de equipo inválido", () => {
    const equipment = { ...validEquipment, status: "broken" };

    assert.deepEqual(
        validateEquipment(equipment),
        {
            valid: false,
            message: "El status debe ser operational, maintenance o inactive"
        }
    );
});

test("acepta el estado maintenance", () => {
    const equipment = { ...validEquipment, status: "maintenance" };

    assert.deepEqual(
        validateEquipment(equipment),
        { valid: true }
    );
});

test("acepta el estado inactive", () => {
    const equipment = { ...validEquipment, status: "inactive" };

    assert.deepEqual(
        validateEquipment(equipment),
        { valid: true }
    );
});
