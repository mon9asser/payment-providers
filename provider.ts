
import Adapter from "./payment/helper/adapter";
import {PaymentProviderConfig} from "./payment/helper/helper";

type ProviderTypes = "paddle";

export default class PaymentProvider { 
    static init(provider:ProviderTypes, config: PaymentProviderConfig) {
        const adapter = new Adapter(provider, config);
        return adapter.build();
    } 
}


 


