import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleAdjustment from "../../payment/providers/paddle/adjustment";
import Adapter from "../../payment/helper/adapter";

describe("PaddleAdjustment", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let adjustments: PaddleAdjustment;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        adjustments = new PaddleAdjustment(adapter);
    });

    describe("all()", () => {
        it("calls GET /adjustments with no query string by default", async () => {
            await adjustments.all();
            expect(request).toHaveBeenCalledWith("/adjustments");
        });

        it("omits the query string when given an empty object", async () => {
            await adjustments.all({});
            expect(request).toHaveBeenCalledWith("/adjustments");
        });

        it("serializes a single option into the query string", async () => {
            await adjustments.all({ order_by: "id[DESC]" });
            expect(request).toHaveBeenCalledWith("/adjustments?order_by=id[DESC]");
        });

        it("serializes array options as comma-separated values", async () => {
            await adjustments.all({
                id: ["adj_1", "adj_2"],
                action: ["credit", "refund"],
                status: ["approved", "pending_approval"],
            });
            expect(request).toHaveBeenCalledWith(
                "/adjustments?id=adj_1,adj_2&action=credit,refund&status=approved,pending_approval"
            );
        });

        it("serializes a single-item array without a trailing comma", async () => {
            await adjustments.all({ customer_id: ["ctm_1"] });
            expect(request).toHaveBeenCalledWith("/adjustments?customer_id=ctm_1");
        });

        it("serializes every adjustment action", async () => {
            await adjustments.all({
                action: [
                    "credit",
                    "refund",
                    "chargeback",
                    "chargeback_reverse",
                    "chargeback_warning",
                    "chargeback_warning_reverse",
                    "credit_reverse",
                ],
            });
            expect(request).toHaveBeenCalledWith(
                "/adjustments?action=credit,refund,chargeback,chargeback_reverse,chargeback_warning,chargeback_warning_reverse,credit_reverse"
            );
        });

        it("serializes every adjustment status", async () => {
            await adjustments.all({
                status: ["pending_approval", "approved", "rejected", "reversed"],
            });
            expect(request).toHaveBeenCalledWith(
                "/adjustments?status=pending_approval,approved,rejected,reversed"
            );
        });

        it("serializes relation filters", async () => {
            await adjustments.all({
                customer_id: ["ctm_1", "ctm_2"],
                subscription_id: ["sub_1"],
                transaction_id: ["txn_1", "txn_2"],
            });
            expect(request).toHaveBeenCalledWith(
                "/adjustments?customer_id=ctm_1,ctm_2&subscription_id=sub_1&transaction_id=txn_1,txn_2"
            );
        });

        it("serializes order_by ascending", async () => {
            await adjustments.all({ order_by: "id[ASC]" });
            expect(request).toHaveBeenCalledWith("/adjustments?order_by=id[ASC]");
        });

        it("serializes multiple options in insertion order", async () => {
            await adjustments.all({
                transaction_id: ["txn_1"],
                action: ["refund"],
                status: ["approved"],
                order_by: "id[DESC]",
                per_page: 50,
                after: "adj_9",
            });
            expect(request).toHaveBeenCalledWith(
                "/adjustments?transaction_id=txn_1&action=refund&status=approved&order_by=id[DESC]&per_page=50&after=adj_9"
            );
        });

        it("keeps insertion order regardless of key order", async () => {
            await adjustments.all({ per_page: 5, after: "adj_1" });
            expect(request).toHaveBeenLastCalledWith("/adjustments?per_page=5&after=adj_1");

            await adjustments.all({ after: "adj_1", per_page: 5 });
            expect(request).toHaveBeenLastCalledWith("/adjustments?after=adj_1&per_page=5");
        });

        it("serializes per_page=0 (does not drop falsy values)", async () => {
            await adjustments.all({ per_page: 0 });
            expect(request).toHaveBeenCalledWith("/adjustments?per_page=0");
        });

        it("serializes empty arrays as an empty value", async () => {
            await adjustments.all({ id: [] });
            expect(request).toHaveBeenCalledWith("/adjustments?id=");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ id: "adj_1" }] };
            request.mockResolvedValue(response);
            await expect(adjustments.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(adjustments.all()).rejects.toThrow("network down");
        });
    });

    describe("create()", () => {
        it("calls POST /adjustments with a minimal body", async () => {
            const body = {
                action: "refund" as const,
                transaction_id: "txn_123",
                reason: "Customer requested refund",
            };
            await adjustments.create(body);
            expect(request).toHaveBeenCalledWith("/adjustments", "POST", body);
        });

        it("passes a full body through untouched", async () => {
            const body = {
                action: "credit" as const,
                type: "partial" as const,
                tax_mode: "external" as const,
                transaction_id: "txn_123",
                reason: "Goodwill credit",
                items: [
                    { item_id: "txnitm_1", type: "full" as const },
                    { item_id: "txnitm_2", type: "partial" as const, amount: "500" },
                    { item_id: "txnitm_3", type: "tax" as const, amount: null },
                    { item_id: "txnitm_4", type: "proration" as const, amount: "100" },
                ],
            };
            await adjustments.create(body);
            expect(request).toHaveBeenCalledWith("/adjustments", "POST", body);
        });

        it("allows null items", async () => {
            const body = {
                action: "refund" as const,
                type: "full" as const,
                transaction_id: "txn_123",
                reason: "Full refund",
                items: null,
            };
            await adjustments.create(body);
            expect(request).toHaveBeenCalledWith("/adjustments", "POST", body);
        });

        it.each([
            "credit",
            "refund",
            "chargeback",
            "chargeback_reverse",
            "chargeback_warning",
            "chargeback_warning_reverse",
            "credit_reverse",
        ] as const)("accepts action=%s", async (action) => {
            const body = { action, transaction_id: "txn_123", reason: "test" };
            await adjustments.create(body);
            expect(request).toHaveBeenCalledWith("/adjustments", "POST", body);
        });

        it("does not add a query string", async () => {
            await adjustments.create({
                action: "refund",
                transaction_id: "txn_123",
                reason: "test",
            });
            const [url] = request.mock.calls[0];
            expect(url).toBe("/adjustments");
            expect(url).not.toContain("?");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "adj_new" } };
            request.mockResolvedValue(response);
            await expect(
                adjustments.create({
                    action: "refund",
                    transaction_id: "txn_123",
                    reason: "test",
                })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid"));
            await expect(
                adjustments.create({
                    action: "refund",
                    transaction_id: "txn_123",
                    reason: "test",
                })
            ).rejects.toThrow("invalid");
        });
    });

    describe("creditNote()", () => {
        it("calls GET /adjustments/:id/credit-note with no query string by default", async () => {
            await adjustments.creditNote("adj_123");
            expect(request).toHaveBeenCalledWith("/adjustments/adj_123/credit-note");
        });

        it("omits the query string when given an empty object", async () => {
            await adjustments.creditNote("adj_123", {});
            expect(request).toHaveBeenCalledWith("/adjustments/adj_123/credit-note");
        });

        it("serializes disposition=attachment", async () => {
            await adjustments.creditNote("adj_123", { disposition: "attachment" });
            expect(request).toHaveBeenCalledWith(
                "/adjustments/adj_123/credit-note?disposition=attachment"
            );
        });

        it("serializes disposition=inline", async () => {
            await adjustments.creditNote("adj_123", { disposition: "inline" });
            expect(request).toHaveBeenCalledWith(
                "/adjustments/adj_123/credit-note?disposition=inline"
            );
        });

        it("puts the adjustment id in the path", async () => {
            await adjustments.creditNote("adj_other");
            expect(request).toHaveBeenCalledWith("/adjustments/adj_other/credit-note");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { url: "https://example.com/credit-note.pdf" } };
            request.mockResolvedValue(response);
            await expect(adjustments.creditNote("adj_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("not approved"));
            await expect(adjustments.creditNote("adj_123")).rejects.toThrow("not approved");
        });
    });
});