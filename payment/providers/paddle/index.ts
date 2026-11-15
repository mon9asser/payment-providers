import Adapter from "../../helper/adapter";
import PaddleCustomer from "./customer";

 

export default class Paddle {
    
    // Adapter
    private helper: Adapter; 

    // Modules
    public customers: PaddleCustomer;

    constructor( Resolver: Adapter ) { 
        
        this.helper = Resolver;  
        this.customers = new PaddleCustomer(this.helper);
        
    }
 

} 

