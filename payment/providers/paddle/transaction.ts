import {
    TransactionRetrieve,
    TransactionCreate,
    TransactionRetrieveById,
    TransactionUpdate,
    TransactionPreview,
    TransactionInvoice,
    TransactionRevise,
} from "../../core/transaction";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode, PaddleCountryCode} from "./../../helper/helper";


type DateTimeFilter = string;

type FilterOperator = 
    | "[LT]"
    | "[LTE]"
    | "[GT]"
    | "[GTE]";

type TransactionStatusCreate =
    | "draft"
    | "ready"
    | "billed"
    | "paid"
    | "completed"
    | "canceled"
    | "past_due";

 
type TransactionInclude =
    | "address"
    | "adjustments"
    | "adjustments_totals"
    | "available_payment_methods"
    | "business"
    | "customer"
    | "discount";

type TransactionOrigin =
    | "api"
    | "subscription_charge"
    | "subscription_payment_method_change"
    | "subscription_recurring"
    | "subscription_update"
    | "subscription_import"
    | "web";

type TransactionStatus =
    | "draft"
    | "ready"
    | "billed"
    | "paid"
    | "completed"
    | "canceled"
    | "past_due";

type CollectionMode =
    | "automatic"
    | "manual";

type TransactionOrderBy =
    | "billed_at[ASC]"
    | "billed_at[DESC]"
    | "created_at[ASC]"
    | "created_at[DESC]"
    | "id[ASC]"
    | "id[DESC]"
    | "updated_at[ASC]"
    | "updated_at[DESC]";

type TimeInterval = "day" | "week" | "month" | "year";
interface Duration {
    interval: TimeInterval; 
    frequency: number;
}

type TaxCategory =
    | "digital-goods"
    | "ebooks"
    | "implementation-services"
    | "professional-services"
    | "saas"
    | "software-programming-services"
    | "standard"
    | "training-services"
    | "website-hosting";
export type BillingInterval = "day" | "week" | "month" | "year";
type TaxMode = "account_setting" | "external" | "internal" | "location";
interface TransactionListParams {
    include?: TransactionInclude[];
    id?: string[];
    after?: string;

    billed_at?: DateTimeFilter;
    created_at?: DateTimeFilter;
    updated_at?: DateTimeFilter;

    collection_mode?: CollectionMode;

    customer_id?: string[];
    invoice_number?: string[];
    origin?: TransactionOrigin[];

    order_by?: TransactionOrderBy;
    status?: TransactionStatus[];

    subscription_id?: string[] | null;

    per_page?: number;
}

interface TransactionQueryParams {
    include?: TransactionInclude[];
}


type CustomData = Record<string, unknown>;

interface BillingDetailsType {
  [key: string]: unknown;
}

export type DiscountType =
  | "flat"
  | "flat_per_seat"
  | "percentage";

interface DiscountTypeObject {
  description: string;
  type: DiscountType;
  amount: string;
  recur?: boolean;
  maximum_recurring_intervals?: number | null;
  custom_data?: CustomData | null;
  restrict_to?: string[] | null;
}
interface PaymentTermsType {
  interval: BillingInterval;
  frequency: number;
}

interface BillingPeriodType {
  starts_at: string;
  ends_at: string;
}
export interface ProductType {
  name: string;
  description?: string | null;
  tax_category: TaxCategory;
  image_url?: string | null;
  custom_data?: CustomData | null;
}

interface AllowanceType {
  usage_balance_unit_id: string;
  amount: string;
}
interface QuantityType {
  minimum: number;
  maximum: number;
}

interface UnitPriceType {
  amount: string;
  currency_code: PaddleCurrencyCode;
}


interface UnitPriceOverrideType {
  country_codes: string[];
  unit_price: UnitPriceType;
}
interface BillingIntervalType {
  interval: BillingInterval;
  frequency: number;
}

export interface PriceType {
  description: string;
  name?: string | null;
  billing_cycle?: BillingIntervalType | null;
  trial_period?: BillingIntervalType | null;
  requires_payment_method?: boolean;
  unit_price?: UnitPriceType | null;
  unit_price_overrides?: UnitPriceOverrideType[];
  tax_mode?: TaxMode;
  quantity?: QuantityType;
  allowances?: AllowanceType[];
  custom_data?: CustomData | null;
  product_id?: string;
  product?: ProductType;
}

interface NewProductItemType {
  quantity: number;
  price: PriceType & {
    product: ProductType;
  };
}

interface ExistingProductItemType {
  quantity: number;
  price: PriceType & {
    product_id: string;
  };
}

interface CatalogItemType {
  quantity: number;
  price_id: string;
}


type TransactionItemType =
  | CatalogItemType
  | ExistingProductItemType
  | NewProductItemType;

interface CheckoutType {
  url?: string | null;
}

interface CreateTransactionType {
  status?: TransactionStatus;
  customer_id?: string | null;
  address_id?: string | null;
  business_id?: string | null;
  custom_data?: CustomData | null;
  currency_code?: PaddleCurrencyCode | null;
  collection_mode?: CollectionMode;
  discount_id?: string | null;
  discount?: DiscountTypeObject | null;
  billing_details?: BillingDetailsType | null;
  enable_checkout?: boolean;
  purchase_order_number?: string;
  additional_information?: string | null;
  payment_terms?: PaymentTermsType;
  billing_period?: BillingPeriodType | null;
  items: TransactionItemType[];
  checkout?: CheckoutType | null;
}


type UpdateTransactionStatus = "billed" | "canceled";

 
interface DiscountTypeObject {
    description: string;
    type: DiscountType;
    amount: string;
    currency_code?: PaddleCurrencyCode;
    recur?: boolean;
    maximum_recurring_intervals?: number | null;
    custom_data?: CustomData | null;
    restrict_to?: string[] | null;
}

interface UpdateTransactionType {
    status?: UpdateTransactionStatus;
    customer_id?: string | null;
    address_id?: string | null;
    business_id?: string | null;
    custom_data?: CustomData | null;
    currency_code?: PaddleCurrencyCode | null;
    collection_mode?: CollectionMode;
    discount_id?: string | null;
    discount?: DiscountTypeObject | null;
    billing_details?: BillingDetailsType | null;
    purchase_order_number?: string;
    additional_information?: string | null;
    payment_terms?: PaymentTermsType;
    billing_period?: BillingPeriodType | null;
    items?: TransactionItemType[];
    checkout?: CheckoutType | null;
}



interface PreviewCatalogItemType {
    quantity: number;
    price_id: string;
    include_in_totals?: boolean;
}

interface PreviewExistingProductItemType {
    quantity: number;
    price: PriceType & {
        product_id: string;
    };
    include_in_totals?: boolean;
}

interface PreviewNewProductItemType {
    quantity: number;
    price: PriceType & {
        product: ProductType;
    };
    include_in_totals?: boolean;
}

type PreviewTransactionItemType =
    | PreviewCatalogItemType
    | PreviewExistingProductItemType
    | PreviewNewProductItemType;

interface PreviewTransactionType {
    customer_id?: string | null;
    currency_code?: PaddleCurrencyCode | null;

    // Location information
    customer_ip_address?: string;
    address?: Record<string, unknown> | null;
    address_id?: string | null;
    business_id?: string | null;

    // Discount
    discount_id?: string | null;
    discount?: DiscountTypeObject | null;

    // Preview options
    ignore_trials?: boolean;

    // Items
    items: PreviewTransactionItemType[];
}

type PDFDisposition = "attachment" | "inline";

interface TransactionPDFQueryParams {
    disposition?: PDFDisposition;
}



interface ReviseCustomerType {
    name: string;
}

interface ReviseBusinessType {
    name: string;
    tax_identifier?: string;
}

interface ReviseAddressType {
    first_line: string;
    second_line?: string | null;
    city: string;
    region: string;
}

export interface ReviseTransactionType {
    customer?: ReviseCustomerType;
    business?: ReviseBusinessType;
    address?: ReviseAddressType;
}


class PaddleTransaction 
    implements 
            TransactionRetrieve,
            TransactionCreate,
            TransactionRetrieveById,
            TransactionUpdate,
            TransactionPreview,
            TransactionInvoice,
            TransactionRevise
{

    private adapter;
    private uri: string = "/transactions";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(queryParam: TransactionListParams = {}): Promise<ResponseType> {
        
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof TransactionListParams)[]).forEach((key, index) => {
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

    async create(objectData: CreateTransactionType, queryParam: TransactionQueryParams = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof TransactionQueryParams)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}`;
        if( param != '') {
            api = `${api}?${param}`;
        }

        return await this.adapter.request(api, "POST", objectData);
    }

    async findById(transaction_id:string, included: TransactionQueryParams = {}): Promise<ResponseType> {
        const params = new URLSearchParams();

        if (included.include?.length) {
            params.set('include', included.include.join(','));
        }

        const query = params.toString();
        const api = `${this.uri}/${transaction_id}${query ? `?${query}` : ''}`;


        return await this.adapter.request(api);
    }
    
    async update(transaction_id:string, objData: UpdateTransactionType = {}, included: TransactionQueryParams = {}): Promise<ResponseType> {
        
        const params = new URLSearchParams();

        if (included.include?.length) {
            params.set('include', included.include.join(','));
        }

        const query = params.toString();
        const api = `${this.uri}/${transaction_id}${query ? `?${query}` : ''}`;
        
        return await this.adapter.request(api, "PATCH", objData);
    }

    async preview( objectData: PreviewTransactionType ): Promise<ResponseType> {
        
        let api = `${this.uri}/preview`;  
        return await this.adapter.request(api, "POST", objectData);

    }

    async invoice(transaction_id:string, queryParam: TransactionPDFQueryParams = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof TransactionPDFQueryParams)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}/${transaction_id}/invoice`;
        if( param != '') {
            api = `${api}?${param}`;
        }

        return await this.adapter.request(api);
    }

    async revise(transaction_id:string, dataObject: ReviseTransactionType = {}): Promise<ResponseType> {
        
        let api = `${this.uri}/${transaction_id}/revise`; 
        return await this.adapter.request(api, "POST", dataObject);
    }

}
