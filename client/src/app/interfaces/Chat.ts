import { Conversation } from "./Conversation";
import { User } from "./User";

export interface Chat{
    id?:number,
    conversation:Conversation,
    user:User,
    message:string,
    createdat?:Date,
    updatedat?:Date,
}