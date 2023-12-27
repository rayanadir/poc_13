package com.rayan.server.repositories;

import com.rayan.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Find a customer user
     */
    //User findByCustomerid(Long id);

    /**
     * Find a customer service user
     */
    //User findByCustomerservice(Long id);
}
