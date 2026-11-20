 
import {ResponseType} from "../helper/helper";

interface TransactionRetrieve {
    all(options: {}): Promise<ResponseType>;
}
interface TransactionCreate {
    create(objectData: {},params: {}): Promise<ResponseType>;
}
interface TransactionRetrieveById {
    findById(product_id:string, params:{}): Promise<ResponseType>;
}
interface TransactionUpdate {
    update(product_id:string, objData: {}, queryParam: {}): Promise<ResponseType>;
}

interface TransactionPreview {
    preview( objectData: {} ): Promise<ResponseType>;
}
interface TransactionInvoice {
    invoice(transaction_id:string, queryParam : {}): Promise<ResponseType>
}

interface TransactionRevise {
    revise(transaction_id:string, dataObject: {}): Promise<ResponseType>
}

export {
    TransactionRetrieve,
    TransactionCreate,
    TransactionRetrieveById,
    TransactionUpdate,
    TransactionPreview,
    TransactionInvoice,
    TransactionRevise,
}