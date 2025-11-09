package com.Pitstop.PitstopServix.Repositories;

import com.Pitstop.PitstopServix.Entity.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerProfileRepository extends JpaRepository<CustomerProfile,Long> {
}
