import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { User } from './interfaces/User';
import { UserResponse } from './interfaces/UserResponse';
import { UserObject } from './interfaces/UserObject';
import { Conversation } from './interfaces/Conversation';
import { Chat } from './interfaces/Chat';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    
    api_url:string ="http://localhost:8080/api";

    users!:User[];
    user: UserObject = {firstname:"", lastname:"",id:undefined,type:"",customerid:undefined, customerserviceid:undefined};
    displayLoggedUser:string="";
    conversations: Conversation[] | undefined = [];
    currentConversation!: Conversation;
    interlocutor:string | undefined="";
    chat: Chat[] | undefined = [];
    chatMessage: Chat | undefined;
    selectedChat:boolean=false;

    form = this.fb.group({
      chatInput: [
        '',
        [Validators.required]
      ]
    })

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
          this.user={id,firstname,lastname,type,customerid}
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_id:${customerid}`;
          this.findUserConversations(id);
        }else if(userType==="customer_service"){
          const userResponse = response.user
          const customerService = response.customerServiceModel
          const {id,firstname,lastname,email,password,birthdate,type,createdat,updatedat} = userResponse;
          const {customerserviceid,agency,userid} = customerService;
          this.user={id,firstname,lastname,type,customerserviceid}
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_service_id:${customerserviceid}`;
          //this.userObject = new CustomerService(id,firstname,lastname,email,password,birthdate,type,customerserviceid,userid,agency);
          this.findUserConversations(id)
        }
      })
      
      
    }

    findUserConversations(id:number):void{
      this.http.get<Conversation[]>(`${this.api_url}/conversations/${this.user.type}/${id}`).subscribe((conversations: Conversation[]) => {
        //console.log(conversations[0]);
        this.conversations=conversations.map((conversation) => {
          // get interlocutor name
          this.user.type == "customer" ?
            this.interlocutor= `${conversation.customerServiceModel.customerservice?.firstname} ${conversation.customerServiceModel.customerservice?.lastname}`
          : this.user.type == "customer_service" ? this.interlocutor= `${conversation.customer.customer?.firstname} ${conversation.customer.customer?.lastname}` : undefined;
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

    getUser(id:number){

    }

    sendChatMessage(/*id:Number, messageRequest:Chat*/):void{
      console.log(this.currentConversation);
      
      /*this.http.post(`${this.api_url}`, messageRequest).subscribe((response) => {
        console.log(response);
        
      })*/
    }
}
