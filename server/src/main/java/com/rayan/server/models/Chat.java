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

    @ManyToOne
    @JoinColumn(name="conversationid")
    private Conversation conversation;

    @OneToOne
    @JoinColumn(name="messagesenderid")
    private User user;

    @Column(name="message")
    private String message;

    @NonNull
    @Column(name= "createdat")
    private LocalDateTime createdat;

    @NonNull
    @UpdateTimestamp
    @Column(name="updatedat")
    private LocalDateTime updatedat;

    public Chat(){}

    public Chat(Conversation conversation, User user, String message, LocalDateTime createdat, LocalDateTime updatedat){
        this.conversation=conversation;
        this.user=user;
        this.message=message;
        this.createdat=createdat;
        this.updatedat=updatedat;
    }
}
