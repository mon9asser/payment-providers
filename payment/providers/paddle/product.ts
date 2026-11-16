
import {
    ProductRetrieve,
    ProductCreate,
    ProductRetrieveById,
    ProductUpdate
} from "../../core/product";

import Adapter from "../../helper/adapter";
import {ResponseType} from "./../../helper/helper";



interface ProductDataQueryParamType {
    id?: string[];
    after?: string;
    per_page?: number;
    include?: ('prices')[];
    order_by?:
        | 'created_at[ASC]'
        | 'created_at[DESC]'
        | 'custom_data[ASC]'
        | 'custom_data[DESC]'
        | 'description[ASC]'
        | 'description[DESC]'
        | 'id[ASC]'
        | 'id[DESC]'
        | 'image_url[ASC]'
        | 'image_url[DESC]'
        | 'name[ASC]'
        | 'name[DESC]'
        | 'status[ASC]'
        | 'status[DESC]'
        | 'tax_category[ASC]'
        | 'tax_category[DESC]'
        | 'updated_at[ASC]'
        | 'updated_at[DESC]';
    status?: ('active' | 'archived')[];
    tax_category?: (
        | 'digital-goods'
        | 'ebooks'
        | 'implementation-services'
        | 'professional-services'
        | 'saas'
        | 'software-programming-services'
        | 'standard'
        | 'training-services'
        | 'website-hosting'
    )[];
    type?: 'custom' | 'standard';
}


interface ProductUpdateRequestBodyType {
    name?: string;
    description?: string | null;
    type?: 'custom' | 'standard';
    tax_category?:
        | 'digital-goods'
        | 'ebooks'
        | 'implementation-services'
        | 'professional-services'
        | 'saas'
        | 'software-programming-services'
        | 'standard'
        | 'training-services'
        | 'website-hosting';
    image_url?: string | null;
    custom_data?: Record<string, unknown> | null;
    status?: 'active' | 'archived';
}


interface ProductGetQueryParamType {
    include?: ('prices')[];
}

interface ProductCreateRequestBodyType {
    name: string;
    description?: string | null;
    type?: 'custom' | 'standard';
    tax_category:
        | 'digital-goods'
        | 'ebooks'
        | 'implementation-services'
        | 'professional-services'
        | 'saas'
        | 'software-programming-services'
        | 'standard'
        | 'training-services'
        | 'website-hosting';
    image_url?: string | null;
    custom_data?: Record<string, unknown> | null;
}


export default class PaddleProduct 
    implements 
        ProductRetrieve,
        ProductCreate,
        ProductRetrieveById,
        ProductUpdate
{
    
    private adapter;
    private uri: string = "/products";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    public async all(queryParam: ProductDataQueryParamType = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof ProductDataQueryParamType)[]).forEach((key, index) => {
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
    public async findById(product_id:string, included: ProductGetQueryParamType = {} ): Promise<ResponseType> {
     
        const params = new URLSearchParams();

        if (included.include?.length) {
            params.set('include', included.include.join(','));
        }

        const query = params.toString();
        const api = `${this.uri}/${product_id}${query ? `?${query}` : ''}`;


        return await this.adapter.request(api);
    }

    public async create(objData:ProductCreateRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objData);
    }

    public async update(product_id:string, objData:ProductUpdateRequestBodyType): Promise<ResponseType> {
        let api = `${this.uri}/${product_id}`;
        return await this.adapter.request(api, "PATCH", objData);
    }

}


