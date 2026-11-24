import {ResponseType} from "../helper/helper";

interface EventTypesRetrieve {
    all(options: {}): Promise<ResponseType>;
}

export { 
    EventTypesRetrieve
};