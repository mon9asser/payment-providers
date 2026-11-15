
import {
    RetrieveAccount,
    UpdateAccount
} from "../../core/account";
import Adapter from "../../helper/adapter";
import {ResponseType} from "./../../helper/helper";

export default class PaddleAccount 
    implements 
        RetrieveAccount,
        UpdateAccount 
{
    
    private adapter;
    private uri: string = "/account";

    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    public async list(): Promise<ResponseType> {
        const api = `${this.uri}`;
        return await this.adapter.request(api);
    }

    public async update(email:string): Promise<ResponseType> {
        const api = `${this.uri}`;
        return await this.adapter.request(api, "PATCH", {email});
    }

}


