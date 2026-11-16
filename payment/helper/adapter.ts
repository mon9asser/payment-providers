import { PaymentProviderConfig, ResponseType, RequestCache } from "./helper";
import Resolver from "./../config.json"; 
import Paddle from "./../providers/paddle/index";  
 

type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS';

export default class Adapter { 
    
    private config: PaymentProviderConfig; 
    private provider: string;
    private endpoint: string;
    private headers: Record<string, string> = {};

    constructor(provider:string, config: PaymentProviderConfig) {
        
        if (!config.environment) {
            throw new Error("Payment environment is required");
        }

        if (!config.credentials?.secretKey) {
            throw new Error("Payment secret key is required");
        }

        this.config = config; 
        this.provider = provider;
        this.endpoint = this.getEndpoint();

        this.headers = { 
            'Content-Type': 'application/json', 
        };
    } 

    private getEndpoint():string {
        return Resolver.api[this.provider as keyof typeof Resolver.api][this.config.environment]; 
    }
    

    public build() {
         
        switch(this.provider) {
            
            case 'paddle': { 

                // Set Headers 
                this.headers['Authorization'] = `Bearer ${this.config.credentials.secretKey}`;
                this.headers['Paddle-Version'] = '1';  

                // Paddle Provider 
                return new Paddle(this);

            }

            default:
                throw new Error(`Unsupported provider: ${this.provider}`);
        }
    }
    
    public async request<T = unknown>(
        api: string,
        method: HttpMethod = 'GET',
        body?: unknown,
        _headers: Record<string, string> = {},
        cache: RequestCache = "no-store"
    ): Promise<ResponseType<T>> {

        const headers: Record<string, string> = {
            ...this.headers,
            ..._headers
        };

        const uri = `${this.endpoint}${api}`;
        console.log(uri, body);
        
        try { 
            const response = await fetch(uri, {
                method,
                cache,
                headers,
                ...(
                    body !== undefined && method !== 'GET' && method !== 'HEAD'
                        ? { body: JSON.stringify(body) }
                        : {}
                )
            });

            const data = await response.json();
 
            if (!response.ok) {
                return {
                    isError: true,
                    message: `${this.provider.toUpperCase()} API Error ${response.status}`,
                    data
                };
            }

            return {
                isError: false,
                message: "Operation completed successfully",
                data
            };

        } catch (error) {

            return {
                isError: true,
                message: error instanceof Error ? error.message : "Something went wrong",
                data: null
            };

        }
    }
}