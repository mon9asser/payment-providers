interface PaymentProviderConfig {
    environment: "sandbox" | "live";
    credentials: {
        publicKey?: string;
        secretKey: string;
        webhookSecret?: string;
    };
}


interface ResponseType<T = unknown> {
    isError: boolean;
    message: string;
    data:  T | null;
}

type RequestCache =
    | "default"
    | "force-cache"
    | "no-cache"
    | "no-store"
    | "only-if-cached"
    | "reload";
 
export {
    PaymentProviderConfig, 
    ResponseType,
    RequestCache
};