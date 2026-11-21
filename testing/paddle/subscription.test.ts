
import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleSubscription from "../../payment/providers/paddle/subscription";
import Adapter from "../../payment/helper/adapter";

describe("PaddleSubscription", () => {
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let subscriptions: PaddleSubscription;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        subscriptions = new PaddleSubscription(adapter);
    });

    describe("all()", () => {
        it("calls GET /subscriptions with no query string by default", async () => {
            await subscriptions.all();
            expect(request).toHaveBeenCalledWith("/subscriptions");
        });

        it("serializes options into the query string", async () => {
            await subscriptions.all({
                per_page: 10,
                status: ["active", "trialing"],
                customer_id: ["ctm_123", "ctm_456"],
            });

            expect(request).toHaveBeenCalledWith(
                "/subscriptions?per_page=10&status=active,trialing&customer_id=ctm_123,ctm_456"
            );
        });
    });

    describe("findById()", () => {
        it("calls GET /subscriptions/{id}", async () => {
            await subscriptions.findById("sub_123");
            expect(request).toHaveBeenCalledWith("/subscriptions/sub_123");
        });

        it("serializes include parameters", async () => {
            await subscriptions.findById("sub_123", {
                include: ["next_transaction", "recurring_transaction_details"],
            });

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123?include=next_transaction,recurring_transaction_details"
            );
        });
    });

    describe("update()", () => {
        it("sends PATCH /subscriptions/{id} with the payload", async () => {
            const body = {
                collection_mode: "automatic" as const,
                next_billed_at: "2026-12-01T00:00:00Z",
            };

            await subscriptions.update("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123",
                "PATCH",
                body
            );
        });
    });

    describe("updatePaymentMethodTransaction()", () => {
        it("sends GET /subscriptions/{id}/update-payment-method-transaction", async () => {
            await subscriptions.updatePaymentMethodTransaction("sub_123");

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/update-payment-method-transaction"
            );
        });
    });

    describe("activateSubscription()", () => {
        it("sends POST /subscriptions/{id}/activate", async () => {
            await subscriptions.activateSubscription("sub_123");

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/activate",
                "POST"
            );
        });
    });

    describe("cancelSubscription()", () => {
        it("sends POST /subscriptions/{id}/cancel with the payload", async () => {
            const body = {
                effective_from: "next_billing_period" as const,
            };

            await subscriptions.cancelSubscription("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/cancel",
                "POST",
                body
            );
        });

        it("sends an empty body by default", async () => {
            await subscriptions.cancelSubscription("sub_123");

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/cancel",
                "POST",
                {}
            );
        });
    });

    describe("createOneTimeCharge()", () => {
        it("sends POST /subscriptions/{id}/charge with the payload", async () => {
            const body = {
                effective_from: "immediately" as const,
                items: [
                    {
                        quantity: 2,
                        price_id: "pri_123",
                    },
                ],
                on_payment_failure: "prevent_change" as const,
            };

            await subscriptions.createOneTimeCharge("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/charge",
                "POST",
                body
            );
        });
    });

    describe("pauseSubscription()", () => {
        it("sends POST /subscriptions/{id}/pause with the payload", async () => {
            const body = {
                effective_from: "next_billing_period" as const,
                resume_at: "2027-01-01T00:00:00Z",
                on_resume: "start_new_billing_period" as const,
            };

            await subscriptions.pauseSubscription("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/pause",
                "POST",
                body
            );
        });
    });

    describe("resumeSubscription()", () => {
        it("sends POST /subscriptions/{id}/resume with the payload", async () => {
            const body = {
                effective_from: "2027-01-01T00:00:00Z",
                on_resume: "continue_existing_billing_period" as const,
            };

            await subscriptions.resumeSubscription("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/resume",
                "POST",
                body
            );
        });
    });

    describe("previewUpdate()", () => {
        it("sends PATCH /subscriptions/{id}/preview with the payload", async () => {
            const body = {
                items: [
                    {
                        price_id: "pri_123",
                        quantity: 3,
                    },
                ],
                proration_billing_mode: "prorated_immediately" as const,
            };

            await subscriptions.previewUpdate("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/preview",
                "PATCH",
                body
            );
        });
    });

    describe("previewOneTimeCharge()", () => {
        it("sends POST /subscriptions/{id}/charge/preview with the payload", async () => {
            const body = {
                effective_from: "immediately" as const,
                items: [
                    {
                        quantity: 2,
                        price_id: "pri_123",
                    },
                ],
                on_payment_failure: "prevent_change" as const,
            };

            await subscriptions.previewOneTimeCharge("sub_123", body);

            expect(request).toHaveBeenCalledWith(
                "/subscriptions/sub_123/charge/preview",
                "POST",
                body
            );
        });
    });

    describe("response handling", () => {
        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({
                data: { id: "sub_123", status: "active" },
            });

            await expect(
                subscriptions.findById("sub_123")
            ).resolves.toEqual({
                data: { id: "sub_123", status: "active" },
            });
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("boom"));

            await expect(
                subscriptions.findById("sub_123")
            ).rejects.toThrow("boom");

            await expect(
                subscriptions.update("sub_123", {})
            ).rejects.toThrow("boom");

            await expect(
                subscriptions.createOneTimeCharge("sub_123", {
                    effective_from: "immediately",
                    items: [{ quantity: 1, price_id: "pri_123" }],
                })
            ).rejects.toThrow("boom");
        });
    });
});
