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
import { CustomerServiceService } from './services/customer_service/customer-service.service';
import { ConversationsService } from './services/conversations/conversations.service';
import { ChatService } from './services/chat/chat.service';
import { WebsocketService } from './services/websocket/websocket.service';
import { WebSocketAPI } from './classes/WebSocketAPI';

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
    currentConversationId!: number;
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

    socket: any = null;
    stompClient: any= null;

    constructor(
      private usersService: UsersService,
      private customerServiceService: CustomerServiceService,
      private conversationsService: ConversationsService,
      private chatService: ChatService,
      //private webSocketService: WebsocketService,
      //private webSocketService: WebSocketAPI,
      ){
      
      // check if user saved in session storage
      this.userObject = JSON.parse(sessionStorage.getItem("userObject")!)
      this.customerObject = JSON.parse(sessionStorage.getItem("customerObject")!);
      this.customerServiceObject = JSON.parse(sessionStorage.getItem("customerServiceObject")!);
      this.loggedUser = JSON.parse(sessionStorage.getItem("loggedUser")!);
      if(this.userObject && this.loggedUser &&(this.customerObject || this.customerServiceObject)){
        this.selectUser(this.userObject?.id!);

      }
      this.currentConversation=JSON.parse(sessionStorage.getItem("currentConversation")!);
      if(this.currentConversation){
        this.selectConversation(this.currentConversation.id);
      } 
      
      // get all users
      this.usersSubscription = this.usersService.getAll().subscribe((response: User[]) => {
        this.users=response;
      })
    }


    connect(): void{ 
      this.socket = new SockJS("http://localhost:8080/socket");
      this.stompClient= Stomp.over(this.socket);
      this.stompClient.connect({},(frame:any) => {this.connectionSuccess()});
    }

    connectionSuccess(): void{
      this.getAllConversations(this.loggedUser?.type!,this.loggedUser?.type! ==="customer"? this.customerObject?.customerid! : this.customerServiceObject?.customerserviceid!);
      
      /*this.stompClient.subscribe(`/topic/all`, (callback:any) => {
        this.onGetAllConversations(callback.body);
      })*/
      
      // get all messages in a conversation
      this.stompClient.subscribe(`/topic/getMessages/${this.currentConversationId}`, (callback:any) => {
        this.onConversationAllMessagesSent(callback.body)
      })
      
      // get new message sent in a conversation
      this.stompClient.subscribe(`/topic/message_sent/${this.currentConversationId}`, (callback:any) => {
        this.onConversationNewMessageSent(callback.body)
      });
      
      // get single conversation selected
      this.stompClient.subscribe(`/topic/single_conversation/${this.currentConversationId}`, (callback:any) => {
        this.onGetConversation(callback.body);
      })

      // get all user conversations
      this.stompClient.subscribe(`/topic/get_all_conversations/${this.loggedUser?.type}/${this.customerObject?.customerid || this.customerServiceObject?.customerserviceid}`, (callback: any) => {
        console.log(callback);
        
        this.onGetAllConversations(callback.body);
      })

      // get all customer service users for customers in order to contact them
      this.stompClient.subscribe(`/topic/get_all_customer_service_users`, (callback: any) => {
        //console.log(callback);
        
        this.onGetAllCustomerServiceUsers(callback.body);
      })
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
      }else{
        console.log("error: no stomp client");
      }
    }

    onConversationAllMessagesSent(payload:any): void{
      const conversation: Chat[] = JSON.parse(payload);
      this.chat=conversation;
    }

    onConversationNewMessageSent(payload: any): void{
      const message: Chat = JSON.parse(payload);
      this.chat=[...this.chat!, message]
    }

    onGetConversation(payload:any): void{
      const conversation: Conversation = JSON.parse(payload);
      this.currentConversation=conversation;
      let interlocutor!:string;
      this.loggedUser?.type == "customer" ?
        interlocutor= `${this.currentConversation.customerServiceModel.customerservice?.firstname} ${this.currentConversation.customerServiceModel.customerservice?.lastname}`
        : this.loggedUser?.type == "customer_service" ? interlocutor= `${this.currentConversation.customer.customer?.firstname} ${this.currentConversation.customer.customer?.firstname}` : undefined;
      this.currentConversation.interlocutor=interlocutor;
      sessionStorage.setItem("currentConversation",JSON.stringify(this.currentConversation));
    }

    onGetAllConversations(payload: any): void{
      const conversations: Conversation[] = JSON.parse(payload);
      this.conversations=conversations;
      console.log(conversations);
      
    }

    onGetAllCustomerServiceUsers(payload:any): void{
      const customer_service_users: CustomerService[]= JSON.parse(payload);
      this.customerServiceUsers=customer_service_users;
      this.showCustomerServiceListUser=true;
      this.showConversationsList=false;
    }

    getAllConversations(type:string, id:number){
      if(this.socket && this.stompClient){
        console.log("appel 1");
        
        //const customerId=id
        const request = {customerId:id} // userid is customerid if customer or customerserviceid if customer service
        //this.stompClient.send(`/app/get_all_conversations/${type}/${request.userid}`, {}, JSON.stringify(request));
        //console.log(type);
        
        this.stompClient.send(`/app/get_all_conversations/${type}/${id}`, {}, JSON.stringify(request));
        //this.stompClient.send(`/app/all`)
      }else{
        console.log("error: no stomp client");
        
      }
    }
    
    selectCustomerServiceUserSocket(customer_service_user:CustomerService): void{
      if(this.stompClient){
        const customer= this.customerObject;
        const customer_service= customer_service_user;

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
          console.log("existing");
          
          this.selectConversationSocket(isExistingConversation.conversationid!);
        }else{
          const conversationRequest: ConversationRequest = {
            customerId: customer?.customerid,
            customerServiceModelId: customer_service.customerserviceid, 
          }
          this.createConversationSocket(conversationRequest);
        }
      }
    }

    createConversationSocket(conversationRequest: ConversationRequest): void{
      if(this.stompClient){
        this.stompClient.send(`/app/create_conversation`, {}, JSON.stringify(conversationRequest));
      }else{
        console.log("error: no stomp client");
      }
    }

    selectConversationSocket(id:number){
      if(this.socket && this.stompClient && this.currentConversationId){
        this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.stompClient.unsubscribe(`/topic/getMessages/${this.currentConversationId}`);
        this.stompClient.unsubscribe(`/topic/single_conversation/${this.currentConversationId}`)
      } 
      this.selectedChat=true;
      this.currentConversationId=id;
      this.stompClient.subscribe(`/topic/message_sent/${id}`, (callback:any) => {this.onConversationNewMessageSent(callback.body)});
      this.stompClient.subscribe(`/topic/getMessages/${id}`, (callback:any) => {this.onConversationAllMessagesSent(callback.body);});
      const request = {conversationId:id}
      this.stompClient.send(`/app/get_chat_messages/${id}`, {}, JSON.stringify(request))
    }

    getAllCustomerServiceUsers(){
      if(this.stompClient){
        this.stompClient.send(`/app/get_customer_service_users`);
      }else{
        console.log("error: no stomp client");
      }
      
    }


    ngOnInit(): void{

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
      if(this.stompClient!==null){
        this.stompClient.subscribe(`/topic/getMessages/${this.currentConversationId}`);
        this.stompClient.subscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.stompClient.subscribe(`/topic/single_conversation/${this.currentConversationId}`);
        this.stompClient.subscribe(`/topic/get_all_conversations/${this.loggedUser?.type}/${this.loggedUser?.customer?.customerid || this.loggedUser?.customer_service?.customerserviceid}`);
        this.stompClient.subscribe(`/topic/get_all_customer_service_users`);
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
    }

    cancel():void{
      this.showCustomerServiceListUser=false;
      this.showConversationsList=true;
    }

    back():void{
      if(this.stompClient){
        this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.stompClient.unsubscribe(`/topic/getMessages/${this.currentConversationId}`);
        this.stompClient.unsubscribe(`/topic/single_conversation/${this.currentConversationId}`)
      }
      this.currentConversationId!=undefined
      this.chat=undefined;
      this.selectedChat=false;
      sessionStorage.removeItem("currentConversation");
    }

    clearConversation():void{
      this.currentConversationId!=undefined;
      this.selectedChat=false; 
    }

    change(event:any):void{
      this.chatInput=event.target.value
    }








    /*getAllCustomerServiceUsers(): void{
      this.showCustomerServiceListUser=true;
      this.showConversationsList=false;
      this.allCustomerServiceUsers = this.customerServiceService.getAll().subscribe((customer_service_users: CustomerService[]) => {
        this.customerServiceUsers=customer_service_users;
      });
    }*/

    /*selectCustomerServiceUser(customer_service_user:CustomerService){
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
    }*/



    selectUser(id:number): void{
      this.userObject=undefined; this.customerObject=undefined; this.customerServiceObject=undefined, this.loggedUser=undefined;
      if(this.socket && this.stompClient){this.stompClient!.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);}
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
          //this.findUserConversations(id);
          //this.getAllConversations(this.loggedUser.type,this.customerObject.customerid);
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
          //this.findUserConversations(id);
          //this.getAllConversations(this.loggedUser.type, this.customerServiceObject.customerserviceid);
          sessionStorage.setItem("userObject", JSON.stringify(this.userObject));
          sessionStorage.setItem("customerServiceObject", JSON.stringify(this.customerServiceObject));
          sessionStorage.setItem("loggedUser", JSON.stringify(this.loggedUser));
          this.connect();
        }
        this.clearConversation();
      })
    }

    findUserConversations(id:number | undefined):void{
      const userid = this.loggedUser?.type ==="customer" ? this.loggedUser.customer?.customerid : this.loggedUser?.type ==="customer_service" ? this.loggedUser.customer_service?.customerserviceid : undefined;
      this.usersConversations = this.conversationsService.getAllConversations(id!).subscribe((conversations: Conversation[]) => {
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
      this.stompClient.unsubscribe(`/topic/message_sent/${this.currentConversationId}`);
        this.clearConversation();
        //this.connect();
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


    getConversationMessages(id:number | undefined):void{
      /*this.webSocketService.initWebSocket().then(() => {
        console.log("TEST 2");
        
        this.webSocketService.subscribe(`socket/get_chat_messages/${id!}`, (event) => {
          console.log(event.body);
          console.log("TEST 3");
          
          this.chat=event.body;
          this.selectedChat=true;
        })
      })*/



        /*this.getConversationMessagesSubscription = this.chatService.get(id!).subscribe((messages: Chat[]) => {
          this.chat=messages;
          this.selectedChat=true;
        })*/
      
    }

    createConversation(conversationRequest: ConversationRequest):void{
      this.clearConversation();
      this.createConversationSubscription = this.conversationsService.createConversation(conversationRequest).subscribe((conversation: Conversation) => {
        this.currentConversation=conversation;
        this.getConversationMessages(this.currentConversation.id)
      });
    }



    sendChatMessage():void{
      let request: ChatRequest = {
        conversationid: this.currentConversation?.id,
        user: this.userObject,
        message: this.chatInput
      };

      
      this.sendMessageSubscription = this.chatService.send(request).subscribe((response: Chat) => { 
        this.chat=[...this.chat!,response]
        this.chatInput="";
      })
    }
}
