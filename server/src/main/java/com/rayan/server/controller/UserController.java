package com.rayan.server.controller;

import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import com.rayan.server.payload.response.CustomerResponse;
import com.rayan.server.payload.response.CustomerServiceResponse;
import com.rayan.server.services.CustomerService;
import com.rayan.server.services.CustomerServiceService;
import com.rayan.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerServiceService customerServiceService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable("id") Long id){
        User user = this.userService.findUserById(id);
        if(user.getType().equals("customer")){
            Customer customer = this.customerService.findCustomerByUser(user);
            CustomerResponse customerResponse = new CustomerResponse(user,customer);
            return ResponseEntity.ok().body(customerResponse);
        } else if (user.getType().equals("customer_service")) {
            CustomerServiceModel customerServiceModel1 = this.customerServiceService.findByCustomerService(user);
            CustomerServiceResponse customerServiceResponse = new CustomerServiceResponse(user,customerServiceModel1);
            return ResponseEntity.ok().body(customerServiceResponse);
        }
        return ResponseEntity.ok().body("ok");
    }

    @GetMapping()
    public ResponseEntity<?> getAllUsers(){
        List<User> users = this.userService.findAllUsers();
        return ResponseEntity.ok().body(users);
    }
}
