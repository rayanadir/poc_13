import { User } from "./User";

export interface ChatRequest{
    conversationid:number | undefined,
    user:User|undefined,
    message:string,
}