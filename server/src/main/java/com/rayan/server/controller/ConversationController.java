package com.rayan.server.controller;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import com.rayan.server.payload.request.NewConversationRequest;
import com.rayan.server.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {
    @Autowired
    private ConversationService conversationService;

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerServiceService customerServiceService;

    @Autowired
    private SimpMessagingTemplate template;


    /**
     * Get all user conversations by its id
     * @param id
     * @return
     */
    @GetMapping("/all/{id}")
    public ResponseEntity<?> getAllConversationsHttp(@PathVariable("id") Long id){
        User user = this.userService.findUserById(id);
        if(user.getType().equals("customer")){
            Customer customer = this.customerService.findCustomerByUser(user);
            List<Conversation> list = this.conversationService.findAllConversationsCustomer(customer);
            return ResponseEntity.ok().body(list);
        }else if(user.getType().equals("customer_service")){
            CustomerServiceModel customerServiceModel = this.customerServiceService.findByCustomerService(user);
            List<Conversation> list= this.conversationService.findAllConversationsCustomerService(customerServiceModel);
            return ResponseEntity.ok().body(list);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createConversation(@RequestBody NewConversationRequest request){
        Customer customer = this.customerService.findCustomerById(request.getCustomerId());
        CustomerServiceModel customerServiceModel = this.customerServiceService.findCustomerServiceById(request.getCustomerServiceModelId());
        Conversation conversation = new Conversation(customer,customerServiceModel, LocalDateTime.now(),LocalDateTime.now());
        this.conversationService.createConversation(conversation);
        return ResponseEntity.ok().body(conversation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findConversationById(@PathVariable("id") Long id){
        Conversation conversation = this.conversationService.findConversationById(id);
        return ResponseEntity.ok().body(conversation);
    }


    @MessageMapping("/create_private_conversation")
    public Conversation createPrivateConversationSocket(@Payload NewConversationRequest request){
        Customer customer = this.customerService.findCustomerById(request.getCustomerId());
        CustomerServiceModel customerServiceModel = this.customerServiceService.findCustomerServiceById(request.getCustomerServiceModelId());
        Conversation conversation = new Conversation(customer,customerServiceModel, LocalDateTime.now(),LocalDateTime.now());
        this.conversationService.createConversation(conversation);
        this.template.convertAndSendToUser(request.getCustomerServiceModelId().toString(),"/new_private_conversation/customer_service", conversation);
        this.template.convertAndSendToUser(request.getCustomerId().toString(),"/new_private_conversation/customer", conversation);
        return conversation;
    }



}
