import {
    CustomerCreate,
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken
} from "./../../core/customer";

type status = "active" | "archived";

interface AddCustomerData {
    name?: string;
    email: string;
    custom_data?: object | null; 
    locale?:string;
}

interface updateCustomerData {
    name?: string,
    email?: string,
    status?: status,
    custom_data?: object | null; 
    locale?:string;
} 

export interface RetrieveCustomersParams {
    id?: string[];
    after?: string;
    per_page?: number;
    email?: string[];
    order_by?: 'id[ASC]' | 'id[DESC]';
    status?: ('active' | 'archived')[];
    search?: string;
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


    async all(options: RetrieveCustomersParams = {}): Promise<[]> {
        
        let params = {};



        return [];
    }

    async findById(customer_id:string): Promise<object> {
        return {}
    }

    async create(objData: AddCustomerData): Promise<object> {
        return {};
    }

    async update(customer_id:string, objData: {}): Promise<object> {
        return {};
    }

    async creditBalance(customer_id:string): Promise<object> {
        return {};
    }

    async generateAuthToken(customer_id:string): Promise<object> {
        return {};
    }
}

