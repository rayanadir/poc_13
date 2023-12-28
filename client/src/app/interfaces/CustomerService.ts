import { Agency } from "./Agency";
import { User } from "./User";

export interface CustomerService{
    customerserviceid: number,
    agency?:Agency,
    userid?:number,
    customerservice?: User
}