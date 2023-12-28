import { User } from "./User";

export interface ChatRequest{
    conversationid:number,
    user:User|undefined,
    message:string,
}