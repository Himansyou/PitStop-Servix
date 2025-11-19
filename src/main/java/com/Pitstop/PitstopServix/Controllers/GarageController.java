package com.Pitstop.PitstopServix.Controllers;

import com.Pitstop.PitstopServix.Entity.Garage;
import com.Pitstop.PitstopServix.Repositories.GarageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/garages")
@CrossOrigin(origins = "*")
public class GarageController {

    @Autowired
    private GarageRepository garageRepository;

    @GetMapping
    public ResponseEntity<List<Garage>> getAllGarages() {
        List<Garage> garages = garageRepository.findAll();
        return ResponseEntity.ok(garages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Garage> getGarageById(@PathVariable Long id) {
        return garageRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

  //  @GetMapping("/popular")
  //  public ResponseEntity<List<Garage>> getPopularGarages() {
        // You might want to sort by rating or number of reviews
  //      List<Garage> popularGarages = garageRepository.findTop5ByOrderByRatingDesc();
  //      return ResponseEntity.ok(popularGarages);
  //  }
}