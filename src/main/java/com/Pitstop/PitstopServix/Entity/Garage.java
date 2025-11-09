package com.Pitstop.PitstopServix.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Garage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String garageName;
    private String garageAddress;
    private String licenseNumber;

    @OneToOne
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private User owner;
}
