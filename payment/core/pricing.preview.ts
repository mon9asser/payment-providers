

import {ResponseType} from "../helper/helper";

interface PricingPreviewCreate {
    create(objectData: {}): Promise<ResponseType>;
}

export { PricingPreviewCreate }