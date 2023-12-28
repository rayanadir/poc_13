package com.rayan.server.services;

import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import com.rayan.server.repositories.CustomerServiceRepository;
import com.rayan.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service that handles customer service user (not customer user)
 */
@Service
public class CustomerServiceService {

    @Autowired
    private CustomerServiceRepository customerServiceRepository;

    @Autowired
    private UserRepository userRepository;

    public CustomerServiceModel findCustomerServiceById(Long id){
        return this.customerServiceRepository.findById(id).orElse(null);
    }

    public CustomerServiceModel findByCustomerService(User user){
        return this.customerServiceRepository.findByCustomerservice(user);
    }

    public List<CustomerServiceModel> findAllCustomerService(){
        return this.customerServiceRepository.findAll();
    }

    public CustomerServiceModel findUserByCustomerServiceId(Long id){
        return this.customerServiceRepository.findByCustomerserviceid(id);
    }
}
