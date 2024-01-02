package com.rayan.server.services;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.repositories.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    public Conversation createConversation(Conversation conversation){
        return this.conversationRepository.save(conversation);
    }

    public Conversation updateConversation(Long id, Conversation conversation){
        conversation.setId(id);
        return this.conversationRepository.save(conversation);
    }

    public Conversation findConversationById(Long id){
        return this.conversationRepository.findById(id).orElse(null);
    }

    /**
     * Find all conversations while logged as customer
     */
    public List<Conversation> findAllConversationsCustomer(Customer customer){
        return this.conversationRepository.findByCustomer(customer);
    }

    /**
     * Find all conversations while logged as customer service user
     */
    public List<Conversation> findAllConversationsCustomerService(CustomerServiceModel customerServiceModel){
        return this.conversationRepository.findByCustomerServiceModel(customerServiceModel);
    }
}
