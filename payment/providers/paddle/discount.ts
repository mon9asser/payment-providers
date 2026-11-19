
import {
    DiscountRetrieve,
    DiscountCreate,
    DiscountRetrieveById,
    DiscountUpdate
} from "./../../core/discount";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";

type DiscountStatus = "active" | "archived";

type DiscountMode = "standard" | "custom";

type DiscountType = 
    | "flat"
    | "flat_per_seat"
    | "percentage";

type DiscountInclude = "discount_group";

type DiscountOrderBy =
    | "created_at[ASC]"
    | "created_at[DESC]"
    | "id[ASC]"
    | "id[DESC]";

interface DiscountCreateType {
    description: string;
    enabled_for_checkout?: boolean;
    code?: string | null;
    type: DiscountType;
    mode?: DiscountMode;
    amount: string;
    currency_code?: PaddleCurrencyCode | null;
    recur?: boolean;
    maximum_recurring_intervals?: number | null;
    usage_limit?: number | null;
    restrict_to?: string[] | null;
    expires_at?: string | null;
    custom_data?: Record<string, unknown> | null;
    discount_group_id?: string | null;
}

interface DiscountListQuery {
    id?: string[];
    after?: string;
    per_page?: number;
    include?: DiscountInclude[];
    code?: string[];
    order_by?: DiscountOrderBy;
    status?: DiscountStatus[];
    mode?: DiscountMode;
    discount_group_id?: string[];
}


interface DiscountGetQueryParamType {
    include?: ('discount_group')[];
}

interface DiscountUpdateBody {
    status?: DiscountStatus;
    description?: string;
    enabled_for_checkout?: boolean;
    code?: string | null;
    type?: DiscountType;
    mode?: DiscountMode;
    amount?: string;
    currency_code?: PaddleCurrencyCode | null;
    recur?: boolean;
    maximum_recurring_intervals?: number | null;
    usage_limit?: number | null;
    restrict_to?: string[] | null;
    expires_at?: string | null;
    custom_data?: Record<string, unknown> | null;
    discount_group_id?: string | null;
}

export default class PaddleDiscount 
    implements 
        DiscountRetrieve,
        DiscountCreate,
        DiscountRetrieveById,
        DiscountUpdate
{

    private adapter;
    private uri: string = "/discounts";

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

    async create(objectData: DiscountCreateType): Promise<ResponseType>{
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objectData);
    }

    async findById(discount_id:string, reqParam:DiscountGetQueryParamType = {}): Promise<ResponseType>{
        const params = new URLSearchParams();

        if (reqParam.include?.length) {
            params.set('include', reqParam.include.join(','));
        }

        const query = params.toString();
        const api = `${this.uri}/${discount_id}${query ? `?${query}` : ''}`; 
        return await this.adapter.request(api);
    }

    async update(discount_id:string, objData: DiscountUpdateBody): Promise<ResponseType>{
        const api = `${this.uri}/${discount_id}`;
        return await this.adapter.request(api, "PATCH", objData);
    }
}