import {
    PriceRetrieve,
    PriceCreate,
    PriceRetrieveById,
    PriceUpdate
} from "../../core/price";

import Adapter from "../../helper/adapter";
import {ResponseType} from "./../../helper/helper";


type BillingInterval = "day" | "week" | "month" | "year";

type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "JPY" | "AUD"
  | "CAD" | "CHF" | "HKD" | "SGD" | "SEK"
  | "ARS" | "BRL" | "CLP" | "CNY" | "COP"
  | "CZK" | "DKK" | "HUF" | "ILS" | "INR"
  | "KRW" | "MXN" | "NOK" | "NZD" | "PEN"
  | "PLN" | "RUB" | "THB" | "TRY" | "TWD"
  | "UAH" | "VND" | "ZAR";

type PriceType = "custom" | "standard";

type TaxMode =
  | "account_setting"
  | "external"
  | "internal"
  | "location";

type PriceStatus = "active" | "archived";

interface BillingCycle {
  interval: BillingInterval;
  frequency: number;
}

interface TrialPeriod {
  interval: BillingInterval;
  frequency: number;
}

interface UnitPrice {
  amount: string;
  currency_code: CurrencyCode;
}

interface UnitPriceOverride {
  country_codes: string[];
  unit_price: UnitPrice;
}

interface Allowance {
  usage_balance_unit_id: string;
  amount: string;
}

interface PriceQuantity {
  minimum: number;
  maximum: number;
}

interface CreatePriceDataQuerType {
  product_id: string;
  description: string;
  type?: PriceType;
  name?: string | null;
  billing_cycle?: BillingCycle | null;
  trial_period?: TrialPeriod | null;
  requires_payment_method?: boolean;
  unit_price?: UnitPrice | null;
  unit_price_overrides?: UnitPriceOverride[];
  tax_mode?: TaxMode;
  allowances?: Allowance[];
  quantity?: PriceQuantity;
  status?: PriceStatus;
  custom_data?: Record<string, unknown> | null;
}


type PriceSortOrder = "ASC" | "DESC";

type PriceOrderBy =
  | `id[${PriceSortOrder}]`
  | `product_id[${PriceSortOrder}]`
  | `quantity.maximum[${PriceSortOrder}]`
  | `quantity.minimum[${PriceSortOrder}]`
  | `status[${PriceSortOrder}]`
  | `tax_mode[${PriceSortOrder}]`
  | `unit_price.amount[${PriceSortOrder}]`
  | `unit_price.currency_code[${PriceSortOrder}]`;
  
 

interface PriceListQueryParamType {
  order_by?: PriceOrderBy[];
  product_id?: string[];
  status?: PriceStatus[];
  recurring?: boolean;
  "billing_cycle.interval"?: BillingInterval;
  "billing_cycle.frequency"?: number;
  type?: PriceType;
}

interface UpdatePriceDataType {
    description?: string;
    type?: PriceType;
    name?: string | null;
    billing_cycle?: BillingCycle | null;
    trial_period?: TrialPeriod | null;
    requires_payment_method?: boolean;
    unit_price?: UnitPrice;
    unit_price_overrides?: UnitPriceOverride[];
    tax_mode?: TaxMode;
    allowances?: Allowance[];
    quantity?: PriceQuantity;
    status?: PriceStatus;
    custom_data?: Record<string, unknown> | null;
}

interface PriceGetQueryParamType {
    include?: ('product')[];
}

export default class PaddlePrice 
    implements 
        PriceRetrieve,
        PriceCreate,
        PriceRetrieveById,
        PriceUpdate
{
    private adapter;
    private uri: string = "/prices";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(queryParam: PriceListQueryParamType = {}): Promise<ResponseType> {

        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof PriceListQueryParamType)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}`;
        if( param != '') {
            api = `${api}?${param}`;
        }
 
        return await this.adapter.request(api);

    }

    async create(objectData: CreatePriceDataQuerType): Promise<ResponseType>{
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objectData);
    }

    async findById(price_id:string, included:PriceGetQueryParamType = {}): Promise<ResponseType>{

        const params = new URLSearchParams();

        if (included.include?.length) {
            params.set('include', included.include.join(','));
        }

        const query = params.toString();
        const api = `${this.uri}/${price_id}${query ? `?${query}` : ''}`;


        return await this.adapter.request(api);
    }

    async update(price_id:string, objData: UpdatePriceDataType): Promise<ResponseType>{
         let api = `${this.uri}/${price_id}`;
        return await this.adapter.request(api, "PATCH", objData);
    }

}
