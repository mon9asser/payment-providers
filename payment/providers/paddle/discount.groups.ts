
import {
    DiscountGroupRetrieve,
    DiscountGroupCreate,
    DiscountGroupRetrieveById,
    DiscountGroupUpdate
} from "./../../core/discount.groups";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";


interface DiscountListQuery {
    id?: string[];
    after?: string;
    per_page?: number;
    order_by?: DiscountOrderBy;
}

type DiscountOrderBy =
    | "created_at[ASC]"
    | "created_at[DESC]"
    | "id[ASC]"
    | "id[DESC]";

interface DiscountGroupCreateBody {
    name: string;
}

interface DiscountGroupUpdateBody {
    name?: string;
    status?: "active" | "archived";
}

export default class PaddleDiscountGroups 
    implements 
        DiscountGroupRetrieve,
        DiscountGroupCreate,
        DiscountGroupRetrieveById,
        DiscountGroupUpdate
{

    private adapter;
    private uri: string = "/discount-groups";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }
    
    async all(queryParam: DiscountListQuery = {}): Promise<ResponseType> {

        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof DiscountListQuery)[]).forEach((key, index) => {
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

    async create(objectData: DiscountGroupCreateBody): Promise<ResponseType>{
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objectData);
    }

    async findById(discount_group_id:string): Promise<ResponseType>{
        const api = `${this.uri}/${discount_group_id}`; 
        return await this.adapter.request(api);
    }

    async update(discount_group_id:string, objData: DiscountGroupUpdateBody): Promise<ResponseType>{
        const api = `${this.uri}/${discount_group_id}`;
        return await this.adapter.request(api, "PATCH", objData);
    }
}