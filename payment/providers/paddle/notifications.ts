 
import {
    NotificationRetrieve,
    NotificationById,
    NotificationReplay
} from "./../../core/notifications";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";

type NotificationStatus =
    | "delivered"
    | "failed"
    | "needs_retry"
    | "not_attempted";

interface NotificationQueryParams {
    after?: string;
    per_page?: number;
    notification_setting_id?: string[];
    order_by?: "id[ASC]" | "id[DESC]";
    search?: string;
    status?: NotificationStatus[];
    filter?: string;
    to?: string;
    from?: string;
}

export default class PaddleNotifications 
    implements 
        NotificationRetrieve,
        NotificationById,
        NotificationReplay
{

    private adapter;
    private uri: string = "/notifications";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }
    
    async all(queryParam: NotificationQueryParams = {}): Promise<ResponseType> { 

        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof NotificationQueryParams)[]).forEach((key, index) => {
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

    async findById(notification_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${notification_id}`;
        return await this.adapter.request(api);
    }

    async replay(notification_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${notification_id}/replay`;
        return await this.adapter.request(api, "POST");
    }
}