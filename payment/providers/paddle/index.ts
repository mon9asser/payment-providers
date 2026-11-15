import Adapter from "../../helper/adapter";
import PaddleAccount from "./account";
import PaddleCustomer from "./customer";

 

export default class Paddle {
    
    // Adapter
    private adapter: Adapter; 

    // Modules
    public customers: PaddleCustomer;
    public account: PaddleAccount;
    constructor( Resolver: Adapter ) { 
        
        this.adapter = Resolver;  
        this.customers = new PaddleCustomer(this.adapter);
        this.account = new PaddleAccount(this.adapter)
        
    }
 

} 

