package com.rayan.server.payload.response;

import com.rayan.server.models.Customer;
import com.rayan.server.models.User;
import lombok.Data;

@Data
public class CustomerResponse{
    private User user;
    private Customer customer;

    public CustomerResponse(){}

    public CustomerResponse(User user, Customer customer){
        this.user=user;
        this.customer=customer;
    }
}
