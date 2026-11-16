
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
    CustomerUpdateAddress,

    CustomerBusinesses,
    CustomerCreateBusiness,
    CustomerFindBusinessById,
    CustomerUpdateBusiness
} from "./../../core/customer";

import {ResponseType,RequestCache} from "./../../helper/helper";

import Adapter from "../../helper/adapter";


interface RetrieveCustomersDataParams {
    id?: string[];
    after?: string;
    per_page?: number;
    email?: string[];
    order_by?: 'id[ASC]' | 'id[DESC]';
    status?: ('active' | 'archived')[];
    search?: string;
}

interface CustomerDataQueryParamType {
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


interface BusinessContactRequestBodyType {
    name?: string;
    email: string;
}

interface BusinessRequestBodyType {
    name: string;
    company_number?: string | null;
    tax_identifier?: string | null;
    contacts?: BusinessContactRequestBodyType[] | null;
    custom_data?: Record<string, unknown> | null;
}

interface BusinessUpdateRequestBodyType {
    name?: string;
    company_number?: string | null;
    tax_identifier?: string | null;
    status?: 'active' | 'archived';
    contacts?: BusinessContactRequestBodyType[] | null;
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
    CustomerUpdateAddress,

    CustomerBusinesses,
    CustomerCreateBusiness,
    CustomerFindBusinessById,
    CustomerUpdateBusiness
{
    
    private adapter;
    private uri: string = "/customers";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(options: RetrieveCustomersDataParams = {}): Promise<ResponseType> { 

        let param = '';
        const keys = Object.keys(options);
        ( keys as (keyof RetrieveCustomersDataParams)[]).forEach((key, index) => {
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




    async addresses(customer_id:string, queryParam:CustomerDataQueryParamType = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof CustomerDataQueryParamType)[]).forEach((key, index) => {
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



    async businesses(customer_id:string, queryParam:CustomerDataQueryParamType = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof CustomerDataQueryParamType)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}/${customer_id}/businesses`;
        if( param != '') {
            api = `${api}?${param}`;
        }
 
        return await this.adapter.request(api);
    }

    async createBusiness(customer_id:string, body: BusinessRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/businesses`;
        return await this.adapter.request(api, "POST", body);
    }

    async findBusinessById(customer_id:string, business_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/businesses/${business_id}`;
        return await this.adapter.request(api);
    }

    async updateBusiness(customer_id:string, business_id:string, body: BusinessUpdateRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}/${customer_id}/businesses/${business_id}`;
        return await this.adapter.request(api, "PATCH", body);
    }
}