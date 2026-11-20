import Adapter from "../../helper/adapter";
import PaddleAccount from "./account";
import PaddleCustomer from "./customer";
import PaddleProduct from "./product";
import PaddlePrice from "./price";
import PaddleDiscount from "./discount";
import PaddleDiscountGroups from "./discount.groups";
import PaddleTransaction from "./transaction";
 



export default class Paddle {
    
    // Adapter
    private adapter: Adapter; 

    // Modules
    public customer: PaddleCustomer;
    public account: PaddleAccount;
    public product: PaddleProduct;
    public price: PaddlePrice;
    public discount: PaddleDiscount;
    public discountGroups: PaddleDiscountGroups;
    public transaction: PaddleTransaction;

    constructor( Resolver: Adapter ) { 
        
        this.adapter = Resolver;  
        this.customer = new PaddleCustomer(this.adapter);
        this.account = new PaddleAccount(this.adapter);
        this.product = new PaddleProduct(this.adapter);
        this.price = new PaddlePrice(this.adapter);
        this.discount = new PaddleDiscount(this.adapter);
        this.discountGroups= new PaddleDiscountGroups(this.adapter);
        this.transaction = new PaddleTransaction(this.adapter);
    }
 

} 

