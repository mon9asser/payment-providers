import {
    PricingPreviewCreate
} from "../../core/pricing.preview";

import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode, PaddleCountryCode} from "./../../helper/helper";


interface PricingPreviewAddress {
    postal_code?: string | null;
    country_code: string;
}

interface PricingPreviewItem {
    price_id: string;
    quantity: number; // Minimum: 1
}

interface PricingPreviewRequest {
    customer_id?: string | null;
    address_id?: string | null;
    business_id?: string | null;
    currency_code?: PaddleCurrencyCode | null;
    discount_id?: string | null;
    address?: PricingPreviewAddress | null;
    customer_ip_address?: string | null;
    items: PricingPreviewItem[];
}

export default class PaddlePreviewPricing
    implements 
        PricingPreviewCreate
{
    private adapter;
    private uri: string = "/pricing-preview";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async create(bodyRequest: PricingPreviewRequest): Promise<ResponseType> {
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", bodyRequest);
    }
}