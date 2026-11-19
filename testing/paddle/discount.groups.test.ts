import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleDiscountGroups from "../../payment/providers/paddle/discount.groups";
import Adapter from "../../payment/helper/adapter";

describe("PaddleDiscountGroups", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let groups: PaddleDiscountGroups;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        groups = new PaddleDiscountGroups(adapter);
    });

    describe("all()", () => {
        it("calls GET /discount-groups with no query string when no params are given", async () => {
            await groups.all();
            expect(request).toHaveBeenCalledWith("/discount-groups");
        });

        it("calls GET /discount-groups with no query string for an empty object", async () => {
            await groups.all({});
            expect(request).toHaveBeenCalledWith("/discount-groups");
        });

        it("builds a query string for a single scalar param", async () => {
            await groups.all({ per_page: 10 });
            expect(request).toHaveBeenCalledWith("/discount-groups?per_page=10");
        });

        it("joins multiple params with &", async () => {
            await groups.all({ per_page: 25, after: "dsg_123", order_by: "id[ASC]" });
            expect(request).toHaveBeenCalledWith(
                "/discount-groups?per_page=25&after=dsg_123&order_by=id[ASC]"
            );
        });

        it("serialises the id array as comma-separated values", async () => {
            await groups.all({ id: ["dsg_1", "dsg_2"] });
            expect(request).toHaveBeenCalledWith("/discount-groups?id=dsg_1,dsg_2");
        });

        it("does not add a trailing & after the last param", async () => {
            await groups.all({ per_page: 5, after: "dsg_9" });
            const url = request.mock.calls[0][0] as string;
            expect(url.endsWith("&")).toBe(false);
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: [{ id: "dsg_1" }] });
            await expect(groups.all()).resolves.toEqual({ data: [{ id: "dsg_1" }] });
        });
    });

    describe("create()", () => {
        it("sends POST /discount-groups with the payload", async () => {
            await groups.create({ name: "Black Friday" });
            expect(request).toHaveBeenCalledWith("/discount-groups", "POST", { name: "Black Friday" });
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsg_new", name: "Black Friday" } });
            await expect(groups.create({ name: "Black Friday" })).resolves.toEqual({
                data: { id: "dsg_new", name: "Black Friday" },
            });
        });
    });

    describe("findById()", () => {
        it("calls GET /discount-groups/:id with no extra arguments", async () => {
            await groups.findById("dsg_123");
            expect(request).toHaveBeenCalledWith("/discount-groups/dsg_123");
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsg_123" } });
            await expect(groups.findById("dsg_123")).resolves.toEqual({ data: { id: "dsg_123" } });
        });
    });

    describe("update()", () => {
        it("sends PATCH /discount-groups/:id with the name", async () => {
            await groups.update("dsg_123", { name: "Renamed" });
            expect(request).toHaveBeenCalledWith("/discount-groups/dsg_123", "PATCH", { name: "Renamed" });
        });

        it("can archive a group via status", async () => {
            await groups.update("dsg_123", { status: "archived" });
            expect(request).toHaveBeenCalledWith("/discount-groups/dsg_123", "PATCH", { status: "archived" });
        });

        it("passes name and status together", async () => {
            await groups.update("dsg_123", { name: "Renamed", status: "active" });
            expect(request).toHaveBeenCalledWith("/discount-groups/dsg_123", "PATCH", {
                name: "Renamed",
                status: "active",
            });
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsg_123", status: "archived" } });
            await expect(groups.update("dsg_123", { status: "archived" })).resolves.toEqual({
                data: { id: "dsg_123", status: "archived" },
            });
        });
    });

    describe("error handling", () => {
        it("propagates adapter errors from all()", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(groups.all()).rejects.toThrow("network down");
        });

        it("propagates adapter errors from create()", async () => {
            request.mockRejectedValue(new Error("name required"));
            await expect(groups.create({ name: "" })).rejects.toThrow("name required");
        });

        it("propagates adapter errors from findById()", async () => {
            request.mockRejectedValue(new Error("not found"));
            await expect(groups.findById("dsg_missing")).rejects.toThrow("not found");
        });

        it("propagates adapter errors from update()", async () => {
            request.mockRejectedValue(new Error("conflict"));
            await expect(groups.update("dsg_123", { name: "x" })).rejects.toThrow("conflict");
        });
    });
});