import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleProduct from "../../payment/providers/paddle/product";
import Adapter from "../../payment/helper/adapter";

describe("PaddleProduct", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let products: PaddleProduct;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        products = new PaddleProduct(adapter);
    });

    describe("all()", () => {
        it("calls GET /products with no query string by default", async () => {
            await products.all();
            expect(request).toHaveBeenCalledWith("/products");
        });

        it("serializes a single option into the query string", async () => {
            await products.all({ per_page: 10 });
            expect(request).toHaveBeenCalledWith("/products?per_page=10");
        });

        it("serializes multiple options into the query string", async () => {
            await products.all({
                per_page: 10,
                status: ["active"],
                tax_category: ["saas", "ebooks"],
                type: "standard",
            });
            expect(request).toHaveBeenCalledWith(
                "/products?per_page=10&status=active&tax_category=saas,ebooks&type=standard"
            );
        });

        it("serializes id, include and order_by", async () => {
            await products.all({
                id: ["pro_1", "pro_2"],
                include: ["prices"],
                order_by: "created_at[DESC]",
            });
            expect(request).toHaveBeenCalledWith(
                "/products?id=pro_1,pro_2&include=prices&order_by=created_at[DESC]"
            );
        });

        it("serializes the pagination cursor", async () => {
            await products.all({ after: "pro_123" });
            expect(request).toHaveBeenCalledWith("/products?after=pro_123");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ id: "pro_1" }] };
            request.mockResolvedValue(response);
            await expect(products.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(products.all()).rejects.toThrow("network down");
        });
    });

    describe("findById()", () => {
        it("calls GET /products/:id with no query string by default", async () => {
            await products.findById("pro_123");
            expect(request).toHaveBeenCalledWith("/products/pro_123");
        });

        it("adds include to the query string", async () => {
            await products.findById("pro_123", { include: ["prices"] });
            expect(request).toHaveBeenCalledWith("/products/pro_123?include=prices");
        });

        it("omits the query string when include is empty", async () => {
            await products.findById("pro_123", { include: [] });
            expect(request).toHaveBeenCalledWith("/products/pro_123");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "pro_123" } };
            request.mockResolvedValue(response);
            await expect(products.findById("pro_123")).resolves.toBe(response);
        });
    });

    describe("create()", () => {
        it("calls POST /products with the body", async () => {
            const body = {
                name: "Pro Plan",
                tax_category: "saas" as const,
                description: "Everything included",
                custom_data: { tier: "pro" },
            };
            await products.create(body);
            expect(request).toHaveBeenCalledWith("/products", "POST", body);
        });

        it("passes a minimal body through untouched", async () => {
            const body = { name: "Basic", tax_category: "standard" as const };
            await products.create(body);
            expect(request).toHaveBeenCalledWith("/products", "POST", body);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("invalid"));
            await expect(
                products.create({ name: "x", tax_category: "saas" })
            ).rejects.toThrow("invalid");
        });
    });

    describe("update()", () => {
        it("calls PATCH /products/:id with the body", async () => {
            const body = { name: "Renamed", status: "archived" as const };
            await products.update("pro_123", body);
            expect(request).toHaveBeenCalledWith("/products/pro_123", "PATCH", body);
        });

        it("allows nulling nullable fields", async () => {
            const body = { description: null, image_url: null, custom_data: null };
            await products.update("pro_123", body);
            expect(request).toHaveBeenCalledWith("/products/pro_123", "PATCH", body);
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "pro_123", name: "Renamed" } };
            request.mockResolvedValue(response);
            await expect(products.update("pro_123", { name: "Renamed" })).resolves.toBe(response);
        });
    });
});