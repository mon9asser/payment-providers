 
import {ResponseType} from "../helper/helper";

interface PriceRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface PriceCreate {
    create(objectData: {}): Promise<ResponseType>;
}
interface PriceRetrieveById {
    findById(product_id:string, params:{}): Promise<ResponseType>;
}
interface PriceUpdate {
    update(product_id:string, objData: {}): Promise<ResponseType>;
}


export {
    PriceRetrieve,
    PriceCreate,
    PriceRetrieveById,
    PriceUpdate
}