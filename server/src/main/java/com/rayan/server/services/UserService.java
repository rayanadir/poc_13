package com.rayan.server.services;

import com.rayan.server.models.User;
import com.rayan.server.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Find all users
     */
    public List<User> findAllUsers(){
        return this.userRepository.findAll();
    }

    /**
     * Find a user
     */
    public User findUserById(Long id){
        return this.userRepository.findById(id).orElse(null);
    }

    public User create(User user){
        return this.userRepository.save(user);
    }

    /**
     * Find user by its customer id
     */
    /*public User findUserByCustomerId(Long id){
        return this.userRepository.findByCustomerid(id);
    }*/

    /**
     * Find user by its customer service id
     */
    /*public User findUserByCustomerServiceId(Long id){
        return this.userRepository.findByCustomerserviceid(id);
    }*/
}
