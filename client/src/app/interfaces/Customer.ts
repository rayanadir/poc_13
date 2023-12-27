import { User } from "./User";

export interface Customer{
    customerid:number,
    address: string,
    userid: number,
    customer?:User
}