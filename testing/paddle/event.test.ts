import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddleEvent from "../../payment/providers/paddle/event";
import Adapter from "../../payment/helper/adapter";

describe("PaddleEvent", () => {
    // Fake adapter: no network calls, we only check what it was called with.
    const request = vi.fn();
    const adapter = { request } as unknown as Adapter;
    let events: PaddleEvent;

    beforeEach(() => {
        request.mockReset();
        request.mockResolvedValue({ data: {} });
        events = new PaddleEvent(adapter);
    });

    describe("all()", () => {
        it("calls GET /events with no query string by default", async () => {
            await events.all();
            expect(request).toHaveBeenCalledWith("/events");
        });

        it("omits the query string when given an empty object", async () => {
            await events.all({});
            expect(request).toHaveBeenCalledWith("/events");
        });

        it("calls the adapter exactly once and with the URL only", async () => {
            await events.all({ per_page: 10 });
            expect(request).toHaveBeenCalledTimes(1);
            expect(request.mock.calls[0]).toHaveLength(1);
        });

        it("serializes a single option into the query string", async () => {
            await events.all({ per_page: 25 });
            expect(request).toHaveBeenCalledWith("/events?per_page=25");
        });

        it("serializes after", async () => {
            await events.all({ after: "evt_123" });
            expect(request).toHaveBeenCalledWith("/events?after=evt_123");
        });

        it("serializes order_by ascending", async () => {
            await events.all({ order_by: "id[ASC]" });
            expect(request).toHaveBeenCalledWith("/events?order_by=id[ASC]");
        });

        it("serializes order_by descending", async () => {
            await events.all({ order_by: "id[DESC]" });
            expect(request).toHaveBeenCalledWith("/events?order_by=id[DESC]");
        });

        it("serializes a single event_type as one value", async () => {
            await events.all({ event_type: ["transaction.completed"] });
            expect(request).toHaveBeenCalledWith("/events?event_type=transaction.completed");
        });

        it("serializes multiple event_type values as comma-separated", async () => {
            await events.all({
                event_type: ["subscription.created", "subscription.canceled", "transaction.paid"],
            });
            expect(request).toHaveBeenCalledWith(
                "/events?event_type=subscription.created,subscription.canceled,transaction.paid"
            );
        });

        it("serializes event types containing underscores", async () => {
            await events.all({
                event_type: ["api_key.created", "api_key_exposure.created", "usage_balance.depleted"],
            });
            expect(request).toHaveBeenCalledWith(
                "/events?event_type=api_key.created,api_key_exposure.created,usage_balance.depleted"
            );
        });

        it("serializes filter", async () => {
            await events.all({ filter: "subscription" });
            expect(request).toHaveBeenCalledWith("/events?filter=subscription");
        });

        it("serializes from and to date filters", async () => {
            await events.all({
                from: "2024-01-01T00:00:00Z",
                to: "2024-02-01T00:00:00Z",
            });
            expect(request).toHaveBeenCalledWith(
                "/events?from=2024-01-01T00:00:00Z&to=2024-02-01T00:00:00Z"
            );
        });

        it("serializes multiple options in insertion order", async () => {
            await events.all({
                event_type: ["transaction.billed", "transaction.paid"],
                order_by: "id[DESC]",
                per_page: 50,
                after: "evt_9",
                from: "2024-01-01T00:00:00Z",
                to: "2024-02-01T00:00:00Z",
                filter: "billing",
            });
            expect(request).toHaveBeenCalledWith(
                "/events?event_type=transaction.billed,transaction.paid&order_by=id[DESC]&per_page=50&after=evt_9&from=2024-01-01T00:00:00Z&to=2024-02-01T00:00:00Z&filter=billing"
            );
        });

        it("keeps insertion order regardless of key order", async () => {
            await events.all({ per_page: 5, after: "evt_1" });
            expect(request).toHaveBeenLastCalledWith("/events?per_page=5&after=evt_1");

            await events.all({ after: "evt_1", per_page: 5 });
            expect(request).toHaveBeenLastCalledWith("/events?after=evt_1&per_page=5");
        });

        it("does not leave a trailing ampersand", async () => {
            await events.all({ per_page: 5, after: "evt_1" });
            const [url] = request.mock.calls[0];
            expect(url.endsWith("&")).toBe(false);
        });

        it("serializes per_page=0 (does not drop falsy values)", async () => {
            await events.all({ per_page: 0 });
            expect(request).toHaveBeenCalledWith("/events?per_page=0");
        });

        it("serializes an empty event_type array as an empty value", async () => {
            await events.all({ event_type: [] });
            expect(request).toHaveBeenCalledWith("/events?event_type=");
        });

        it("returns whatever the adapter returns", async () => {
            const response = { data: [{ event_id: "evt_1" }] };
            request.mockResolvedValue(response);
            await expect(events.all()).resolves.toBe(response);
        });

        it("propagates adapter errors", async () => {
            request.mockRejectedValue(new Error("network down"));
            await expect(events.all()).rejects.toThrow("network down");
        });
    });
});