 
import {ResponseType, RequestCache} from "../helper/helper";

interface CustomerRetrieve {
    all(options: {}): Promise<ResponseType>;
}

interface CustomerCreate {
    create(objData: {}): Promise<ResponseType>;
}

interface CustomerRetrieveById {
    findById(customer_id:string): Promise<ResponseType>;
}

interface CustomerUpdate {
    update(customer_id:string, objData: {}): Promise<ResponseType>;
}

interface CustomerSearch {
    search(objData: {}): Promise<ResponseType>;
}

interface CustomerDelete {
    delete(customer_id:string): Promise<ResponseType>;
}

interface CustomerCreditBalance {
    creditBalance(customer_id:string, currency_code: string[]): Promise<ResponseType>;
}

interface CustomerGenerateAuthToken {
    generateAuthToken(customer_id:string): Promise<ResponseType>;
}

export {
    CustomerRetrieve,
    CustomerCreate,
    CustomerRetrieveById,
    CustomerUpdate,
    CustomerSearch,
    CustomerDelete,
    CustomerCreditBalance,
    CustomerGenerateAuthToken,
}