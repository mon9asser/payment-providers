
import PaymentProvider from "../provider";
import dotenv from 'dotenv';
dotenv.config();

(async function(){
    
  

    const secretKey = process.env.API_KEY;
    const publicKey = process.env.PUBLIC_KEY;
    const environment = process.env.ENV;

    if( !secretKey || !publicKey || !environment) {
        throw new Error("API_KEY is missing in .env");
    }

    if (environment !== "live" && environment !== "sandbox") {
        throw new Error('ENV must be "live" or "sandbox"');
    }

    const provider = PaymentProvider.init("paddle", {
        environment: environment,
        credentials: {
            secretKey,
            publicKey
        }
    }); 

    const discounts = await provider.discount.findById("dsc_01m7tee93n625xn0f9epmpb8s4")

   
    /* 
    dsc_01m7tee93n625xn0f9epmpb8s4
    id: 'pri_01m7qy05mv8fe1ckqhd33s9gq2',
    product_id: 'pro_01m7jkng1sp5f1pv4appxb6kkz',

    pro_01m7jkng1sp5f1pv4appxb6kkz
    biz_01m7hkbhfwkn3fn4v0qz3e2xc7
    findAddressById("ctm_01m7fwjk63t59b6ate5wfdvd1a", "add_01m7g7he7ng8wzjmwc07sw2858")
    const create = await provider.customers.create({
        email: "tareq@gmail.com",
        name: "Ahmed Tarek",
        custom_data: {
            potential_customer_id: "test-123-payment-provider"
        }
    });*/

    console.log(discounts); 
    
    
})();