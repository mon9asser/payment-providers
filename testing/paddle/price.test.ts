import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddlePrice from "../../payment/providers/paddle/price";
import Adapter from "../../payment/helper/adapter";

describe("PaddlePrice", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let prices: PaddlePrice;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        prices = new PaddlePrice(adapter);
    });

    describe("all()", () => {
        it("calls GET /prices with no query string by default", async () => {
            await prices.all();
            expect(request).toHaveBeenCalledWith("/prices");
        });

        it("serializes a single option into the query string", async () => {
            await prices.all({ type: "standard" });
            expect(request).toHaveBeenCalledWith("/prices?type=standard");
        });

        it("serializes multiple options into the query string", async () => {
            await prices.all({
                product_id: ["pro_1", "pro_2"],
                status: ["active", "archived"],
                recurring: true,
                type: "standard",
            });
            expect(request).toHaveBeenCalledWith(
                "/prices?product_id=pro_1,pro_2&status=active,archived&recurring=true&type=standard"
            );
        });

        it("serializes recurring=false (does not drop falsy values)", async () => {
            await prices.all({ recurring: false });
            expect(request).toHaveBeenCalledWith("/prices?recurring=false");
        });

        it("serializes order_by", async () => {
            await prices.all({ order_by: ["id[ASC]", "status[DESC]"] });
            expect(request).toHaveBeenCalledWith("/prices?order_by=id[ASC],status[DESC]");
        });

        it("serializes dotted billing_cycle filters", async () => {
            await prices.all({
                "billing_cycle.interval": "month",
                "billing_cycle.frequency": 1,
            });
            expect(request).toHaveBeenCalledWith(
                "/prices?billing_cycle.interval=month&billing_cycle.frequency=1"
            );
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ id: "pri_1" }] };
            request.mockResolvedValue(response);
            await expect(prices.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(prices.all()).rejects.toThrow("network down");
        });
    });

    describe("findById()", () => {
        it("calls GET /prices/:id with no query string by default", async () => {
            await prices.findById("pri_123");
            expect(request).toHaveBeenCalledWith("/prices/pri_123");
        });

        it("adds include to the query string", async () => {
            await prices.findById("pri_123", { include: ["product"] });
            expect(request).toHaveBeenCalledWith("/prices/pri_123?include=product");
        });

        it("omits the query string when include is empty", async () => {
            await prices.findById("pri_123", { include: [] });
            expect(request).toHaveBeenCalledWith("/prices/pri_123");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "pri_123" } };
            request.mockResolvedValue(response);
            await expect(prices.findById("pri_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("not found"));
            await expect(prices.findById("pri_missing")).rejects.toThrow("not found");
        });
    });

    describe("create()", () => {
        it("calls POST /prices with the body", async () => {
            const body = {
                product_id: "pro_123",
                description: "Monthly",
                type: "standard" as const,
                name: "Pro Monthly",
                billing_cycle: { interval: "month" as const, frequency: 1 },
                trial_period: { interval: "day" as const, frequency: 14 },
                unit_price: { amount: "1000", currency_code: "USD" as const },
                unit_price_overrides: [
                    {
                        country_codes: ["SA", "AE"],
                        unit_price: { amount: "3500", currency_code: "USD" as const },
                    },
                ],
                tax_mode: "account_setting" as const,
                quantity: { minimum: 1, maximum: 10 },
                custom_data: { tier: "pro" },
            };
            await prices.create(body);
            expect(request).toHaveBeenCalledWith("/prices", "POST", body);
        });

        it("passes a minimal body through untouched", async () => {
            const body = { product_id: "pro_123", description: "One-time" };
            await prices.create(body);
            expect(request).toHaveBeenCalledWith("/prices", "POST", body);
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "pri_new" } };
            request.mockResolvedValue(response);
            await expect(
                prices.create({ product_id: "pro_123", description: "x" })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid"));
            await expect(
                prices.create({ product_id: "pro_123", description: "x" })
            ).rejects.toThrow("invalid");
        });
    });

    describe("update()", () => {
        it("calls PATCH /prices/:id with the body", async () => {
            const body = { description: "Renamed", status: "archived" as const };
            await prices.update("pri_123", body);
            expect(request).toHaveBeenCalledWith("/prices/pri_123", "PATCH", body);
        });

        it("allows nulling nullable fields", async () => {
            const body = {
                name: null,
                billing_cycle: null,
                trial_period: null,
                custom_data: null,
            };
            await prices.update("pri_123", body);
            expect(request).toHaveBeenCalledWith("/prices/pri_123", "PATCH", body);
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "pri_123", description: "Renamed" } };
            request.mockResolvedValue(response);
            await expect(prices.update("pri_123", { description: "Renamed" })).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("forbidden"));
            await expect(prices.update("pri_123", { status: "archived" })).rejects.toThrow("forbidden");
        });
    });
});