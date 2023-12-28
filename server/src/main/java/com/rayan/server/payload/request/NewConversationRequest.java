package com.rayan.server.payload.request;

import com.rayan.server.models.Customer;
import com.rayan.server.models.CustomerServiceModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewConversationRequest {
    @NonNull
    private Long customerId;

    @NonNull
    private Long customerServiceModelId;
}
