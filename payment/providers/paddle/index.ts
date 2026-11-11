

// Basic Provider Interface
import Providers from './../../providers';

// Interfaces
import ProductInterface from "./../../core/product";

// Modules
import Product from './product';

interface Config {
    apiKey?: string;
    clientToken?: string;
    webHookSecret?: string;
    env?: string;
}

export default class Paddle implements Providers {
    
    public product: ProductInterface = new Product();
    
    constructor(config: Config) {
        
        let errors:any = [];
        let required:(keyof Config)[] = ["apiKey", "clientToken", "webHookSecret", "env"];
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

