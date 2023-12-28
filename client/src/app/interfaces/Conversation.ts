import { Customer } from "./Customer";
import { CustomerService } from "./CustomerService";

export interface Conversation{
    id: number,
    customer: Customer,
    customerServiceModel: CustomerService,
    createdat:Date,
    updatedat:Date,
    interlocutor?:string
}