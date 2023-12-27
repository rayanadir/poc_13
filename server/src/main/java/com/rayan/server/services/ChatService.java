package com.rayan.server.services;

import com.rayan.server.models.Chat;
import com.rayan.server.models.Conversation;
import com.rayan.server.repositories.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    /**
     * Find all chat messages from a conversation
     */
    public List<Chat> findAllByConversation(Conversation conversation){
        return this.chatRepository.findByConversation(conversation);
    }

    /**
     * Send a new chat message
     */
    public Chat sendChatMessage(Chat chat){
        return this.chatRepository.save(chat);
    }

    /**
     * Get last chat conversation message sent
     */
    /*public Chat getLastChatConversationMessage(Long id){
        return this.chatRepository.findBy
    }*/
}
