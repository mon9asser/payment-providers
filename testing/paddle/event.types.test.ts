import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleEventTypes from "../../payment/providers/paddle/event.types";
import Adapter from "../../payment/helper/adapter";

describe("PaddleEventTypes", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let eventTypes: PaddleEventTypes;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        eventTypes = new PaddleEventTypes(adapter);
    });

    describe("all()", () => {
        it("calls GET /event-types", async () => {
            await eventTypes.all();
            expect(request).toHaveBeenCalledWith("/event-types");
        });

        it("calls the adapter exactly once with the URL only (default GET)", async () => {
            await eventTypes.all();
            expect(request).toHaveBeenCalledTimes(1);
            expect(request.mock.calls[0]).toHaveLength(1);
        });

        it("does not add a query string", async () => {
            await eventTypes.all();
            const [url] = request.mock.calls[0];
            expect(url).not.toContain("?");
        });

        it("makes a fresh request on each call", async () => {
            await eventTypes.all();
            await eventTypes.all();
            expect(request).toHaveBeenCalledTimes(2);
        });

        it("returns whatever the adapter returns", async () => {
            const response = {
                data: [{ name: "transaction.completed", description: "Transaction completed" }],
            };
            request.mockResolvedValue(response);
            await expect(eventTypes.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(eventTypes.all()).rejects.toThrow("network down");
        });
    });
});