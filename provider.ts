
import Adapter from "./payment/helper/adapter";
import {PaymentProviderConfig} from "./payment/helper/helper";

export default class PaymentProvider { 
    static init(provider:string, config: PaymentProviderConfig) {
        const adapter = new Adapter(provider, config);
        return adapter.build();
    } 
}


 


