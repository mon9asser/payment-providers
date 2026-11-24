import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleNotifications from "../../payment/providers/paddle/notifications";
import Adapter from "../../payment/helper/adapter";

describe("PaddleNotifications", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let notifications: PaddleNotifications;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        notifications = new PaddleNotifications(adapter);
    });

    describe("all()", () => {
        it("calls GET /notifications with no query string by default", async () => {
            await notifications.all();
            expect(request).toHaveBeenCalledWith("/notifications");
        });

        it("omits the query string when given an empty object", async () => {
            await notifications.all({});
            expect(request).toHaveBeenCalledWith("/notifications");
        });

        it("calls the adapter exactly once with the URL only (default GET)", async () => {
            await notifications.all({ per_page: 10 });
            expect(request).toHaveBeenCalledTimes(1);
            expect(request.mock.calls[0]).toHaveLength(1);
        });

        it("serializes a single option into the query string", async () => {
            await notifications.all({ per_page: 25 });
            expect(request).toHaveBeenCalledWith("/notifications?per_page=25");
        });

        it("serializes after", async () => {
            await notifications.all({ after: "ntf_123" });
            expect(request).toHaveBeenCalledWith("/notifications?after=ntf_123");
        });

        it("serializes order_by ascending", async () => {
            await notifications.all({ order_by: "id[ASC]" });
            expect(request).toHaveBeenCalledWith("/notifications?order_by=id[ASC]");
        });

        it("serializes order_by descending", async () => {
            await notifications.all({ order_by: "id[DESC]" });
            expect(request).toHaveBeenCalledWith("/notifications?order_by=id[DESC]");
        });

        it("serializes search", async () => {
            await notifications.all({ search: "txn_123" });
            expect(request).toHaveBeenCalledWith("/notifications?search=txn_123");
        });

        it("serializes filter", async () => {
            await notifications.all({ filter: "transaction" });
            expect(request).toHaveBeenCalledWith("/notifications?filter=transaction");
        });

        it("serializes a single notification_setting_id", async () => {
            await notifications.all({ notification_setting_id: ["ntfset_1"] });
            expect(request).toHaveBeenCalledWith("/notifications?notification_setting_id=ntfset_1");
        });

        it("serializes multiple notification_setting_id values as comma-separated", async () => {
            await notifications.all({ notification_setting_id: ["ntfset_1", "ntfset_2"] });
            expect(request).toHaveBeenCalledWith(
                "/notifications?notification_setting_id=ntfset_1,ntfset_2"
            );
        });

        it("serializes a single status", async () => {
            await notifications.all({ status: ["failed"] });
            expect(request).toHaveBeenCalledWith("/notifications?status=failed");
        });

        it("serializes every notification status", async () => {
            await notifications.all({
                status: ["delivered", "failed", "needs_retry", "not_attempted"],
            });
            expect(request).toHaveBeenCalledWith(
                "/notifications?status=delivered,failed,needs_retry,not_attempted"
            );
        });

        it("serializes from and to date filters", async () => {
            await notifications.all({
                from: "2024-01-01T00:00:00Z",
                to: "2024-02-01T00:00:00Z",
            });
            expect(request).toHaveBeenCalledWith(
                "/notifications?from=2024-01-01T00:00:00Z&to=2024-02-01T00:00:00Z"
            );
        });

        it("serializes multiple options in insertion order", async () => {
            await notifications.all({
                notification_setting_id: ["ntfset_1", "ntfset_2"],
                status: ["failed", "needs_retry"],
                order_by: "id[DESC]",
                per_page: 50,
                after: "ntf_9",
                search: "abc",
                from: "2024-01-01T00:00:00Z",
                to: "2024-02-01T00:00:00Z",
                filter: "billing",
            });
            expect(request).toHaveBeenCalledWith(
                "/notifications?notification_setting_id=ntfset_1,ntfset_2&status=failed,needs_retry&order_by=id[DESC]&per_page=50&after=ntf_9&search=abc&from=2024-01-01T00:00:00Z&to=2024-02-01T00:00:00Z&filter=billing"
            );
        });

        it("keeps insertion order regardless of key order", async () => {
            await notifications.all({ per_page: 5, after: "ntf_1" });
            expect(request).toHaveBeenLastCalledWith("/notifications?per_page=5&after=ntf_1");

            await notifications.all({ after: "ntf_1", per_page: 5 });
            expect(request).toHaveBeenLastCalledWith("/notifications?after=ntf_1&per_page=5");
        });

        it("does not leave a trailing ampersand", async () => {
            await notifications.all({ per_page: 5, after: "ntf_1" });
            const [url] = request.mock.calls[0];
            expect(url.endsWith("&")).toBe(false);
        });

        it("serializes per_page=0 (does not drop falsy values)", async () => {
            await notifications.all({ per_page: 0 });
            expect(request).toHaveBeenCalledWith("/notifications?per_page=0");
        });

        it("serializes empty arrays as an empty value", async () => {
            await notifications.all({ status: [] });
            expect(request).toHaveBeenCalledWith("/notifications?status=");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ id: "ntf_1" }] };
            request.mockResolvedValue(response);
            await expect(notifications.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(notifications.all()).rejects.toThrow("network down");
        });
    });

    describe("findById()", () => {
        it("calls GET /notifications/:id", async () => {
            await notifications.findById("ntf_123");
            expect(request).toHaveBeenCalledWith("/notifications/ntf_123");
        });

        it("calls the adapter exactly once with the URL only (default GET)", async () => {
            await notifications.findById("ntf_123");
            expect(request).toHaveBeenCalledTimes(1);
            expect(request.mock.calls[0]).toHaveLength(1);
        });

        it("puts the notification id in the path", async () => {
            await notifications.findById("ntf_other");
            expect(request).toHaveBeenCalledWith("/notifications/ntf_other");
        });

        it("does not add a query string", async () => {
            await notifications.findById("ntf_123");
            const [url] = request.mock.calls[0];
            expect(url).not.toContain("?");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "ntf_123" } };
            request.mockResolvedValue(response);
            await expect(notifications.findById("ntf_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("not found"));
            await expect(notifications.findById("ntf_missing")).rejects.toThrow("not found");
        });
    });

    describe("replay()", () => {
        it("calls POST /notifications/:id/replay with no body", async () => {
            await notifications.replay("ntf_123");
            expect(request).toHaveBeenCalledWith("/notifications/ntf_123/replay", "POST");
        });

        it("calls the adapter exactly once and sends no body", async () => {
            await notifications.replay("ntf_123");
            expect(request).toHaveBeenCalledTimes(1);
            expect(request.mock.calls[0]).toHaveLength(2);
        });

        it("puts the notification id in the path", async () => {
            await notifications.replay("ntf_other");
            expect(request).toHaveBeenCalledWith("/notifications/ntf_other/replay", "POST");
        });

        it("does not add a query string", async () => {
            await notifications.replay("ntf_123");
            const [url] = request.mock.calls[0];
            expect(url).not.toContain("?");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: { id: "ntf_new" } };
            request.mockResolvedValue(response);
            await expect(notifications.replay("ntf_123")).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("cannot replay"));
            await expect(notifications.replay("ntf_123")).rejects.toThrow("cannot replay");
        });
    });
});