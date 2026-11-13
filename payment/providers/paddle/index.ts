

// Basic Provider Interface
import Providers from './../../providers';
import config from './../../config.json';

// Interfaces
import ProductInterface from "./../../core/product";

 

// Modules
import Product from './product';
import Customer from './customer';

interface Config {
    apiKey?: string;
    clientToken?: string;
    webHookSecret?: string;
    environment?: string;
}

// ================ Types



// ================ Paddle Class 

export default class Paddle implements Providers {
    
    public product: ProductInterface = new Product();
    public customer = new Customer();

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

