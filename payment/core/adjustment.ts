 
import {ResponseType} from "../helper/helper";

interface AdjustmentsRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface AdjustmentsCreate {
    create(objectData: {}): Promise<ResponseType>;
}
interface AdjustmentsCreditNote {
    creditNote(adjustment_id:string, params:{}): Promise<ResponseType>;
}
 

export {
    AdjustmentsRetrieve,
    AdjustmentsCreate,
    AdjustmentsCreditNote
}