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

    @ManyToOne
    @NonNull
    @JoinColumn(name="customerid")
    private Customer customer;

    @ManyToOne
    @NonNull
    @JoinColumn(name="customerserviceid")
    private CustomerServiceModel customerServiceModel;

    @NonNull
    @Column(name= "createdat")
    private LocalDateTime createdat;

    @NonNull
    @UpdateTimestamp
    @Column(name="updatedat")
    private LocalDateTime updatedat;

    public Conversation(){}

    public Conversation(Customer customer, CustomerServiceModel customerServiceModel, LocalDateTime createdat, LocalDateTime updatedat){
        this.customer=customer;
        this.customerServiceModel = customerServiceModel;
        this.createdat=createdat;
        this.updatedat=updatedat;
    }
}
