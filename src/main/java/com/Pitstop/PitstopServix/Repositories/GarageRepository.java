package com.Pitstop.PitstopServix.Repositories;


import com.Pitstop.PitstopServix.Entity.Garage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GarageRepository extends JpaRepository<Garage, Long> {
    List<Garage> findByGarageNameContainingIgnoreCase(String name);
}
