
import {
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerCreate,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken,

    CustomerAddress,
    CustomerCreateAddress,
    CustomerFindAddressById,
    CustomerUpdateAddress
} from "./../../core/customer";

import {ResponseType,RequestCache} from "./../../helper/helper";

import Adapter from "../../helper/adapter";


interface RetrieveCustomersParams {
    id?: string[];
    after?: string;
    per_page?: number;
    email?: string[];
    order_by?: 'id[ASC]' | 'id[DESC]';
    status?: ('active' | 'archived')[];
    search?: string;
}

interface CustomerAddressQueryParamType {
    id?: string[];
    after?: string;
    per_page?: number;
    order_by?: 'id[ASC]' | 'id[DESC]';
    status?: ('active' | 'archived')[];
    search?: string;
}

interface CustomerAddressRequestBodyType {
    description?: string | null;
    first_line?: string | null;
    second_line?: string | null;
    city?: string | null;
    postal_code?: string | null;
    region?: string | null;
    country_code: string;
    custom_data?: Record<string, unknown> | null;
}

interface CustomerAddressUpdateRequestBodyType {
    description?: string | null;
    first_line?: string | null;
    second_line?: string | null;
    city?: string | null;
    postal_code?: string | null;
    region?: string | null;
    country_code?: string;
    custom_data?: Record<string, unknown> | null;
    status?: 'active' | 'archived';
}

interface CustomerCreateParamType {
    name?: string;
    email: string;
    custom_data?: object | null; 
    locale?:string;
}

interface CustomerUpdateParamType {
    name?: string;
    email?: string;
    custom_data?: object | null; 
    status?: "active" | "archived";
    locale?:string;
}


export default class PaddleCustomer
    implements
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerCreate,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken,

    CustomerAddress,
    CustomerCreateAddress,
    CustomerFindAddressById,
    CustomerUpdateAddress
{
    
    private adapter;
    private uri: string = "/customers";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(options: RetrieveCustomersParams = {}): Promise<ResponseType> { 

        let param = '';
        const keys = Object.keys(options);
        ( keys as (keyof RetrieveCustomersParams)[]).forEach((key, index) => {
            param += `${key}=${options[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}`;
        if( param != '') {
            api = `${api}?${param}`;
        }
 
        return await this.adapter.request(api);
    };
    
    async create(objData: CustomerCreateParamType): Promise<ResponseType>{
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objData);
    }

    async findById(customer_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}`;
        return await this.adapter.request(api);
    } 
    
    async update(customer_id:string, objData: CustomerUpdateParamType): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}`;
        return await this.adapter.request(api, "PATCH", objData);
    }

    async creditBalance(customer_id:string, currency_code: string[] = []): Promise<ResponseType>{
        let param = '';
        
        if(currency_code.length) {
            param = `?currency_code=${currency_code.join(',')}`
        }

        let api = `${this.uri}/${customer_id}/credit-balances${param}`;
        return await this.adapter.request(api);
    } 
    
    async generateAuthToken(customer_id:string): Promise<ResponseType> { 
        let api = `${this.uri}/${customer_id}/auth-token`;
        return await this.adapter.request(api, "POST");
    }

    async addresses(customer_id:string, queryParam:CustomerAddressQueryParamType = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof CustomerAddressQueryParamType)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}/${customer_id}/addresses`;
        if( param != '') {
            api = `${api}?${param}`;
        }
 
        return await this.adapter.request(api);
    }

    async createAddress(customer_id:string, body: CustomerAddressRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/addresses`;
        return await this.adapter.request(api, "POST", body);
    }

    async findAddressById(customer_id:string, address_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/addresses/${address_id}`;
        return await this.adapter.request(api);
    }

    async updateAddress(customer_id:string, address_id:string, body: CustomerAddressUpdateRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/addresses/${address_id}`;
        return await this.adapter.request(api, "PATCH", body);
    } 
}