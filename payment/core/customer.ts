

export default interface CustomerInterface {
  
    all?(): [];
    create?(objData: {}): object;
    findById?(customer_id:string): object;
    update?(customer_id:string, objData: {}): object; 
    search?(objData: {}): {};
    delete?(customer_id:string): {}; 
    creditBalance?(customer_id:string): {};
    generateAuthToken?(customer_id:string): {};

}