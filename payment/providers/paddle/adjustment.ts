
import {
    AdjustmentsRetrieve,
    AdjustmentsCreate,
    AdjustmentsCreditNote
} from "./../../core/adjustment"
import Adapter from "../../helper/adapter";
import {ResponseType, PaddleCurrencyCode} from "./../../helper/helper";


type AdjustmentAction =
    | "credit"
    | "refund"
    | "chargeback"
    | "chargeback_reverse"
    | "chargeback_warning"
    | "chargeback_warning_reverse"
    | "credit_reverse";

type AdjustmentStatus =
    | "pending_approval"
    | "approved"
    | "rejected"
    | "reversed";

type AdjustmentOrderBy =
    | "id[ASC]"
    | "id[DESC]";

interface AdjustmentQueryParams {
    id?: string[];
    after?: string;
    action?: AdjustmentAction[];
    customer_id?: string[];
    order_by?: AdjustmentOrderBy;
    per_page?: number; // Default: 10, Maximum: 50
    status?: AdjustmentStatus[];
    subscription_id?: string[];
    transaction_id?: string[];
}
 

type AdjustmentType = "full" | "partial";

type AdjustmentTaxMode = "external" | "internal";

type AdjustmentItemType =
    | "full"
    | "partial"
    | "tax"
    | "proration";

interface AdjustmentItem {
    item_id: string;
    type: AdjustmentItemType;
    amount?: string | null;
}

interface CreateAdjustmentRequest {
    action: AdjustmentAction;
    type?: AdjustmentType; // Default: partial
    tax_mode?: AdjustmentTaxMode; // Default: internal
    transaction_id: string;
    reason: string;
    items?: AdjustmentItem[] | null;
}

type AdjustmentPdfDisposition = "attachment" | "inline";

interface AdjustmentPdfQueryParams {
    disposition?: AdjustmentPdfDisposition; // Default: attachment
}
export default class PaddleAdjustment 
    implements 
        AdjustmentsRetrieve,
        AdjustmentsCreate,
        AdjustmentsCreditNote
{
    
    private adapter;
    private uri: string = "/adjustments";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    async all(queryParqams: AdjustmentQueryParams = {}): Promise<ResponseType> {
        let param = '';
        const keys = Object.keys(queryParqams);
        ( keys as (keyof AdjustmentQueryParams)[]).forEach((key, index) => {
            param += `${key}=${queryParqams[key]}`
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

    async create(objectData: CreateAdjustmentRequest): Promise<ResponseType> {
        let api = `${this.uri}`;
        return await this.adapter.request(api, "POST", objectData);
    }

    async creditNote(adjustment_id:string, queryParams:AdjustmentPdfQueryParams = {}): Promise<ResponseType>{
        

        let param = '';
        const keys = Object.keys(queryParams);
        ( keys as (keyof AdjustmentPdfQueryParams)[]).forEach((key, index) => {
            param += `${key}=${queryParams[key]}`
            if( index !=  (keys.length - 1) ) {
                param +='&';
            }
        });

        let api = `${this.uri}/${adjustment_id}/credit-note`;
        if( param != '') {
            api = `${api}?${param}`;
        }
        return await this.adapter.request(api);
    }

}