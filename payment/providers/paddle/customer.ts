
import {
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerCreate,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken
} from "./../../core/customer";
import Adapter from "../../helper/adapter";

export default class PaddleCustomer
    implements
    CustomerRetrieve,
    CustomerRetrieveById,
    CustomerCreate,
    CustomerUpdate,
    CustomerCreditBalance,
    CustomerGenerateAuthToken
{
    private helper;
    constructor(adapter: Adapter) {
        this.helper = adapter;
    }

    async all(options: {} = {}): Promise<[]> {
        this.helper.request()
        return [];
    };
    
    async findById(customer_id:string): Promise<object> {
        return {};
    }

    async create(objData: {}): Promise<object> {
        return {}
    }

    async update(customer_id:string, objData: {}): Promise<object> {
        return {}
    }

    async creditBalance(customer_id:string): Promise<object> {
        return {};
    }
    async generateAuthToken(customer_id:string): Promise<object> {
        return {};
    }
}