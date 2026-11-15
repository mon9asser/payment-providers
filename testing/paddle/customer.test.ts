import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleCustomer from "../../payment/providers/paddle/customer";
import Adapter from "../../payment/helper/adapter";

describe("PaddleCustomer", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let customers: PaddleCustomer;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        customers = new PaddleCustomer(adapter);
    });

    describe("all()", () => {
        it("calls GET /customers with no query string by default", async () => {
            await customers.all();
            expect(request).toHaveBeenCalledWith("/customers");
        });

        it("serializes options into the query string", async () => {
            await customers.all({ per_page: 10, status: ["active"], email: ["a@b.com", "c@d.com"] });
            expect(request).toHaveBeenCalledWith(
                "/customers?per_page=10&status=active&email=a@b.com,c@d.com"
            );
        });
    });

    describe("create()", () => {
        it("sends POST /customers with the payload", async () => {
            const payload = { email: "jane@example.com", name: "Jane", custom_data: { ref: "123" } };
            await customers.create(payload);
            expect(request).toHaveBeenCalledWith("/customers", "POST", payload);
        });
    });

    describe("findById()", () => {
        it("calls GET /customers/{id}", async () => {
            await customers.findById("ctm_123");
            expect(request).toHaveBeenCalledWith("/customers/ctm_123");
        });
    });

    describe("update()", () => {
        it("sends PATCH /customers/{id} with the payload", async () => {
            await customers.update("ctm_123", { status: "archived" });
            expect(request).toHaveBeenCalledWith("/customers/ctm_123", "PATCH", { status: "archived" });
        });
    });

    describe("creditBalance()", () => {
        it("omits the query string when no currencies are given", async () => {
            await customers.creditBalance("ctm_123");
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/credit-balances");
        });

        it("joins currency codes with commas", async () => {
            await customers.creditBalance("ctm_123", ["USD", "EUR"]);
            expect(request).toHaveBeenCalledWith(
                "/customers/ctm_123/credit-balances?currency_code=USD,EUR"
            );
        });
    });

    describe("generateAuthToken()", () => {
        it("sends POST /customers/{id}/auth-token", async () => {
            await customers.generateAuthToken("ctm_123");
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/auth-token", "POST");
        });
    });

    it("returns whatever the adapter returns", async () => {
        request.mockResolvedValue({ data: { id: "ctm_123" } });
        await expect(customers.findById("ctm_123")).resolves.toEqual({ data: { id: "ctm_123" } });
    });

        describe("addresses()", () => {
        it("calls GET /customers/{id}/addresses with no query string by default", async () => {
            await customers.addresses("ctm_123");
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/addresses");
        });

        it("serializes query params into the query string", async () => {
            await customers.addresses("ctm_123", {
                per_page: 5,
                status: ["active", "archived"],
                order_by: "id[DESC]",
            });
            expect(request).toHaveBeenCalledWith(
                "/customers/ctm_123/addresses?per_page=5&status=active,archived&order_by=id[DESC]"
            );
        });

        it("supports id, after and search params", async () => {
            await customers.addresses("ctm_123", {
                id: ["add_1", "add_2"],
                after: "add_2",
                search: "home",
            });
            expect(request).toHaveBeenCalledWith(
                "/customers/ctm_123/addresses?id=add_1,add_2&after=add_2&search=home"
            );
        });
    });

    describe("createAddress()", () => {
        it("sends POST /customers/{id}/addresses with the payload", async () => {
            const body = {
                country_code: "SA",
                city: "Jeddah",
                first_line: "King Road",
                postal_code: "21589",
                custom_data: { type: "billing" },
            };
            await customers.createAddress("ctm_123", body);
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/addresses", "POST", body);
        });

        it("accepts only the required country_code", async () => {
            await customers.createAddress("ctm_123", { country_code: "US" });
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/addresses", "POST", {
                country_code: "US",
            });
        });
    });

    describe("findAddressById()", () => {
        it("calls GET /customers/{id}/addresses/{address_id}", async () => {
            await customers.findAddressById("ctm_123", "add_456");
            expect(request).toHaveBeenCalledWith("/customers/ctm_123/addresses/add_456");
        });
    });

    describe("updateAddress()", () => {
        it("sends PATCH /customers/{id}/addresses/{address_id} with the payload", async () => {
            const body = { city: "Riyadh", status: "archived" as const };
            await customers.updateAddress("ctm_123", "add_456", body);
            expect(request).toHaveBeenCalledWith(
                "/customers/ctm_123/addresses/add_456",
                "PATCH",
                body
            );
        });

        it("allows nulling out optional fields", async () => {
            const body = { second_line: null, description: null };
            await customers.updateAddress("ctm_123", "add_456", body);
            expect(request).toHaveBeenCalledWith(
                "/customers/ctm_123/addresses/add_456",
                "PATCH",
                body
            );
        });
    });
});