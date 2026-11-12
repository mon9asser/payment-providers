import {
    CustomerCreate,
    CustomerDelete,
    CustomerCreditBalance
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



export default class PaddleCustomer implements  CustomerCreate {
    
    async create(objData: AddCustomerData) {
        console.log(objData);
    }

}


