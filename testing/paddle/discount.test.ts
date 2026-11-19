import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleDiscount from "../../payment/providers/paddle/discount";
import Adapter from "../../payment/helper/adapter";

describe("PaddleDiscount", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let discount: PaddleDiscount;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        discount = new PaddleDiscount(adapter);
    });

    describe("all()", () => {
        it("calls GET /discounts with no query string when no params are given", async () => {
            await discount.all();
            expect(request).toHaveBeenCalledWith("/discounts");
        });

        it("calls GET /discounts with no query string for an empty object", async () => {
            await discount.all({});
            expect(request).toHaveBeenCalledWith("/discounts");
        });

        it("builds a query string for a single scalar param", async () => {
            await discount.all({ per_page: 10 });
            expect(request).toHaveBeenCalledWith("/discounts?per_page=10");
        });

        it("joins multiple params with &", async () => {
            await discount.all({ per_page: 25, after: "dsc_123", mode: "custom" });
            expect(request).toHaveBeenCalledWith("/discounts?per_page=25&after=dsc_123&mode=custom");
        });

        it("serialises array params as comma-separated values", async () => {
            await discount.all({ id: ["dsc_1", "dsc_2"], status: ["active", "archived"] });
            expect(request).toHaveBeenCalledWith("/discounts?id=dsc_1,dsc_2&status=active,archived");
        });

        it("supports include and order_by", async () => {
            await discount.all({ include: ["discount_group"], order_by: "created_at[DESC]" });
            expect(request).toHaveBeenCalledWith("/discounts?include=discount_group&order_by=created_at[DESC]");
        });

        it("supports code and discount_group_id filters", async () => {
            await discount.all({ code: ["SAVE10"], discount_group_id: ["dsg_1", "dsg_2"] });
            expect(request).toHaveBeenCalledWith("/discounts?code=SAVE10&discount_group_id=dsg_1,dsg_2");
        });

        it("does not add a trailing & after the last param", async () => {
            await discount.all({ per_page: 5, after: "dsc_9" });
            const url = request.mock.calls[0][0] as string;
            expect(url.endsWith("&")).toBe(false);
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: [{ id: "dsc_1" }] });
            await expect(discount.all()).resolves.toEqual({ data: [{ id: "dsc_1" }] });
        });
    });

    describe("create()", () => {
        it("sends POST /discounts with the payload", async () => {
            const payload = {
                description: "Black Friday",
                type: "percentage" as const,
                amount: "10",
            };
            await discount.create(payload);
            expect(request).toHaveBeenCalledWith("/discounts", "POST", payload);
        });

        it("passes optional fields through untouched", async () => {
            const payload = {
                description: "Flat off",
                enabled_for_checkout: true,
                code: "FLAT5",
                type: "flat" as const,
                mode: "standard" as const,
                amount: "500",
                currency_code: "USD" as any,
                recur: true,
                maximum_recurring_intervals: 3,
                usage_limit: 100,
                restrict_to: ["pro_1", "pri_2"],
                expires_at: "2026-12-31T23:59:59Z",
                custom_data: { campaign: "bf" },
                discount_group_id: "dsg_1",
            };
            await discount.create(payload);
            expect(request).toHaveBeenCalledWith("/discounts", "POST", payload);
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsc_new" } });
            await expect(
                discount.create({ description: "x", type: "flat", amount: "100" })
            ).resolves.toEqual({ data: { id: "dsc_new" } });
        });
    });

    describe("findById()", () => {
        it("calls GET /discounts/:id with no query string by default", async () => {
            await discount.findById("dsc_123");
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123");
        });

        it("adds no query string when include is empty", async () => {
            await discount.findById("dsc_123", { include: [] });
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123");
        });

        it("adds include=discount_group when requested", async () => {
            await discount.findById("dsc_123", { include: ["discount_group"] });
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123?include=discount_group");
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsc_123" } });
            await expect(discount.findById("dsc_123")).resolves.toEqual({ data: { id: "dsc_123" } });
        });
    });

    describe("update()", () => {
        it("sends PATCH /discounts/:id with the payload", async () => {
            await discount.update("dsc_123", { description: "Updated" });
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123", "PATCH", { description: "Updated" });
        });

        it("can archive a discount via status", async () => {
            await discount.update("dsc_123", { status: "archived" });
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123", "PATCH", { status: "archived" });
        });

        it("passes null values through so fields can be cleared", async () => {
            const payload = { code: null, usage_limit: null, expires_at: null };
            await discount.update("dsc_123", payload);
            expect(request).toHaveBeenCalledWith("/discounts/dsc_123", "PATCH", payload);
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "dsc_123", status: "archived" } });
            await expect(discount.update("dsc_123", { status: "archived" })).resolves.toEqual({
                data: { id: "dsc_123", status: "archived" },
            });
        });
    });

    describe("error handling", () => {
        it("propagates adapter errors from all()", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(discount.all()).rejects.toThrow("network down");
        });

        it("propagates adapter errors from create()", async () => {
            request.mockRejectedValue(new Error("invalid amount"));
            await expect(
                discount.create({ description: "x", type: "flat", amount: "bad" })
            ).rejects.toThrow("invalid amount");
        });

        it("propagates adapter errors from findById()", async () => {
            request.mockRejectedValue(new Error("not found"));
            await expect(discount.findById("dsc_missing")).rejects.toThrow("not found");
        });

        it("propagates adapter errors from update()", async () => {
            request.mockRejectedValue(new Error("conflict"));
            await expect(discount.update("dsc_123", { status: "active" })).rejects.toThrow("conflict");
        });
    });
});