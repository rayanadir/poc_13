package com.rayan.server.services;

import com.rayan.server.models.Customer;
import com.rayan.server.models.User;
import com.rayan.server.repositories.CustomerRepository;
import com.rayan.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service that handles customer user (not customer service user)
 */
@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    /*public Customer findCustomerById(Long id){
        return this.customerRepository.findById(id).orElse(null);
    }*/

    public Customer findByCustomerId(Long id){
        return this.customerRepository.findByCustomerid(id);
    }

    public List<Customer> findAllCustomers(){
        return this.customerRepository.findAll();
    }

    /**
     * Find customer by its user data
     */
    public Customer findCustomerByUser(User user){
        return this.customerRepository.findByCustomer(user);
    }
}
