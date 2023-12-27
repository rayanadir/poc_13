package com.rayan.server.repositories;

import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerServiceRepository extends JpaRepository<CustomerServiceModel,Long> {
    CustomerServiceModel findByCustomerservice(User user);

    CustomerServiceModel findByCustomerserviceid(Long id);
}
