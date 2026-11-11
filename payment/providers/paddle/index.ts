

// Basic Provider Interface
import Providers from './../../providers';

// Interfaces
import ProductInterface from "./../../core/product";
import CustomerInterface from "./../../core/customer";


// Modules
import Product from './product';
import Customer from './customer';

interface Config {
    apiKey?: string;
    clientToken?: string;
    webHookSecret?: string;
    environment?: string;
}

export default class Paddle implements Providers {
    
    public product: ProductInterface = new Product();
    public customer: CustomerInterface = new Customer();

    constructor(config: Config) {
        
        let errors:any = [];
        let required:(keyof Config)[] = ["apiKey", "clientToken", "webHookSecret", "environment"];
        
        required.forEach(( key) => {
            if( ! config[key] ) {
                errors.push(key)
            }
        });

        if( errors.length) {
            throw new Error(`Paddle config missing: ${errors.join(", ")}`);
        }
        
    }



} 

