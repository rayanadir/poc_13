import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { User } from './interfaces/User';
import { UserResponse } from './interfaces/UserResponse';
import { Conversation } from './interfaces/Conversation';
import { Chat } from './interfaces/Chat';
import { FormBuilder } from '@angular/forms';
import { ChatRequest } from './interfaces/ChatRequest';
import { CustomerService } from './interfaces/CustomerService';
import { ConversationRequest } from './interfaces/ConversationRequest';
import { Customer } from './interfaces/Customer';
import { Subscription } from 'rxjs';
import { UsersService } from './services/users/users.service';
import { CustomerServiceService } from './services/customer_service/customer-service.service';
import { ConversationsService } from './services/conversations/conversations.service';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    
    api_url:string ="http://localhost:8080/api";

    users!:User[];
    userObject: User | undefined; // User object without type
    customerObject: Customer | undefined = {customerid: 0,address: '',userid: 0}; // Only customer object
    customerServiceObject: CustomerService | undefined = {customerserviceid:0}; // Only customer service object
    loggedUser: User | undefined; // User + type object (Customer or CustomerService)
    
    displayLoggedUser:string="";
    conversations: Conversation[] | undefined = [];
    currentConversation: Conversation | undefined;
    chat: Chat[] | undefined = [];
    chatMessage: Chat | undefined;
    selectedChat:boolean=false;
    chatInput:string="";
    customerServiceUsers:CustomerService[]| undefined = [];
    showCustomerServiceListUser: boolean = false;
    showConversationsList: boolean = true;

    usersSubscription!: Subscription;
    allCustomerServiceUsers!: Subscription;
    selectUserSubscription!: Subscription;
    usersConversations!: Subscription;
    selectConversationSubscription!: Subscription;
    getConversationMessagesSubscription!: Subscription;
    createConversationSubscription!: Subscription;
    sendMessageSubscription!: Subscription;

    constructor(
      private usersService: UsersService,
      private customerServiceService: CustomerServiceService,
      private conversationsService: ConversationsService,
      private chatService: ChatService,
      ){
      
      // check if user saved in session storage
      this.userObject = JSON.parse(sessionStorage.getItem("userObject")!)
      this.customerObject = JSON.parse(sessionStorage.getItem("customerObject")!);
      this.customerServiceObject = JSON.parse(sessionStorage.getItem("customerServiceObject")!);
      this.loggedUser = JSON.parse(sessionStorage.getItem("loggedUser")!);
      if(this.userObject && this.loggedUser &&(this.customerObject || this.customerServiceObject))this.selectUser(this.userObject?.id!)
      this.currentConversation=JSON.parse(sessionStorage.getItem("currentConversation")!);
      if(this.currentConversation){
        this.selectConversation(this.currentConversation.id);
      } 
      
      // get all users
      this.usersSubscription = this.usersService.getAll().subscribe((response: User[]) => {
        this.users=response;
      })
    }


    ngOnDestroy(): void {
      // UNSUBSCRIBE
      this.usersSubscription.unsubscribe();
      this.allCustomerServiceUsers.unsubscribe();
      this.selectUserSubscription.unsubscribe();
      this.usersConversations.unsubscribe();
      this.selectConversationSubscription.unsubscribe();
      this.getConversationMessagesSubscription.unsubscribe();
      this.createConversationSubscription.unsubscribe();
      this.sendMessageSubscription.unsubscribe();
    }

    logout(): void{
      sessionStorage.removeItem("userObject");
      sessionStorage.removeItem("customerObject");
      sessionStorage.removeItem("customerServiceObject");
      sessionStorage.removeItem("loggedUser");
      sessionStorage.removeItem("currentConversation")
      this.userObject=undefined; 
      this.customerObject=undefined; 
      this.customerServiceObject=undefined; 
      this.loggedUser=undefined;
      this.conversations=undefined;
      this.currentConversation=undefined
      this.chat=undefined;
      this.customerServiceUsers=undefined;
      this.selectedChat=false;
      this.displayLoggedUser="";
    }

    getAllCustomerServiceUsers(): void{
      this.showCustomerServiceListUser=true;
      this.showConversationsList=false;
      this.allCustomerServiceUsers = this.customerServiceService.getAll().subscribe((customer_service_users: CustomerService[]) => {
        this.customerServiceUsers=customer_service_users;
      });
    }

    selectCustomerServiceUser(customer_service_user:CustomerService){
      const customer= this.customerObject;
      const customer_service= customer_service_user;
      // Get all customer conversations and get his customer service id's interlocutor
      const conversationsCustomerServiceId = this.conversations?.map((conversation) => {
        const conversationObj = {
          conversationid:conversation.id,
          customerserviceid: conversation.customerServiceModel.customerserviceid,
          customerid: conversation.customer.customerid
        }
        return conversationObj;
      });
      // check if a conversation contains customer_id & customer_service_id, check if conversation exists
      const isExistingConversation = conversationsCustomerServiceId?.find((conv) => conv.customerserviceid==customer_service.customerserviceid && conv.customerid==customer?.customerid);
      
      if(isExistingConversation){
        this.selectConversation(isExistingConversation.conversationid!);
      }else{
        const conversationRequest: ConversationRequest = {
          customerId: customer?.customerid,
          customerServiceModelId: customer_service.customerserviceid, 
        }
        this.createConversation(conversationRequest);
      }
    }

    cancel():void{
      this.showCustomerServiceListUser=false;
      this.showConversationsList=true;
    }

    selectUser(id:number): void{
      this.userObject=undefined; this.customerObject=undefined; this.customerServiceObject=undefined, this.loggedUser=undefined
      this.selectUserSubscription = this.usersService.get(id).subscribe((response: UserResponse) => {
        const userType=response.user.type;
        if(userType==="customer"){
          const userResponse = response.user
          const customer = response.customer
          const {id,firstname,lastname,email,password,birthdate,type,createdat,updatedat} = userResponse; 
          const {address,customerid} = customer;
          this.userObject={id,birthdate,email,firstname,lastname,password,type};
          this.customerObject={address,customerid,customer:this.userObject};
          this.loggedUser={birthdate,email,firstname,id,lastname,password,type,customer}
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_id:${customerid}`;
          this.findUserConversations(id);
          sessionStorage.setItem("userObject", JSON.stringify(this.userObject));
          sessionStorage.setItem("customerObject", JSON.stringify(this.customerObject));
          sessionStorage.setItem("loggedUser", JSON.stringify(this.loggedUser));
        }else if(userType==="customer_service"){
          const userResponse = response.user
          const customerService = response.customerServiceModel
          const {id,firstname,lastname,email,password,birthdate,type,createdat,updatedat} = userResponse;
          const {customerserviceid,agency,userid} = customerService;
          this.userObject={id,birthdate,email,firstname,lastname,password,type};
          this.customerServiceObject={customerserviceid,agency,userid};
          this.loggedUser={birthdate,email,firstname,id,lastname,password,type,customer_service: customerService};
          this.displayLoggedUser=`${firstname} ${lastname}, id: ${id}, type:${type}, customer_service_id:${customerserviceid}`;
          this.findUserConversations(id);
          sessionStorage.setItem("userObject", JSON.stringify(this.userObject));
          sessionStorage.setItem("customerServiceObject", JSON.stringify(this.customerServiceObject));
          sessionStorage.setItem("loggedUser", JSON.stringify(this.loggedUser));
        }
        this.clearConversation();
      })
      
      
    }

    findUserConversations(id:number | undefined):void{
      this.usersConversations = this.conversationsService.getAllByCustomer(id!).subscribe((conversations: Conversation[]) => {
        this.conversations=conversations.map((conversation) => {
          let interlocutor!:string;
          // get interlocutor name
          this.loggedUser?.type == "customer" ?
             interlocutor= `${conversation.customerServiceModel.customerservice?.firstname} ${conversation.customerServiceModel.customerservice?.lastname}`
          : this.loggedUser?.type == "customer_service" ? interlocutor= `${conversation.customer.customer?.firstname} ${conversation.customer.customer?.lastname}` : undefined;
          return {...conversation, interlocutor:interlocutor};
        })
      });
    }

    selectConversation(id:number): void{
        this.clearConversation();
        this.selectConversationSubscription = this.conversationsService.getConversation(id).subscribe((conversation: Conversation) => {
          this.currentConversation=conversation;
          let interlocutor!:string;
          this.loggedUser?.type == "customer" ?
             interlocutor= `${this.currentConversation.customerServiceModel.customerservice?.firstname} ${this.currentConversation.customerServiceModel.customerservice?.lastname}`
          : this.loggedUser?.type == "customer_service" ? interlocutor= `${this.currentConversation.customer.customer?.firstname} ${this.currentConversation.customer.customer?.firstname}` : undefined;
          this.currentConversation.interlocutor=interlocutor;
          sessionStorage.setItem("currentConversation",JSON.stringify(this.currentConversation));
        })
        this.getConversationMessages(id);
    }

    back():void{
      this.currentConversation=undefined
      this.chat=undefined;
      this.selectedChat=false;
      sessionStorage.removeItem("currentConversation")
    }

    getConversationMessages(id:number | undefined):void{
      this.getConversationMessagesSubscription = this.chatService.get(id!).subscribe((messages: Chat[]) => {
        this.chat=messages;
        this.selectedChat=true;
      })
    }

    createConversation(conversationRequest: ConversationRequest):void{
      this.clearConversation();
      this.createConversationSubscription = this.conversationsService.createConversation(conversationRequest).subscribe((conversation: Conversation) => {
        this.currentConversation=conversation;
        this.getConversationMessages(this.currentConversation.id)
      });
    }

    clearConversation():void{
        this.currentConversation=undefined;
        this.selectedChat=false; 
    }
  
    change(event:any):void{
      this.chatInput=event.target.value
    }

    sendChatMessage():void{
      let request: ChatRequest = {
        conversationid: this.currentConversation?.id,
        user: this.userObject,
        message: this.chatInput
      }
      this.sendMessageSubscription = this.chatService.send(request).subscribe((response: Chat) => { 
        this.chat=[...this.chat!,response]
        this.chatInput="";
      })
    }
}
