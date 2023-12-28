import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { User } from './interfaces/User';
import { UserResponse } from './interfaces/UserResponse';
import { UserObject } from './interfaces/UserObject';
import { Conversation } from './interfaces/Conversation';
import { Chat } from './interfaces/Chat';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatRequest } from './interfaces/ChatRequest';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    
    api_url:string ="http://localhost:8080/api";

    users!:User[];
    currentUser: UserObject | undefined //= {firstname:undefined, lastname:undefined,id:undefined,type:undefined,customerid:undefined, customerserviceid:undefined};
    userObject: User | undefined = {id: 0,firstname: "",lastname: "",email: "",password: "",birthdate: undefined,type: ""}
    displayLoggedUser:string="";
    conversations: Conversation[] | undefined = [];
    currentConversation!: Conversation;
    interlocutor:string | undefined="";
    chat: Chat[] | undefined = [];
    chatMessage: Chat | undefined;
    selectedChat:boolean=false;
    chatInput:string="";


    constructor(private http: HttpClient, public fb: FormBuilder){
      // get all users
      this.http.get<User[]>(this.api_url+"/user").subscribe((response: User[]) => {
        this.users=response;
      })
    }


  ngOnDestroy(): void {
    // UNSUBSCRIBE
    
  }

    selectUser(id:number): void{
      this.http.get<UserResponse>(`${this.api_url}/user/${id}`).subscribe((response: UserResponse) => {
        const userType=response.user.type;
        if(userType==="customer"){
          const userResponse = response.user
          const customer = response.customer
          const {id,firstname,lastname,email,password,birthdate,type,createdat,updatedat} = userResponse; 
          const {address,customerid} = customer;
          //this.userObject = new Customer(id,firstname,lastname,email,password,birthdate,type,customerid,user.id,address);
          this.currentUser={id,firstname,lastname,type,customerid};
          this.userObject={id,birthdate,email,firstname,lastname,password,type}
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_id:${customerid}`;
          this.findUserConversations(id);
        }else if(userType==="customer_service"){
          const userResponse = response.user
          const customerService = response.customerServiceModel
          const {id,firstname,lastname,email,password,birthdate,type,createdat,updatedat} = userResponse;
          const {customerserviceid,agency,userid} = customerService;
          this.currentUser={id,firstname,lastname,type,customerserviceid};
          this.userObject={id,birthdate,email,firstname,lastname,password,type}
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_service_id:${customerserviceid}`;
          //this.userObject = new CustomerService(id,firstname,lastname,email,password,birthdate,type,customerserviceid,userid,agency);
          this.findUserConversations(id)
        }
      })
      
      
    }

    findUserConversations(id:number | undefined):void{
      this.http.get<Conversation[]>(`${this.api_url}/conversations/${this.currentUser?.type}/${id}`).subscribe((conversations: Conversation[]) => {
        //console.log(conversations[0]);
        this.conversations=conversations.map((conversation) => {
          // get interlocutor name
          this.currentUser?.type == "customer" ?
            this.interlocutor= `${conversation.customerServiceModel.customerservice?.firstname} ${conversation.customerServiceModel.customerservice?.lastname}`
          : this.currentUser?.type == "customer_service" ? this.interlocutor= `${conversation.customer.customer?.firstname} ${conversation.customer.customer?.lastname}` : undefined;
          // get last chat message sent
          return conversation;
        })
      });
    }

    selectConversation(id:number): void{
      this.http.get<Conversation>(`${this.api_url}/conversations/${id}`).subscribe((conversation: Conversation) => {
        //console.log(conversation);
        this.currentConversation=conversation;
      })
      this.http.get<Chat[]>(`${this.api_url}/chat/${id}`).subscribe((messages: Chat[]) => {
        this.chat=messages;
        this.selectedChat=true
      })
    }
  
    change(event:any){
      this.chatInput=event.target.value
    }

    sendChatMessage():void{
      let request: ChatRequest = {
        conversationid: this.currentConversation.id,
        user: this.userObject,
        message: this.chatInput
      }
      console.log(request);
      
      this.http.post<Chat>(`${this.api_url}/chat`, request).subscribe((response: Chat) => {
        console.log(response);  
        this.chat=[...this.chat!,response]
      })
    }
}
