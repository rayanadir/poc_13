export interface UserObject{
    firstname:string,
    lastname:string,
    id:number | undefined, 
    type:string,
    customerid?:number | undefined,
    customerserviceid?:number | undefined,
}