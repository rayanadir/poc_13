package com.rayan.server.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="CHAT")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name="conversation_id")
    private Conversation conversation;

    @JoinColumn(name="message_sender_id")
    private User user;

    @Column(name="message")
    private String message;

    @NonNull
    @Column(name= "created_at")
    private LocalDateTime createdAt;

    @NonNull
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;
}
