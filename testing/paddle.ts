import PaymentProvider from "../provider";

(async function(){
    
    const provider = PaymentProvider.init("paddle", {
        environment: "sandbox",
        credentials: {
            secretKey: "this is a new secreat"
        }
    });

    const all = await provider.customer.all();
    
    
})();