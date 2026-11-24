import {ResponseType} from "../helper/helper";

interface EventRetrieve {
    all(options: {}): Promise<ResponseType>;
}

export { 
    EventRetrieve
};