import {ResponseType} from "../helper/helper";

interface SubscriptionRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface SubscriptionRetrieveById {
    findById(subscription_id: string): Promise<ResponseType>;
}
interface SubscriptionUpdate {
    update(subscription_id: string, objData: {}): Promise<ResponseType>;
}
interface SubscriptionUpdatePaymentMethodTransaction {
    updatePaymentMethodTransaction(subscription_id: string): Promise<ResponseType>;
}
interface SubscriptionActivate {
    activateSubscription(subscription_id: string): Promise<ResponseType>;
}
interface SubscriptionCancel {
    cancelSubscription(subscription_id: string, reqBody?: {}): Promise<ResponseType>;
}
interface SubscriptionCreateOneTimeCharge {
    createOneTimeCharge(subscription_id: string, reqBody: {}): Promise<ResponseType>;
}
interface SubscriptionPause {
    pauseSubscription(subscription_id: string, reqBody: {}): Promise<ResponseType>;
}
interface SubscriptionResume {
    resumeSubscription(subscription_id: string, reqBody: {}): Promise<ResponseType>;
}
interface SubscriptionPreviewUpdate {
    previewUpdate(subscription_id: string, reqBody: {}): Promise<ResponseType>;
}
interface SubscriptionPreviewOneTimeCharge {
    previewOneTimeCharge(subscription_id: string, reqBody: {}): Promise<ResponseType>;
}

export {
    SubscriptionRetrieve,
    SubscriptionRetrieveById,
    SubscriptionUpdate,
    SubscriptionUpdatePaymentMethodTransaction,
    SubscriptionActivate,
    SubscriptionCancel,
    SubscriptionCreateOneTimeCharge,
    SubscriptionPause,
    SubscriptionResume,
    SubscriptionPreviewUpdate,
    SubscriptionPreviewOneTimeCharge
}