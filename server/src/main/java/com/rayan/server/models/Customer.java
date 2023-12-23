package com.rayan.server.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="CUSTOMERS")
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "user_id")
public class Customer extends User{
    @NonNull
    @Column(name = "address")
    private String address;

    @NonNull
    @Column(name= "customer_id")
    private Long customer_id;

    public Customer(){}

    public Customer(String firstname, String lastname, String email, String password, LocalDate birthdate, String type, LocalDateTime createdAt, LocalDateTime updatedAt, String address, Long customer_id){
        super(firstname,lastname,email,password,birthdate,type,createdAt,updatedAt);
        this.address=address;
        this.customer_id=customer_id;
    }
}
