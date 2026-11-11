import Paddle from "./payment/providers/paddle";


class PaymentProvider {
    static init(provider:string, config: object) {
        
        switch (provider) {
            case "paddle":
                return new Paddle(config);

            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }

    }
}


try {
    const payment = PaymentProvider.init('paddle', {api: '..'});
payment.product.create()
} catch (error:any) {
    console.log(error.message);
    
}