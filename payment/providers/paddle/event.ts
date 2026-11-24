
import {
    EventRetrieve
} from "./../../core/event";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";

type EventType =
    | "address.created"
    | "address.imported"
    | "address.updated"
    | "adjustment.created"
    | "adjustment.updated"
    | "api_key.created"
    | "api_key.expired"
    | "api_key.expiring"
    | "api_key.revoked"
    | "api_key.updated"
    | "api_key_exposure.created"
    | "api_key_rotation.created"
    | "api_key_rotation.updated"
    | "business.created"
    | "business.imported"
    | "business.updated"
    | "client_token.created"
    | "client_token.revoked"
    | "client_token.updated"
    | "customer.created"
    | "customer.imported"
    | "customer.updated"
    | "discount.created"
    | "discount.imported"
    | "discount.updated"
    | "discount_group.created"
    | "discount_group.updated"
    | "meter.created"
    | "meter.updated"
    | "payment_method.saved"
    | "payment_method.deleted"
    | "payout.created"
    | "payout.paid"
    | "price.created"
    | "price.imported"
    | "price.updated"
    | "product.created"
    | "product.imported"
    | "product.updated"
    | "report.created"
    | "report.updated"
    | "subscription.activated"
    | "subscription.canceled"
    | "subscription.created"
    | "subscription.imported"
    | "subscription.past_due"
    | "subscription.paused"
    | "subscription.resumed"
    | "subscription.trialing"
    | "subscription.updated"
    | "transaction.billed"
    | "transaction.canceled"
    | "transaction.completed"
    | "transaction.created"
    | "transaction.paid"
    | "transaction.past_due"
    | "transaction.payment_failed"
    | "transaction.ready"
    | "transaction.revised"
    | "transaction.updated"
    | "usage_balance.depleted";
    
interface EventQueryParams {
    after?: string;
    per_page?: number;
    order_by?: "id[ASC]" | "id[DESC]";
    event_type?: EventType[];
    filter?: string;
    to?: string;
    from?: string;
}

export default class PaddleEvent 
    implements 
        EventRetrieve
{

    private adapter;
    private uri: string = "/events";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }
    
    async all(queryParam: EventQueryParams = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof EventQueryParams)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });
 
        let api = `${this.uri}`;
        if( param != '') {
            api = `${api}?${param}`;
        }
 
        return await this.adapter.request(api);
    }
}