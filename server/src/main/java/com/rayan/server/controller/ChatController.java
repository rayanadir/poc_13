package com.rayan.server.controller;

import com.rayan.server.models.Chat;
import com.rayan.server.models.Conversation;
import com.rayan.server.payload.request.NewChatRequest;
import com.rayan.server.services.ChatService;
import com.rayan.server.services.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ConversationService conversationService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getChatMessages(@PathVariable Long id){
        Conversation conversation = this.conversationService.findConversationById(id);
        List<Chat> chatList = this.chatService.findAllByConversation(conversation);
        return ResponseEntity.ok().body(chatList);
    }

    @PostMapping()
    public ResponseEntity<?> sendChatMessage(@RequestBody NewChatRequest request){
        Conversation conversation = this.conversationService.findConversationById(request.getConversationid());
        Chat chat = new Chat(conversation,request.getUser(), request.getMessage(), LocalDateTime.now(), LocalDateTime.now());
        this.chatService.sendChatMessage(chat);
        return ResponseEntity.ok().body(chat);
    }
}
