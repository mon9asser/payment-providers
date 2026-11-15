import {ResponseType} from "../helper/helper";

interface RetrieveAccount {
    list(): Promise<ResponseType>;
}

interface UpdateAccount {
    update(email:string): Promise<ResponseType>;
}

export {
    RetrieveAccount,
    UpdateAccount
}