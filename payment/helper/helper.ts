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

type PaddleCountryCode =
    | "AD" | "AE" | "AG" | "AI" | "AL" | "AM" | "AO" | "AR" | "AS" | "AT" | "AU" | "AW" | "AX" | "AZ"
    | "BA" | "BB" | "BD" | "BE" | "BF" | "BG" | "BH" | "BI" | "BJ" | "BL" | "BM" | "BN" | "BO" | "BQ"
    | "BR" | "BS" | "BT" | "BV" | "BW" | "BZ" | "CA" | "CC" | "CG" | "CH" | "CI" | "CK" | "CL" | "CM"
    | "CN" | "CO" | "CR" | "CV" | "CW" | "CX" | "CY" | "CZ" | "DE" | "DJ" | "DK" | "DM" | "DO" | "DZ"
    | "EC" | "EE" | "EG" | "EH" | "ER" | "ES" | "ET" | "FI" | "FJ" | "FK" | "FM" | "FO" | "FR" | "GA"
    | "GB" | "GD" | "GE" | "GF" | "GG" | "GH" | "GI" | "GL" | "GM" | "GN" | "GP" | "GQ" | "GR" | "GS"
    | "GT" | "GU" | "GW" | "GY" | "HK" | "HM" | "HN" | "HR" | "HU" | "ID" | "IE" | "IL" | "IM" | "IN"
    | "IO" | "IQ" | "IS" | "IT" | "JE" | "JM" | "JO" | "JP" | "KE" | "KG" | "KH" | "KI" | "KM" | "KN"
    | "KR" | "KW" | "KY" | "KZ" | "LA" | "LB" | "LC" | "LI" | "LK" | "LR" | "LS" | "LT" | "LU" | "LV"
    | "MA" | "MC" | "MD" | "ME" | "MF" | "MG" | "MH" | "MK" | "MN" | "MO" | "MP" | "MQ" | "MR" | "MS"
    | "MT" | "MU" | "MV" | "MW" | "MX" | "MY" | "MZ" | "NA" | "NC" | "NE" | "NF" | "NG" | "NL" | "NO"
    | "NP" | "NR" | "NU" | "NZ" | "OM" | "PA" | "PE" | "PF" | "PG" | "PH" | "PK" | "PL" | "PM" | "PN"
    | "PR" | "PS" | "PT" | "PW" | "PY" | "QA" | "RE" | "RO" | "RS" | "RW" | "SA" | "SB" | "SC" | "SE"
    | "SG" | "SH" | "SI" | "SJ" | "SK" | "SL" | "SM" | "SN" | "SR" | "ST" | "SV" | "SX" | "SZ" | "TC"
    | "TD" | "TF" | "TG" | "TH" | "TJ" | "TK" | "TL" | "TM" | "TN" | "TO" | "TR" | "TT" | "TV" | "TW"
    | "TZ" | "UA" | "UG" | "UM" | "US" | "UY" | "UZ" | "VA" | "VC" | "VG" | "VI" | "VN" | "VU" | "WF"
    | "WS" | "XK" | "YT" | "ZA" | "ZM";

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
    PaddleCurrencyCode,
    PaddleCountryCode
};