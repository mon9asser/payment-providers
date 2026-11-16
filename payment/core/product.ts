 
import {ResponseType} from "../helper/helper";

interface ProductRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface ProductCreate {
    create(objectData: {}): Promise<ResponseType>;
}
interface ProductRetrieveById {
    findById(product_id:string): Promise<ResponseType>;
}
interface ProductUpdate {
    update(product_id:string, objData: {}): Promise<ResponseType>;
}


export {
    ProductRetrieve,
    ProductCreate,
    ProductRetrieveById,
    ProductUpdate
}