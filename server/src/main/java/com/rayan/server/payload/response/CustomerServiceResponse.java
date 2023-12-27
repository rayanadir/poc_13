package com.rayan.server.payload.response;

import com.rayan.server.models.CustomerServiceModel;
import com.rayan.server.models.User;
import lombok.Data;

@Data
public class CustomerServiceResponse{

    private User user;
    private CustomerServiceModel customerServiceModel;

    public CustomerServiceResponse(){}

    public CustomerServiceResponse(User user,CustomerServiceModel customerServiceModel) {
        this.user=user;
        this.customerServiceModel=customerServiceModel;
    }
}
