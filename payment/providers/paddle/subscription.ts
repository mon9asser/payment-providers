import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode, PaddleCountryCode} from "../../helper/helper";
import {
    SubscriptionRetrieve,
    SubscriptionUpdatePaymentMethodTransaction,
    SubscriptionUpdate,
    SubscriptionRetrieveById
} from "./../../core/subscription";



type ListSubscriptionsParams = {
  id?: string[];
  after?: string;
  per_page?: number;
  address_id?: string[];
  collection_mode?: 'automatic' | 'manual';
  customer_id?: string[];
  order_by?: 'id[ASC]' | 'id[DESC]';
  price_id?: string[];
  scheduled_change_action?: (
    | 'cancel'
    | 'pause'
    | 'resume'
    | 'none'
  )[];
  next_billed_at?: (string | null)[];
  status?: (
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'paused'
    | 'trialing'
  )[];
};

type GetSubscriptionParams = {
  include?: (
    | 'next_transaction'
    | 'recurring_transaction_details'
  )[];
};


type UpdateSubscriptionRequest = {
  customer_id?: string;
  address_id?: string;
  business_id?: string | null;
  currency_code?: PaddleCurrencyCode;
  next_billed_at?: string;

  discount?: SubscriptionDiscount | null;

  collection_mode?: 'automatic' | 'manual';

  billing_details?: BillingDetails | null;

  scheduled_change?: null;

  items?: UpdateSubscriptionItem[];

  proration_billing_mode?:
    | 'prorated_immediately'
    | 'prorated_next_billing_period'
    | 'full_immediately'
    | 'full_next_billing_period'
    | 'do_not_bill';

  on_payment_failure?: 'prevent_change' | 'apply_change';
};

type SubscriptionDiscount = {
  id: string;
  effective_from: 'next_billing_period' | 'immediately';
};

type BillingDetails = {
  enable_checkout?: boolean;
  purchase_order_number?: string;
  additional_information?: string | null;
  payment_terms: PaymentTerms;
};

type PaymentTerms = {
  interval: 'day' | 'week' | 'month' | 'year';
  frequency: number;
};

type UpdateSubscriptionItem = {
  price_id: string;
  quantity?: number;
  custom_data?: Record<string, unknown> | null;
};

type ActivateSubscriptionRequest = {
  effective_from?: 'next_billing_period' | 'immediately' | null;
};

type CreateOneTimeChargeRequest = {
  effective_from: 'next_billing_period' | 'immediately';

  items: CreateOneTimeChargeItem[];

  on_payment_failure?: 'prevent_change' | 'apply_change';
};

type CreateOneTimeChargeItem = {
  quantity: number;
  price_id: string;
};

type PauseSubscriptionRequest = {
  effective_from?: 'next_billing_period' | 'immediately' | null;

  resume_at?: string | null;

  on_resume?:
    | 'continue_existing_billing_period'
    | 'start_new_billing_period';
};


type ResumeSubscriptionRequest = {
  effective_from?: string | null;
  on_resume?:
    | 'continue_existing_billing_period'
    | 'start_new_billing_period';
};




type PreviewSubscriptionUpdateRequest = {
  customer_id?: string;
  address_id?: string;
  business_id?: string | null;
  currency_code?: PaddleCurrencyCode;
  next_billed_at?: string;

  discount?: {
    id: string;
    effective_from: 'next_billing_period' | 'immediately';
  } | null;

  collection_mode?: 'automatic' | 'manual';

  billing_details?: {
    enable_checkout?: boolean;
    purchase_order_number?: string;
    additional_information?: string | null;
    payment_terms: {
      interval: 'day' | 'week' | 'month' | 'year';
      frequency: number;
    };
  } | null;

  scheduled_change?: null;

  items?: PreviewSubscriptionItem[];

  custom_data?: Record<string, unknown> | null;

  proration_billing_mode?:
    | 'prorated_immediately'
    | 'prorated_next_billing_period'
    | 'full_immediately'
    | 'full_next_billing_period'
    | 'do_not_bill';

  on_payment_failure?: 'prevent_change' | 'apply_change';
};

type PreviewSubscriptionItem =
  | {
      price_id: string;
      quantity?: number;
    }
  | {
      quantity: number;
      price: NonCatalogPrice;
    }
  | {
      quantity: number;
      price: NonCatalogPrice;
      product: NonCatalogProduct;
    };

type NonCatalogPrice = {
  description: string;
  name?: string | null;
  billing_cycle: BillingCycle | null;
  trial_period?: TrialPeriod | null;
  requires_payment_method?: boolean;
  unit_price?: UnitPrice | null;
  unit_price_overrides?: UnitPriceOverride[];
  tax_mode?: 'account_setting' | 'external' | 'internal' | 'location';
  quantity?: {
    minimum: number;
    maximum: number;
  };
  allowances?: PriceAllowance[];
  custom_data?: Record<string, unknown> | null;
  product_id?: string;
};

type BillingCycle = {
  interval: 'day' | 'week' | 'month' | 'year';
  frequency: number;
};

type TrialPeriod = {
  interval: 'day' | 'week' | 'month' | 'year';
  frequency: number;
};

type UnitPrice = {
  amount: string;
  currency_code: PaddleCurrencyCode;
};

type UnitPriceOverride = {
  country_codes: PaddleCountryCode[];
  unit_price: UnitPrice;
};

type PriceAllowance = {
  usage_balance_unit_id: string;
  amount: string;
};

type NonCatalogProduct = {
  name: string;
  description?: string | null;
  tax_category:
    | 'digital-goods'
    | 'ebooks'
    | 'implementation-services'
    | 'professional-services'
    | 'saas';
  image_url?: string | null;
  custom_data?: Record<string, unknown> | null;
};



//

type SubscriptionChargeRequest = { 
  effective_from: 'next_billing_period' | 'immediately';
 
  items: SubscriptionChargeItem[];
 
  on_payment_failure?: 'prevent_change' | 'apply_change';
};

type SubscriptionChargeItem =
  | ChargeCatalogItem
  | ChargeExistingProductItem
  | ChargeNonCatalogProductItem;

/** Existing catalog price. */
type ChargeCatalogItem = {
  quantity: number;          // min 1
  price_id: string;          // ^pri_[a-z\d]{26}$
};

/** Non-catalog price for an existing catalog product. */
type ChargeExistingProductItem = {
  quantity: number;
  price: ChargePrice & {
    product_id: string;      // ^pro_[a-z\d]{26}$
  };
};

/** Non-catalog price and non-catalog product. */
type ChargeNonCatalogProductItem = {
  quantity: number;
  price: ChargePrice;
  product: ChargeProduct;
};

type ChargePrice = {
  description: string;       // 2-200 chars, internal only
  name?: string | null;      // 1-50 chars, shown to customers
  tax_mode?: 'account_setting' | 'external' | 'internal' | 'location';
  unit_price: ChargeUnitPrice;
  unit_price_overrides?: ChargeUnitPriceOverride[];
  quantity?: ChargeQuantityLimits;
  custom_data?: Record<string, unknown> | null;
};

type ChargeUnitPrice = {
  /** Lowest denomination as an integer string, e.g. 10 USD = "1000". */
  amount: string;
  /** ISO 4217 code, e.g. "USD". */
  currency_code: string;
};

type ChargeUnitPriceOverride = {
  /** ISO 3166-1 alpha-2 codes, min 1, unique. */
  country_codes: string[];
  unit_price: ChargeUnitPrice;
};

type ChargeQuantityLimits = {
  minimum: number;           // 1-999999999
  maximum: number;           // 1-999999999, >= minimum
};

type ChargeProduct = {
  name: string;              // 1-200 chars
  description?: string | null; // max 2048 chars
  tax_category:
    | 'digital-goods'
    | 'ebooks'
    | 'implementation-services'
    | 'professional-services'
    | 'saas';
  image_url?: string | null;
  custom_data?: Record<string, unknown> | null;
};


export default class PaddleSubscription 
    implements 
        SubscriptionRetrieve,
        SubscriptionUpdatePaymentMethodTransaction,
        SubscriptionUpdate,
        SubscriptionRetrieveById
{

    private adapter;
    private uri: string = "/subscriptions";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(queryParam: ListSubscriptionsParams = {}):Promise<ResponseType> {

        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof ListSubscriptionsParams)[]).forEach((key, index) => {
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

    async findById(subscription_id:string, queryParam: GetSubscriptionParams = {}):Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParam);
        ( keys as (keyof GetSubscriptionParams)[]).forEach((key, index) => {
            param += `${key}=${queryParam[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}/${subscription_id}`;
        if( param != '') {
            api = `${api}?${param}`;
        }

        return await this.adapter.request(api);
    }

    async update(subscription_id:string, dataObject: UpdateSubscriptionRequest): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}`;
        return await this.adapter.request(api, "PATCH", dataObject);
    }

    async updatePaymentMethodTransaction(subscription_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/update-payment-method-transaction`;
        return await this.adapter.request(api);
    }

    async activateSubscription(subscription_id:string): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/activate`;
        return await this.adapter.request(api, "POST");
    }

    async cancelSubscription(subscription_id:string, reqBody: ActivateSubscriptionRequest = {}): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/cancel`;
        return await this.adapter.request(api, "POST", reqBody);
    }

    async createOneTimeCharge(subscription_id:string, reqBody: CreateOneTimeChargeRequest ): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/charge`;
        return await this.adapter.request(api, "POST", reqBody);
    }

    async pauseSubscription(subscription_id:string, reqBody: PauseSubscriptionRequest ): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/pause`;
        return await this.adapter.request(api, "POST", reqBody);
    }

    async resumeSubscription(subscription_id:string, reqBody: ResumeSubscriptionRequest ): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/resume`;
        return await this.adapter.request(api, "POST", reqBody);
    }

    async previewUpdate(subscription_id:string, reqBody: PreviewSubscriptionUpdateRequest): Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/preview`;
        return await this.adapter.request(api, "PATCH", reqBody);
    }

    async previewOneTimeCharge(subscription_id:string, reqBody: SubscriptionChargeRequest) : Promise<ResponseType> {
        let api = `${this.uri}/${subscription_id}/charge/preview`;
        return await this.adapter.request(api, "POST", reqBody);
    }

}