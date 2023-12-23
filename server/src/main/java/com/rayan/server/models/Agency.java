package com.rayan.server.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="AGENCIES")
public class Agency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(name = "name")
    private String name;

    @NonNull
    @Column(name = "address")
    private String address;

    @NonNull
    @Column(name= "created_at")
    private LocalDateTime createdAt;

    @NonNull
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public Agency(String name, String address, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.name=name;
        this.address=address;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
    }

    public Agency(){}
}
