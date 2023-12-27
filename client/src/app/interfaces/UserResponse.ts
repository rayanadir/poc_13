import { Customer } from "./Customer";
import { CustomerService } from "./CustomerService";
import { User } from "./User";

export interface UserResponse{
    user: User,
    customer: Customer,
    customerServiceModel: CustomerService,
}