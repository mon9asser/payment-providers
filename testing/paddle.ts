import PaymentProvider from "../provider";


const provider = PaymentProvider.init("paddle", {
    apiKey: 'sdsd',
    clientToken: 'sdsd',
    webHookSecret: 'sdsd',
    environment: 'sdsd',
});

(async function(){

    const create = await provider.customer.create({
        email: "example@gmail.com",
        name: "Example Name"
    });  
    
})();