import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './interfaces/User';
import { UserResponse } from './interfaces/UserResponse';
import { Conversation } from './interfaces/Conversation';
import { Chat } from './interfaces/Chat';
import { ChatRequest } from './interfaces/ChatRequest';
import { CustomerService } from './interfaces/CustomerService';
import { ConversationRequest } from './interfaces/ConversationRequest';
import { Customer } from './interfaces/Customer';
import { Subscription } from 'rxjs';
import { UsersService } from './services/users/users.service';
import { ConversationsService } from './services/conversations/conversations.service';
import { ChatService } from './services/chat/chat.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {

    api_url:string ="http://localhost:8080/api";

    users!:User[];
    userObject: User | undefined; // User object without type
    customerObject: Customer | undefined = {customerid: 0,address: '',userid: 0}; // Only customer object
    customerServiceObject: CustomerService | undefined = {customerserviceid:0}; // Only customer service object
    loggedUser: User | undefined; // User + type object (Customer or CustomerService)
    
    displayLoggedUser:string="";
    conversations: Conversation[] | undefined = [];
    currentConversation: Conversation | undefined;
    currentConversationId!: number | undefined;
    chat: Chat[] | undefined = [];
    chatMessage: Chat | undefined;
    selectedChat:boolean=false;
    chatInput:string="";
    customerServiceUsers:CustomerService[]| undefined = [];
    showCustomerServiceListUser: boolean = false;
    showConversationsList: boolean = true;
    selectedCustomerServiceUser: CustomerService | undefined;

    usersSubscription!: Subscription;
    selectUserSubscription!: Subscription;
    usersConversations!: Subscription;
    selectConversationSubscription!: Subscription;
    getConversationMessagesSubscription!: Subscription;
    createConversationSubscription!: Subscription;

    socket: any = null;
    stompClient: any= null;

    getConversationLoading:boolean=true;
    sendMessageLoading:boolean=false;

    currentConversationSocketSubscription!: any;
    getAllCustomerServiceUsersSocketSubscription!: any;
    newConversationSubscription!: any;

    constructor(
      private usersService: UsersService,
      private conversationsService: ConversationsService,
      private chatService: ChatService,
      ){
      // check if user saved in session storage
      this.userObject = JSON.parse(sessionStorage.getItem("userObject")!)
      this.customerObject = JSON.parse(sessionStorage.getItem("customerObject")!);
      this.customerServiceObject = JSON.parse(sessionStorage.getItem("customerServiceObject")!);
      this.loggedUser = JSON.parse(sessionStorage.getItem("loggedUser")!);
      if(this.userObject && this.loggedUser &&(this.customerObject || this.customerServiceObject)){
        this.selectUser(this.userObject?.id!);
      }
      // get all users
      this.usersSubscription = this.usersService.getAll().subscribe((response: User[]) => {
        this.users=response;
      })
      this.currentConversationSocketSubscription?.unsubscribe();
      this.stompClient?.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
    }

    ngOnInit(): void{
      this.currentConversationSocketSubscription?.unsubscribe();
      this.stompClient?.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
    }

    ngOnDestroy(): void {
      // UNSUBSCRIBE
      this.usersSubscription.unsubscribe();
      this.selectUserSubscription.unsubscribe();
      this.usersConversations.unsubscribe();
      this.selectConversationSubscription.unsubscribe();
      this.getConversationMessagesSubscription.unsubscribe();
      this.createConversationSubscription.unsubscribe();
      this.currentConversationSocketSubscription?.unsubscribe();
      this.getAllCustomerServiceUsersSocketSubscription?.unsubscribe()
      this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
      this.stompClient.unsubscribe(`/user/${this.customerObject?.customerid}/get_all_customer_service_users`);
      this.stompClient.disconnect();
    }

    selectUser(id:number): void{
      this.userObject=undefined; this.customerObject=undefined; this.customerServiceObject=undefined, this.loggedUser=undefined;
      if(this.socket && this.stompClient){
        this.currentConversationSocketSubscription?.unsubscribe();
        this.stompClient!.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
      }
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
          this.connect()
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
          this.connect();
        }
        this.clearConversation();
      })
    }

    connect(): void{ 
      this.socket = new SockJS("http://localhost:8080/socket");
      this.stompClient= Stomp.over(this.socket);
      this.stompClient.connect({},(frame:any) => {this.connectionSuccess();});
    }

    connectionSuccess(): void{
      this.currentConversation=JSON.parse(sessionStorage.getItem("currentConversation")!);
      if(this.currentConversation){
        this.selectConversation(this.currentConversation.id);
      }
        
      this.newConversationSubscription = this.stompClient.subscribe(
        `/user/${this.customerObject?.customerid || this.customerServiceObject?.customerserviceid}/new_private_conversation/${this.loggedUser?.type}`, 
        (callback:any) => {
        this.onNewPrivateConversation(callback.body);
      },
      {id: `/new_conversation/${this.loggedUser?.type}/${this.customerObject?.customerid || this.customerServiceObject?.customerserviceid}`}
      )

    }

    onNewPrivateConversation(payload:any): void{
      let conversation: Conversation = JSON.parse(payload);
      if(this.loggedUser?.type==="customer"){
        let interlocutor=`${conversation.customerServiceModel.customerservice?.firstname} ${conversation.customerServiceModel.customerservice?.lastname}`;
        conversation = {...conversation,interlocutor}
        this.conversations=[conversation,...this.conversations!].sort((a,b) => {return new Date(b.updatedat).getTime() - new Date(a.updatedat).getTime()});;
        this.selectedChat=true;
        this.getConversationLoading=false;
        this.selectConversation(conversation.id);
      }else if(this.loggedUser?.type==="customer_service"){
        let interlocutor=`${conversation.customer.customer?.firstname} ${conversation.customer.customer?.lastname}`;
        conversation= {...conversation,interlocutor}
        this.conversations=[conversation,...this.conversations!];
      }
      //this.newConversationSubscription.unsubscribe();
    }

    onConversationNewMessageSent(payload: any): void{
      const message: Chat = JSON.parse(payload);
      this.chat=[...this.chat!, message];
      this.sendMessageLoading=false;
      this.scrollToBottom(200, "smooth");
      let conv = this.conversations?.filter((c) => c.id!==this.currentConversationId);
      this.conversations=[this.currentConversation!,...conv!];
    }

    onGetAllCustomerServiceUsers(payload:any): void{
      const customer_service_users: CustomerService[]= JSON.parse(payload);
      this.customerServiceUsers=customer_service_users;
      this.showConversationsList=false;
    }


    sendMessage(): void {
      if(this.stompClient){
        let request: ChatRequest = {
          conversationid: this.currentConversationId,
          user: this.userObject,
          message: this.chatInput
        };
        this.stompClient.send(`/app/sendMessage/${request.conversationid}`, {}, JSON.stringify(request));
        this.chatInput="";
        this.sendMessageLoading=true;
      }else{
        console.log("error: no stomp client");
      }
    }

    selectCustomerServiceUserSocket(customer_service_user:CustomerService): void{
      if(this.selectedCustomerServiceUser!==customer_service_user){
        if(this.stompClient){
          const customer= this.customerObject;
          const customer_service= customer_service_user;
          this.selectedCustomerServiceUser=customer_service;
          // Get all customer conversations and get all his customer service id's interlocutors
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
            this.selectConversation(isExistingConversation.conversationid!)
          }else{
            const conversationRequest: ConversationRequest = {
              customerId: customer?.customerid,
              customerServiceModelId: customer_service.customerserviceid, 
            }
            this.createConversationSocket(conversationRequest)
          }
        }
      }
    }

    selectConversation(id:number): void{
      if(this.currentConversationId!==id){
        this.currentConversationSocketSubscription?.unsubscribe();
        this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.clearConversation();
        this.selectedChat=true;
        this.currentConversationId=id;
        this.currentConversationSocketSubscription = this.stompClient.subscribe(
          `/topic/message_sent/${id}`,
          (callback:any) => {this.onConversationNewMessageSent(callback.body)},
          {id: `/topic/message_sent/${this.currentConversationId}`});
        this.getCurrentConversation(id);
        this.getConversationMessages(id);
      }
    }

    createConversationSocket(conversationRequest: ConversationRequest): void{
      if(this.stompClient){
        if(this.socket && this.currentConversationId){
          this.currentConversationSocketSubscription?.unsubscribe();
          this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
          this.currentConversationId=undefined;
          this.currentConversation=undefined;
          this.chat=undefined;
        } 
        this.stompClient.send(`/app/create_private_conversation`, {}, JSON.stringify(conversationRequest));
        
      }else{
        console.log("error: no stomp client");
      }
    }

    getAllCustomerServiceUsers(){
      this.showCustomerServiceListUser=true;
      this.getAllCustomerServiceUsersSocketSubscription = this.stompClient.subscribe(
        `/user/${this.customerObject?.customerid}/get_all_customer_service_users`,
        (callback: any) => {this.onGetAllCustomerServiceUsers(callback.body);},
        {id: `/user/${this.customerObject?.customerid}/get_all_customer_service_users`}
      )
      if(this.stompClient){
        const customerId = this.customerObject?.customerid;
        this.stompClient.send(`/app/get_all_customer_service_users`, {}, JSON.stringify(customerId));
      }else{
        console.log("error: no stomp client");
      }
    }

    findUserConversations(id:number | undefined):void{
      this.usersConversations = this.conversationsService.getAllConversations(id!).subscribe((conversations: Conversation[]) => {
        this.conversations=conversations.map((conversation) => {
          let interlocutor!:string;
          // get interlocutor name
          this.loggedUser?.type == "customer" ?
             interlocutor= `${conversation.customerServiceModel.customerservice?.firstname} ${conversation.customerServiceModel.customerservice?.lastname}`
          : this.loggedUser?.type == "customer_service" ? interlocutor= `${conversation.customer.customer?.firstname} ${conversation.customer.customer?.lastname}` : undefined;
          return {...conversation, interlocutor:interlocutor};
        }).sort((a,b) => {return new Date(b.updatedat).getTime() - new Date(a.updatedat).getTime()});
      });
    }

    

    getConversationMessages(id:number | undefined):void{
      this.getConversationMessagesSubscription = this.chatService.get(id!).subscribe((messages: Chat[]) => {
        this.chat=messages;
        this.selectedChat=true;
        this.getConversationLoading=false;
        this.scrollToBottom(1, "instant");
      })
    }

    getCurrentConversation(id:number):void{
      this.selectConversationSubscription = this.conversationsService.getConversation(id).subscribe((conversation: Conversation) => {
        this.currentConversation=conversation;
        this.currentConversationId=conversation.id;
        let interlocutor!:string;
        this.loggedUser?.type == "customer" ?
           interlocutor= `${this.currentConversation.customerServiceModel.customerservice?.firstname} ${this.currentConversation.customerServiceModel.customerservice?.lastname}`
        : this.loggedUser?.type == "customer_service" ? interlocutor= `${this.currentConversation.customer.customer?.firstname} ${this.currentConversation.customer.customer?.firstname}` : undefined;
        this.currentConversation.interlocutor=interlocutor;
        sessionStorage.setItem("currentConversation",JSON.stringify(this.currentConversation));
      })
    }

    logout(): void{
      if(this.stompClient!==null){
        this.currentConversationSocketSubscription?.unsubscribe();
        this.getAllCustomerServiceUsersSocketSubscription?.unsubscribe()
        this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.stompClient.unsubscribe(`/user/${this.customerObject?.customerid}/get_all_customer_service_users`);
        this.stompClient.disconnect();
      }
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
      this.currentConversationId=undefined;
      this.selectedCustomerServiceUser=undefined;
    }

    cancel():void{
      this.showConversationsList=true;
      this.selectedCustomerServiceUser=undefined;
      this.getAllCustomerServiceUsersSocketSubscription?.unsubscribe()
      //this.stompClient.unsubscribe(`/user/${this.customerObject?.customerid}/get_all_customer_service_users`);
      this.showCustomerServiceListUser=false;
    }

    back():void{
      if(this.socket && this.stompClient && this.currentConversationId){
        this.currentConversationSocketSubscription?.unsubscribe();
        this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        
      } 
      this.currentConversationId=undefined;
      this.currentConversation=undefined
      this.chat=undefined;
      this.selectedChat=false;
      sessionStorage.removeItem("currentConversation");
    }

    clearConversation():void{
      this.currentConversationId!=undefined;
      this.selectedChat=false; 
      this.currentConversation=undefined;
    }

    change(event:any):void{
      this.chatInput=event.target.value
    }


    convertDateToString(date:Date | undefined):string | undefined{
      return date?.toString().replace("T", ", ").slice(0,20);
    }

    scrollToBottom(time:number, behavior:"smooth"|"instant"): void{
      setTimeout(() => {  
        const messages_list = document.getElementById("messages_list");
        const messages_list_height = messages_list?.scrollHeight!;
        messages_list?.scroll({top: messages_list_height,behavior})
      },time);
    }
}
