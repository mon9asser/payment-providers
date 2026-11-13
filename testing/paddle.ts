import PaymentProvider from "../provider";


const provider = PaymentProvider.init("paddle", {
    apiKey: 'sdsd',
    clientToken: 'sdsd',
    webHookSecret: 'sdsd',
    environment: 'sdsd',
});

(async function(){

    const all = await provider.customer.all();
    console.log(all);
    
})();