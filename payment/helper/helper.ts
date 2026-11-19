interface PaymentProviderConfig {
    environment: "sandbox" | "live";
    credentials: {
        publicKey?: string;
        secretKey: string;
        webhookSecret?: string;
    };
}

type PaddleCurrencyCode =
  | "USD" | "EUR" | "GBP" | "JPY" | "AUD"
  | "CAD" | "CHF" | "HKD" | "SGD" | "SEK"
  | "ARS" | "BRL" | "CLP" | "CNY" | "COP"
  | "CZK" | "DKK" | "HUF" | "ILS" | "INR"
  | "KRW" | "MXN" | "NOK" | "NZD" | "PEN"
  | "PLN" | "RUB" | "THB" | "TRY" | "TWD"
  | "UAH" | "VND" | "ZAR";

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
    RequestCache,
    PaddleCurrencyCode
};