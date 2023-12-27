package com.rayan.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;


@Entity
@Data
@Table(name="CUSTOMERS")
public class Customer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerid;

    @NonNull
    @Column(name = "address")
    private String address;


    @ManyToOne
    @NonNull
    @JoinColumn(name="userid")
    private User customer;

    public Customer(){}

    public Customer(String address, User customer){
        this.address=address;
        this.customer=customer;
    }
}
