package com.rayan.server.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "CUSTOMER_SERVICE")
@PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "user_id")
public class CustomerService extends User{
    @NonNull
    @JoinColumn(name="agency_id")
    private Agency agency;

    @NonNull
    @Column(name = "customer_service_id")
    private Long customer_service_id;

    public CustomerService(){}

    public CustomerService(String firstname, String lastname, String email, String password, LocalDate birthdate, String type, LocalDateTime createdAt, LocalDateTime updatedAt, Agency agency, Long customer_service_id){
        super(firstname,lastname,email,password,birthdate,type,createdAt,updatedAt);
        this.agency=agency;
        this.customer_service_id=customer_service_id;
    }
}
