package com.rayan.server.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @NonNull
    @Column(name = "firstname")
    private String firstname;

    @NonNull
    @Column(name = "lastname")
    private String lastname;

    @NonNull
    @Column(name = "email")
    private String email;

    @NonNull
    @Column(name = "password")
    private String password;

    @NonNull
    @Column(name = "birthdate")
    private LocalDate birthdate;

    @NonNull
    @Column(name = "type")
    private String type;

    @NonNull
    @Column(name= "created_at")
    private LocalDateTime createdAt;

    @NonNull
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public User(String firstname, String lastname, String email, String password, LocalDate birthdate, String type, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.firstname=firstname;
        this.lastname=lastname;
        this.email=email;
        this.password=password;
        this.birthdate=birthdate;
        this.type=type;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }

    public User(){}
}
