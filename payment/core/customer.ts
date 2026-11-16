 
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


interface CustomerAddress {
    addresses(customer_id:string, queryParam:{}): Promise<ResponseType>;
}

interface CustomerCreateAddress {
    createAddress(customer_id:string, body: {}): Promise<ResponseType>;
}

interface CustomerFindAddressById {
    findAddressById(customer_id:string, address_id:string): Promise<ResponseType>;
}

interface CustomerUpdateAddress {
    updateAddress(customer_id:string, address_id:string, body: {}): Promise<ResponseType>;
}



interface CustomerBusinesses {
    businesses(customer_id:string, queryParam:{}): Promise<ResponseType>;
}

interface CustomerCreateBusiness {
    createBusiness(customer_id:string, body: {}): Promise<ResponseType>;
}

interface CustomerFindBusinessById {
    findBusinessById(customer_id:string, business_id:string): Promise<ResponseType>;
}

interface CustomerUpdateBusiness {
    updateBusiness(customer_id:string, business_id:string, body: {}): Promise<ResponseType>;
}


interface CustomerPaymentMethods {
    paymentMethods(customer_id:string, queryParam:{}): Promise<ResponseType>;
}

interface CustomerFindPaymentMethodById {
    findPaymentMethodById(customer_id:string, payment_method_id:string): Promise<ResponseType>;
}

interface CustomerDeletePaymentMethod {
    deletePaymentMethodById(customer_id:string, payment_method_id:string): Promise<ResponseType>;
}

interface CustomerPortalSession {
    portalSession(customer_id: string, subscription_ids:string[]): Promise<ResponseType>;
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

    CustomerAddress,
    CustomerCreateAddress,
    CustomerFindAddressById,
    CustomerUpdateAddress,

    CustomerBusinesses,
    CustomerCreateBusiness,
    CustomerFindBusinessById,
    CustomerUpdateBusiness,

    CustomerPaymentMethods,
    CustomerFindPaymentMethodById,
    CustomerDeletePaymentMethod,

    CustomerPortalSession
}