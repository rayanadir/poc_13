import { Customer } from "./Customer";
import { CustomerService } from "./CustomerService";

export interface User{
    id: number,
    firstname: string,
    lastname:string,
    email:string,
    password:string,
    birthdate:Date | undefined,
    type:string,
    createdat?:Date,
    updatedat?:Date,
    customer?:Customer,
    customer_service?:CustomerService,
}