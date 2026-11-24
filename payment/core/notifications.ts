import {ResponseType} from "../helper/helper";

interface NotificationRetrieve {
    all(options: {}): Promise<ResponseType>;
}

interface NotificationById {
    findById(notification_id:string): Promise<ResponseType>;
}

interface NotificationReplay {
    replay(notification_id:string): Promise<ResponseType>;
}

export { 
    NotificationRetrieve,
    NotificationById,
    NotificationReplay
};