package com.rayan.server.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "CONVERSATIONS")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @JoinColumn(name="user_id")
    private Customer customer;

    @NonNull
    @JoinColumn(name="user_id")
    private CustomerService customerService;

    @NonNull
    @Column(name= "created_at")
    private LocalDateTime createdAt;

    @NonNull
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public Conversation(){}

    public Conversation(Customer customer, CustomerService customerService, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.customer=customer;
        this.customerService=customerService;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }
}
