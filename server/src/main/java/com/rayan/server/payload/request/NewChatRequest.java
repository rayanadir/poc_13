package com.rayan.server.payload.request;

import com.rayan.server.models.Conversation;
import com.rayan.server.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewChatRequest {
    @NonNull
    private Long conversationid;

    @NonNull
    private User user;

    @NonNull
    private String message;
}
