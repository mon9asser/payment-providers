
import ProductInterface from "./../../core/product";

export default class PaddleProduct implements ProductInterface {
    
    public create():void {
        console.log(`This is a create function inside paddle`);
    }

}


