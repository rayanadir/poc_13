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
    @Column(name= "createdat")
    private LocalDateTime createdat;

    @NonNull
    @UpdateTimestamp
    @Column(name="updatedat")
    private LocalDateTime updatedat;

    public Agency(String name, String address, LocalDateTime createdat, LocalDateTime updatedat){
        this.name=name;
        this.address=address;
        this.createdat=createdat;
        this.updatedat=updatedat;
    }

    public Agency(){}
}
