package com.rayan.server.repositories;

import com.rayan.server.models.Customer;
import com.rayan.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Customer findByCustomer(User user);
    Customer findByCustomerid(Long id);
}
