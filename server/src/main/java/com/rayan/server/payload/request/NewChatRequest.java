package com.rayan.server.payload.request;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.User;
import lombok.Data;
import lombok.NonNull;

@Data
public class NewChatRequest {
    @NonNull
    private Conversation conversation;

    @NonNull
    private User user;

    @NonNull
    private String message;
}
