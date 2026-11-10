
import Providers from './../../providers';
import Product from './product';
import ProductInterface from "./../../core/product";

export default class Paddle implements Providers {
    
    public product: ProductInterface = new Product();
    
    constructor(config:object) {
        
    }


} 