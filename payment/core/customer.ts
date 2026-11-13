 
interface CustomerRetrieve {
    all(options: {}): Promise<[]>;
}

interface CustomerCreate {
    create(objData: {}): Promise<object>;
}

interface CustomerRetrieveById {
    findById(customer_id:string): Promise<object>;
}

interface CustomerUpdate {
    update(customer_id:string, objData: {}): Promise<object>;
}

interface CustomerSearch {
    search(objData: {}): Promise<object>;
}

interface CustomerDelete {
    delete(customer_id:string): Promise<object>;
}

interface CustomerCreditBalance {
    creditBalance(customer_id:string): Promise<object>;
}

interface CustomerGenerateAuthToken {
    generateAuthToken(customer_id:string): Promise<object>;
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