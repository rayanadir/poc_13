package com.rayan.server.repositories;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    /**
     * Find all conversations while logged as customer
     */
    List<Conversation> findByCustomer(Customer customer);

    /**
     * Find all conversations while logged as customer service user
     */
    List<Conversation> findByCustomerServiceModel(CustomerServiceModel customerServiceModel);
}
