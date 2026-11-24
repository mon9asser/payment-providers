
import {
    EventTypesRetrieve
} from "./../../core/event.types";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";

export default class PaddleEventTypes 
    implements 
        EventTypesRetrieve
{

    private adapter;
    private uri: string = "/event-types";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }
    
    async all(): Promise<ResponseType> { 
        let api = `${this.uri}`; 
        return await this.adapter.request(api);
    }
}