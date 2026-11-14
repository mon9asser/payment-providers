interface PaymentProviderConfig {
    environment: "sandbox" | "live";
    credentials: {
        publicKey?: string;
        secretKey: string;
        webhookSecret?: string;
    };
}


type ajaxCacheOption = "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";

export {
    PaymentProviderConfig,
    ajaxCacheOption
};