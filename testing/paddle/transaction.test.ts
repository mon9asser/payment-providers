import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleTransaction from "../../payment/providers/paddle/transaction";
import Adapter from "../../payment/helper/adapter";

describe("PaddleTransaction", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let transactions: PaddleTransaction;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        transactions = new PaddleTransaction(adapter);
    });

    describe("all()", () => {
        it("calls GET /transactions with no query string by default", async () => {
            await transactions.all();
            expect(request).toHaveBeenCalledWith("/transactions");
        });

        it("serializes a single option into the query string", async () => {
            await transactions.all({ collection_mode: "manual" });
            expect(request).toHaveBeenCalledWith("/transactions?collection_mode=manual");
        });

        it("serializes array options as comma-separated values", async () => {
            await transactions.all({
                id: ["txn_1", "txn_2"],
                status: ["paid", "completed"],
                origin: ["api", "web"],
            });
            expect(request).toHaveBeenCalledWith(
                "/transactions?id=txn_1,txn_2&status=paid,completed&origin=api,web"
            );
        });

        it("serializes include", async () => {
            await transactions.all({ include: ["customer", "address"] });
            expect(request).toHaveBeenCalledWith("/transactions?include=customer,address");
        });

        it("serializes multiple options in insertion order", async () => {
            await transactions.all({
                customer_id: ["ctm_1"],
                invoice_number: ["INV-1", "INV-2"],
                subscription_id: ["sub_1"],
                order_by: "created_at[DESC]",
                per_page: 50,
                after: "txn_9",
            });
            expect(request).toHaveBeenCalledWith(
                "/transactions?customer_id=ctm_1&invoice_number=INV-1,INV-2&subscription_id=sub_1&order_by=created_at[DESC]&per_page=50&after=txn_9"
            );
        });

        it("serializes date filters", async () => {
            await transactions.all({
                billed_at: "2024-01-01T00:00:00Z",
                created_at: "2024-02-01T00:00:00Z",
                updated_at: "2024-03-01T00:00:00Z",
            });
            expect(request).toHaveBeenCalledWith(
                "/transactions?billed_at=2024-01-01T00:00:00Z&created_at=2024-02-01T00:00:00Z&updated_at=2024-03-01T00:00:00Z"
            );
        });

        it("serializes per_page=0 (does not drop falsy values)", async () => {
            await transactions.all({ per_page: 0 });
            expect(request).toHaveBeenCalledWith("/transactions?per_page=0");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ id: "txn_1" }] };
            request.mockResolvedValue(response);
            await expect(transactions.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(transactions.all()).rejects.toThrow("network down");
        });
    });

    describe("create()", () => {
        it("calls POST /transactions with the body and no query string by default", async () => {
            const body = { items: [{ quantity: 1, price_id: "pri_123" }] };
            await transactions.create(body);
            expect(request).toHaveBeenCalledWith("/transactions", "POST", body);
        });

        it("passes a full body through untouched", async () => {
            const body = {
                status: "draft" as const,
                customer_id: "ctm_123",
                address_id: "add_123",
                business_id: "biz_123",
                currency_code: "USD" as const,
                collection_mode: "manual" as const,
                discount_id: null,
                billing_details: { enable_checkout: true },
                enable_checkout: true,
                purchase_order_number: "PO-1",
                additional_information: "Thanks!",
                payment_terms: { interval: "day" as const, frequency: 30 },
                billing_period: {
                    starts_at: "2024-01-01T00:00:00Z",
                    ends_at: "2024-02-01T00:00:00Z",
                },
                custom_data: { source: "test" },
                checkout: { url: "https://example.com/pay" },
                items: [
                    { quantity: 2, price_id: "pri_123" },
                    {
                        quantity: 1,
                        price: {
                            description: "Existing product",
                            product_id: "pro_123",
                            unit_price: { amount: "1000", currency_code: "USD" as const },
                        },
                    },
                    {
                        quantity: 1,
                        price: {
                            description: "New product",
                            unit_price: { amount: "500", currency_code: "USD" as const },
                            product: {
                                name: "One-off",
                                tax_category: "saas" as const,
                            },
                        },
                    },
                ],
            };
            await transactions.create(body);
            expect(request).toHaveBeenCalledWith("/transactions", "POST", body);
        });

        it("adds include to the query string", async () => {
            const body = { items: [{ quantity: 1, price_id: "pri_123" }] };
            await transactions.create(body, { include: ["customer"] });
            expect(request).toHaveBeenCalledWith("/transactions?include=customer", "POST", body);
        });

        it("serializes multiple includes as comma-separated values", async () => {
            const body = { items: [{ quantity: 1, price_id: "pri_123" }] };
            await transactions.create(body, { include: ["customer", "address", "discount"] });
            expect(request).toHaveBeenCalledWith(
                "/transactions?include=customer,address,discount",
                "POST",
                body
            );
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "txn_new" } };
            request.mockResolvedValue(response);
            await expect(
                transactions.create({ items: [{ quantity: 1, price_id: "pri_123" }] })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid"));
            await expect(
                transactions.create({ items: [{ quantity: 1, price_id: "pri_123" }] })
            ).rejects.toThrow("invalid");
        });
    });

    describe("findById()", () => {
        it("calls GET /transactions/:id with no query string by default", async () => {
            await transactions.findById("txn_123");
            expect(request).toHaveBeenCalledWith("/transactions/txn_123");
        });

        it("adds a single include to the query string", async () => {
            await transactions.findById("txn_123", { include: ["customer"] });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123?include=customer");
        });

        it("URL-encodes the comma when joining multiple includes", async () => {
            // findById uses URLSearchParams, which encodes "," as %2C.
            await transactions.findById("txn_123", { include: ["customer", "address"] });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123?include=customer%2Caddress");
        });

        it("omits the query string when include is empty", async () => {
            await transactions.findById("txn_123", { include: [] });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "txn_123" } };
            request.mockResolvedValue(response);
            await expect(transactions.findById("txn_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("not found"));
            await expect(transactions.findById("txn_missing")).rejects.toThrow("not found");
        });
    });

    describe("update()", () => {
        it("calls PATCH /transactions/:id with the body", async () => {
            const body = { status: "billed" as const, purchase_order_number: "PO-2" };
            await transactions.update("txn_123", body);
            expect(request).toHaveBeenCalledWith("/transactions/txn_123", "PATCH", body);
        });

        it("defaults to an empty body", async () => {
            await transactions.update("txn_123");
            expect(request).toHaveBeenCalledWith("/transactions/txn_123", "PATCH", {});
        });

        it("allows nulling nullable fields", async () => {
            const body = {
                customer_id: null,
                address_id: null,
                business_id: null,
                custom_data: null,
                currency_code: null,
                discount_id: null,
                discount: null,
                billing_details: null,
                additional_information: null,
                billing_period: null,
                checkout: null,
            };
            await transactions.update("txn_123", body);
            expect(request).toHaveBeenCalledWith("/transactions/txn_123", "PATCH", body);
        });

        it("passes items through untouched", async () => {
            const body = { items: [{ quantity: 3, price_id: "pri_123" }] };
            await transactions.update("txn_123", body);
            expect(request).toHaveBeenCalledWith("/transactions/txn_123", "PATCH", body);
        });

        it("adds include to the query string", async () => {
            const body = { status: "canceled" as const };
            await transactions.update("txn_123", body, { include: ["customer"] });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123?include=customer", "PATCH", body);
        });

        it("URL-encodes the comma when joining multiple includes", async () => {
            const body = { status: "canceled" as const };
            await transactions.update("txn_123", body, { include: ["customer", "business"] });
            expect(request).toHaveBeenCalledWith(
                "/transactions/txn_123?include=customer%2Cbusiness",
                "PATCH",
                body
            );
        });

        it("omits the query string when include is empty", async () => {
            const body = { status: "billed" as const };
            await transactions.update("txn_123", body, { include: [] });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123", "PATCH", body);
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "txn_123", status: "billed" } };
            request.mockResolvedValue(response);
            await expect(transactions.update("txn_123", { status: "billed" })).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("forbidden"));
            await expect(transactions.update("txn_123", { status: "canceled" })).rejects.toThrow("forbidden");
        });
    });

    describe("preview()", () => {
        it("calls POST /transactions/preview with the body", async () => {
            const body = { items: [{ quantity: 1, price_id: "pri_123" }] };
            await transactions.preview(body);
            expect(request).toHaveBeenCalledWith("/transactions/preview", "POST", body);
        });

        it("passes a full body through untouched", async () => {
            const body = {
                customer_id: "ctm_123",
                currency_code: "USD" as const,
                customer_ip_address: "203.0.113.1",
                address: { country_code: "SA", postal_code: "21442" },
                address_id: null,
                business_id: null,
                discount_id: "dsc_123",
                ignore_trials: true,
                items: [
                    { quantity: 1, price_id: "pri_123", include_in_totals: false },
                    {
                        quantity: 2,
                        price: {
                            description: "Existing product",
                            product_id: "pro_123",
                        },
                        include_in_totals: true,
                    },
                    {
                        quantity: 1,
                        price: {
                            description: "New product",
                            product: { name: "Preview", tax_category: "standard" as const },
                        },
                    },
                ],
            };
            await transactions.preview(body);
            expect(request).toHaveBeenCalledWith("/transactions/preview", "POST", body);
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { details: { totals: { total: "1000" } } } };
            request.mockResolvedValue(response);
            await expect(
                transactions.preview({ items: [{ quantity: 1, price_id: "pri_123" }] })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid"));
            await expect(
                transactions.preview({ items: [{ quantity: 1, price_id: "pri_123" }] })
            ).rejects.toThrow("invalid");
        });
    });

    describe("invoice()", () => {
        it("calls GET /transactions/:id/invoice with no query string by default", async () => {
            await transactions.invoice("txn_123");
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/invoice");
        });

        it("serializes disposition=attachment", async () => {
            await transactions.invoice("txn_123", { disposition: "attachment" });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/invoice?disposition=attachment");
        });

        it("serializes disposition=inline", async () => {
            await transactions.invoice("txn_123", { disposition: "inline" });
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/invoice?disposition=inline");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { url: "https://example.com/invoice.pdf" } };
            request.mockResolvedValue(response);
            await expect(transactions.invoice("txn_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("not billed"));
            await expect(transactions.invoice("txn_123")).rejects.toThrow("not billed");
        });
    });

    describe("revise()", () => {
        it("calls POST /transactions/:id/revise with the body", async () => {
            const body = {
                customer: { name: "New Name" },
                business: { name: "Acme Inc", tax_identifier: "123456789" },
                address: {
                    first_line: "1 Main St",
                    second_line: null,
                    city: "Jeddah",
                    region: "Makkah",
                },
            };
            await transactions.revise("txn_123", body);
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/revise", "POST", body);
        });

        it("passes a partial body through untouched", async () => {
            const body = { customer: { name: "Only Name" } };
            await transactions.revise("txn_123", body);
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/revise", "POST", body);
        });

        it("defaults to an empty body", async () => {
            await transactions.revise("txn_123");
            expect(request).toHaveBeenCalledWith("/transactions/txn_123/revise", "POST", {});
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "txn_123" } };
            request.mockResolvedValue(response);
            await expect(
                transactions.revise("txn_123", { customer: { name: "X" } })
            ).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("cannot revise"));
            await expect(
                transactions.revise("txn_123", { customer: { name: "X" } })
            ).rejects.toThrow("cannot revise");
        });
    });
});