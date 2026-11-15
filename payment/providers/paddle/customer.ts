
import {
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerCreate,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken
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
    CustomerGenerateAuthToken
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
}