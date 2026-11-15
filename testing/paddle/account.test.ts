import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleAccount from "../../payment/providers/paddle/account";
import Adapter from "../../payment/helper/adapter";

describe("PaddleAccount", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let account: PaddleAccount;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        account = new PaddleAccount(adapter);
    });

    describe("list()", () => {
        it("calls GET /account with no extra arguments", async () => {
            await account.list();
            expect(request).toHaveBeenCalledWith("/account");
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { id: "acc_123" } });
            await expect(account.list()).resolves.toEqual({ data: { id: "acc_123" } });
        });
    });

    describe("update()", () => {
        it("sends PATCH /account with the email in the payload", async () => {
            await account.update("jane@example.com");
            expect(request).toHaveBeenCalledWith("/account", "PATCH", { email: "jane@example.com" });
        });

        it("returns whatever the adapter returns", async () => {
            request.mockResolvedValue({ data: { email: "jane@example.com" } });
            await expect(account.update("jane@example.com")).resolves.toEqual({
                data: { email: "jane@example.com" },
            });
        });
    });

    describe("error handling", () => {
        it("propagates adapter errors from list()", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(account.list()).rejects.toThrow("network down");
        });

        it("propagates adapter errors from update()", async () => {
            request.mockRejectedValue(new Error("invalid email"));
            await expect(account.update("bad")).rejects.toThrow("invalid email");
        });
    });
});