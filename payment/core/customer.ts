 
interface CustomerRetrieve {
    all?(): [];
}
interface CustomerCreate {
    create?(objData: {}): object;
}
interface CustomerRetrieveById {
    findById?(customer_id:string): object;
}
interface CustomerUpdate {
    update?(customer_id:string, objData: {}): object; 
}
interface CustomerSearch {
    search?(objData: {}): {};
}
interface CustomerDelete {
    delete?(customer_id:string): {};
}
interface CustomerCreditBalance {
    creditBalance?(customer_id:string): {};
}
interface CustomerGenerateAuthToken {
    generateAuthToken?(customer_id:string): {};
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