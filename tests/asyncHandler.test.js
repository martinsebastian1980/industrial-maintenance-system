import test from "node:test";
import assert from "node:assert/strict";
import { asyncHandler } from "../src/middlewares/asyncHandler.js";

test("asyncHandler pasa el error al siguiente middleware", async () => {
    const expectedError = new Error("Error de prueba");
    let receivedError;

    const handler = asyncHandler(async () => {
        throw expectedError;
    });

    const req = {};
    const res = {};
    const next = (error) => {
        receivedError = error;
    };

    handler(req, res, next);

    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(receivedError, expectedError);
});

test("asyncHandler ejecuta correctamente una función sincrónica", async () => {
    let executed = false;

    const handler = asyncHandler(() => {
        executed = true;
    });

    handler({}, {}, () => {});

    assert.equal(executed, true);
});
