import Paddle from "./payment/providers/paddle";


interface PaddleConfig {
    apiKey: string;
    clientToken: string;
    webHookSecret: string;
    environment: string;
}

interface ProviderConfig {
    paddle: PaddleConfig;
}

export default class PaymentProvider {

    static init<P extends keyof ProviderConfig>(provider:string, config: Partial<ProviderConfig[P]>) {
        
        switch (provider) {

            case "paddle": {
                
                const required: (keyof PaddleConfig)[] = [
                    "apiKey",
                    "clientToken",
                    "webHookSecret",
                    "environment",
                ];

                const missing = required.filter((key) => !config[key]); 
                
                if (missing.length) {
                    throw new Error(`Paddle config missing: ${missing.join(", ")}`);
                } 

                return new Paddle(config as PaddleConfig);
            }

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

    }

    
}


 


