
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

     const all = await provider.account.list()
    /*const create = await provider.customers.create({
        email: "tareq@gmail.com",
        name: "Ahmed Tarek",
        custom_data: {
            potential_customer_id: "test-123-payment-provider"
        }
    });*/

    console.log(all);
    
    
})();