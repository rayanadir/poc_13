package com.rayan.server.controller;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import com.rayan.server.payload.request.NewConversationRequest;
import com.rayan.server.services.ConversationService;
import com.rayan.server.services.CustomerService;
import com.rayan.server.services.CustomerServiceService;
import com.rayan.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


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

    @PostMapping("/create")
    public ResponseEntity<?> createConversation(@RequestBody NewConversationRequest request){
        Conversation conversation = new Conversation(request.getCustomer(),request.getCustomerServiceModel(), LocalDateTime.now(),LocalDateTime.now());
        this.conversationService.createConversation(conversation);
        return ResponseEntity.ok().body(conversation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findConversationById(@PathVariable("id") Long id){
        Conversation conversation = this.conversationService.findConversationById(id);
        return ResponseEntity.ok().body(conversation);
    }
}
