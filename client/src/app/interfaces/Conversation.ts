import { Customer } from "./Customer";
import { CustomerService } from "./CustomerService";
import { User } from "./User";

export interface Conversation{
    id: number,
    customer: Customer,
    customerServiceModel: CustomerService,
    createdat:Date,
    updatedat:Date,
}