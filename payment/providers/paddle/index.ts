import Adapter from "../../helper/adapter";
import PaddleCustomer from "./customer";


 



export default class Paddle {
    
    private helper: Adapter; 

    public customer: PaddleCustomer;

    constructor( Resolver: Adapter ) { 
        
        this.helper = Resolver; 
        
        this.customer = new PaddleCustomer(this.helper);

    }



} 

