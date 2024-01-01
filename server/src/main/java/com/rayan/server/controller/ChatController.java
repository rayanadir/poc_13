package com.rayan.server.controller;

import com.rayan.server.models.Chat;
import com.rayan.server.models.Conversation;
import com.rayan.server.payload.request.NewChatRequest;
import com.rayan.server.services.ChatService;
import com.rayan.server.services.ConversationService;
import com.rayan.server.services.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private WebSocketService webSocketService;


    @GetMapping("/{id}")
    public ResponseEntity<?> getChatMessages(@PathVariable Long id){
        Conversation conversation = this.conversationService.findConversationById(id);
        List<Chat> chatList = this.chatService.findAllByConversation(conversation);
        return ResponseEntity.ok().body(chatList);
    }

    @PostMapping()
    public ResponseEntity<?> sendChatMessageHttp(@RequestBody NewChatRequest request){
        Conversation conversation = this.conversationService.findConversationById(request.getConversationid());
        Chat chat = new Chat(conversation,request.getUser(), request.getMessage(), LocalDateTime.now(), LocalDateTime.now());
        this.chatService.sendChatMessage(chat);
        return ResponseEntity.ok().body(chat);
    }

    @MessageMapping("/get_chat_messages/{conversationId}")
    @SendTo("/topic/getMessages/{conversationId}")
    public List<Chat> getChatMessagesSocket(@Payload @DestinationVariable Long conversationId){
        Conversation conversation = this.conversationService.findConversationById(conversationId);
        List<Chat> messages = this.chatService.findAllByConversation(conversation);
        return messages;
    }

    @MessageMapping("/sendMessage/{conversationId}")
    @SendTo("/topic/message_sent/{conversationId}")
    public Chat sendChatMessageSocket(@Payload Chat messageRequest,@DestinationVariable Long conversationId){
        Conversation conversation = this.conversationService.findConversationById(conversationId);
        Chat chat = new Chat(conversation,messageRequest.getUser(), messageRequest.getMessage(), LocalDateTime.now(), LocalDateTime.now());
        this.chatService.sendChatMessage(chat);
        return chat;
    }



}
