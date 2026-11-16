import Adapter from "../../helper/adapter";
import PaddleAccount from "./account";
import PaddleCustomer from "./customer";
import PaddleProduct from "./product";


 

export default class Paddle {
    
    // Adapter
    private adapter: Adapter; 

    // Modules
    public customer: PaddleCustomer;
    public account: PaddleAccount;
    public product: PaddleProduct;

    constructor( Resolver: Adapter ) { 
        
        this.adapter = Resolver;  
        this.customer = new PaddleCustomer(this.adapter);
        this.account = new PaddleAccount(this.adapter);
        this.product = new PaddleProduct(this.adapter);
        
    }
 

} 

