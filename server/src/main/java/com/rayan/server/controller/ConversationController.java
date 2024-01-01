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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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


    /**
     * Get all customer conversations by its user id
     * @param id
     * @return
     */
    @GetMapping("/customer/{id}")
    public ResponseEntity<?> getAllConversationsCustomer(@PathVariable("id") Long id){
        User user = this.userService.findUserById(id);
        Customer customer = this.customerService.findCustomerByUser(user);
        List<Conversation> list = this.conversationService.findAllConversationsCustomer(customer);
        return ResponseEntity.ok().body(list);
    }

    /**
     * Get all service customer conversations by its user id
     * @param id
     * @return
     */
    @GetMapping("/customer_service/{id}")
    public ResponseEntity<?> getAllConversationsCustomerService(@PathVariable("id") Long id){
        User user = this.userService.findUserById(id);
        CustomerServiceModel customerServiceModel = this.customerServiceService.findByCustomerService(user);
        List<Conversation> list= this.conversationService.findAllConversationsCustomerService(customerServiceModel);
        return ResponseEntity.ok().body(list);
    }

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

    /*@MessageMapping("/get_conversation/{conversationId}")
    @SendTo("/topic/single_conversation/{conversationId}")
    public Conversation getSingleConversation(@Payload @DestinationVariable Long conversationId){
        Conversation conversation = this.conversationService.findConversationById(conversationId);
        return conversation;
    }

    @MessageMapping("/get_all_conversations/customer")
    public List<Conversation> getAllConversationsCustomerSocket(Long id) {
        Customer customer = this.customerService.findCustomerById(id);
        List<Conversation> list = this.conversationService.findAllConversationsCustomer(customer);
        this.template.convertAndSend("/topic/get_all_conversations/customer/"+id, list);
        return list;
    }

    @MessageMapping("/get_all_conversations/customer_service")
    @SendTo("/topic/get_all_conversations/customer_service/{userid}")
    public List<Conversation> getAllConversationsCustomerServiceSocket(Long id) {
        CustomerServiceModel customerServiceModel = this.customerServiceService.findCustomerServiceById(id);
        List<Conversation> list= this.conversationService.findAllConversationsCustomerService(customerServiceModel);
        this.template.convertAndSend("/topic/get_all_conversations/customer/"+id, list);
        return list;
    }*/

    @MessageMapping("/create_conversation")
    @SendTo("/topic/new_conversation")
    public Conversation createConversationSocket(@Payload NewConversationRequest request){
        Customer customer = this.customerService.findCustomerById(request.getCustomerId());
        CustomerServiceModel customerServiceModel = this.customerServiceService.findCustomerServiceById(request.getCustomerServiceModelId());
        Conversation conversation = new Conversation(customer,customerServiceModel, LocalDateTime.now(),LocalDateTime.now());
        this.conversationService.createConversation(conversation);
        return conversation;
    }

}
