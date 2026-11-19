 
import {ResponseType} from "../helper/helper";

interface DiscountGroupRetrieve {
    all(options: {}): Promise<ResponseType>;
}

interface DiscountGroupCreate {
    create(objectData: {}): Promise<ResponseType>;
}

interface DiscountGroupRetrieveById {
    findById(product_id:string): Promise<ResponseType>;
}

interface DiscountGroupUpdate {
    update(product_id:string, objData: {}): Promise<ResponseType>;
}


export {
    DiscountGroupRetrieve,
    DiscountGroupCreate,
    DiscountGroupRetrieveById,
    DiscountGroupUpdate
}