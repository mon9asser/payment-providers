 
import {ResponseType} from "../helper/helper";

interface SubscriptionRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface  SubscriptionUpdatePaymentMethodTransaction {
    updatePaymentMethodTransaction(subscription_id:string): Promise<ResponseType>;
}
interface  SubscriptionRetrieveById {
    findById( subscription_id:string): Promise<ResponseType>;
}
interface  SubscriptionUpdate {
    update( subscription_id:string, objData: {}): Promise<ResponseType>;
}


export {
     SubscriptionRetrieve,
     SubscriptionUpdatePaymentMethodTransaction,
     SubscriptionRetrieveById,
     SubscriptionUpdate
}