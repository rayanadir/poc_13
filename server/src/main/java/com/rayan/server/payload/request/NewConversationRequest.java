package com.rayan.server.payload.request;

import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import lombok.Data;
import lombok.NonNull;

@Data
public class NewConversationRequest {
    @NonNull
    private Customer customer;

    @NonNull
    private CustomerServiceModel customerServiceModel;
}
