package com.Pitstop.PitstopServix.Services;


import com.Pitstop.PitstopServix.Entity.CustomerProfile;
import com.Pitstop.PitstopServix.Entity.Garage;
import com.Pitstop.PitstopServix.Entity.Role;
import com.Pitstop.PitstopServix.Entity.User;
import com.Pitstop.PitstopServix.Repositories.CustomerProfileRepository;
import com.Pitstop.PitstopServix.Repositories.GarageRepository;
import com.Pitstop.PitstopServix.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final GarageRepository garageRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, GarageRepository garageRepository,
                       CustomerProfileRepository customerProfileRepository,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.garageRepository = garageRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public User registerGarageOwner(User user, Garage garage) {

        user.setRole(Role.GARAGE_OWNER);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash password
        garage.setOwner(user);
        user.setGarage(garage);
        return userRepository.save(user);

    }

    public User registerCustomer(User user, CustomerProfile profile) {

        user.setRole(Role.CUSTOMER);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash password
        profile.setUser(user);
        user.setCustomerProfile(profile);
        return userRepository.save(user);

    }

    public List<Garage> searchGarages(String name) {

        return garageRepository.findByGarageNameContainingIgnoreCase(name);

    }
}
