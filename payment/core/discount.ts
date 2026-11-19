 
import {ResponseType} from "../helper/helper";

interface DiscountRetrieve {
    all(options: {}): Promise<ResponseType>;
}

interface DiscountCreate {
    create(objectData: {}): Promise<ResponseType>;
}

interface DiscountRetrieveById {
    findById(product_id:string, params:{}): Promise<ResponseType>;
}

interface DiscountUpdate {
    update(product_id:string, objData: {}): Promise<ResponseType>;
}


export {
    DiscountRetrieve,
    DiscountCreate,
    DiscountRetrieveById,
    DiscountUpdate
}