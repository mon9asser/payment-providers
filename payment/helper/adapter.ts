import { PaymentProviderConfig } from "./helper";
import Resolver from "./../config.json"; 

import Paddle from "./../providers/paddle/index";  

export default class Adapter { 
    
    private config: PaymentProviderConfig; 
    private provider: string;

    constructor(provider:string, config: PaymentProviderConfig) {
        
        if (!config.environment) {
            throw new Error("Payment environment is required");
        }

        if (!config.credentials?.secretKey) {
            throw new Error("Payment secret key is required");
        }

        this.config = config; 
        this.provider = provider;

    } 

    public build() {
        switch(this.provider) {
            
            case 'paddle': {
                return new Paddle(this);
            }

            default:
                throw new Error(`Unsupported provider: ${this.provider}`);
        }
    }
    
    public request() {
        console.log(this.provider);
        return this.provider;
    }
}