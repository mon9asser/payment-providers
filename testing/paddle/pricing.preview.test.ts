import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddlePreviewPricing from "../../payment/providers/paddle/pricing.preview";
import Adapter from "../../payment/helper/adapter";

describe("PaddlePreviewPricing", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let pricing: PaddlePreviewPricing;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        pricing = new PaddlePreviewPricing(adapter);
    });

    describe("create()", () => {
        it("calls POST /pricing-preview with a minimal body", async () => {
            const body = { items: [{ price_id: "pri_123", quantity: 1 }] };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("calls the adapter exactly once", async () => {
            await pricing.create({ items: [{ price_id: "pri_123", quantity: 1 }] });
            expect(request).toHaveBeenCalledTimes(1);
        });

        it("passes multiple items through untouched", async () => {
            const body = {
                items: [
                    { price_id: "pri_1", quantity: 1 },
                    { price_id: "pri_2", quantity: 5 },
                    { price_id: "pri_3", quantity: 10 },
                ],
            };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("passes a full body through untouched", async () => {
            const body = {
                customer_id: "ctm_123",
                address_id: "add_123",
                business_id: "biz_123",
                currency_code: "USD" as const,
                discount_id: "dsc_123",
                address: { country_code: "SA", postal_code: "21442" },
                customer_ip_address: "203.0.113.1",
                items: [
                    { price_id: "pri_1", quantity: 1 },
                    { price_id: "pri_2", quantity: 3 },
                ],
            };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("allows nulling nullable fields", async () => {
            const body = {
                customer_id: null,
                address_id: null,
                business_id: null,
                currency_code: null,
                discount_id: null,
                address: null,
                customer_ip_address: null,
                items: [{ price_id: "pri_123", quantity: 1 }],
            };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("allows an address with a null postal code", async () => {
            const body = {
                address: { country_code: "SA", postal_code: null },
                items: [{ price_id: "pri_123", quantity: 1 }],
            };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("allows an address without a postal code", async () => {
            const body = {
                address: { country_code: "US" },
                items: [{ price_id: "pri_123", quantity: 1 }],
            };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("passes an empty items array through without validation", async () => {
            const body = { items: [] };
            await pricing.create(body);
            expect(request).toHaveBeenCalledWith("/pricing-preview", "POST", body);
        });

        it("sends the exact same body object (no copy or mutation)", async () => {
            const body = { items: [{ price_id: "pri_123", quantity: 2 }] };
            const snapshot = JSON.parse(JSON.stringify(body));
            await pricing.create(body);
            expect(request.mock.calls[0][2]).toBe(body);
            expect(body).toEqual(snapshot);
        });

        it("does not add a query string", async () => {
            await pricing.create({ items: [{ price_id: "pri_123", quantity: 1 }] });
            const [url] = request.mock.calls[0];
            expect(url).toBe("/pricing-preview");
            expect(url).not.toContain("?");
        });

        it("returns whatever the adapter returns", async () => {
            const response = {
                data: { details: { line_items: [{ price: { id: "pri_123" } }] } },
            };
            request.mockResolvedValue(response);
            await expect(
                pricing.create({ items: [{ price_id: "pri_123", quantity: 1 }] })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid price"));
            await expect(
                pricing.create({ items: [{ price_id: "pri_missing", quantity: 1 }] })
            ).rejects.toThrow("invalid price");
        });
    });
});