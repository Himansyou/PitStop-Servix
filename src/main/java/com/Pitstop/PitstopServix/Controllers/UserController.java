package com.Pitstop.PitstopServix.Controllers;

import com.Pitstop.PitstopServix.Configs.JwtUtil;
import com.Pitstop.PitstopServix.Entity.CustomerProfile;
import com.Pitstop.PitstopServix.Entity.Garage;
import com.Pitstop.PitstopServix.Entity.User;
import com.Pitstop.PitstopServix.Repositories.UserRepository;
import com.Pitstop.PitstopServix.Services.UserService;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {


    private final UserService userService;
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public UserController(UserService userService, UserRepository userRepository,PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register/garage")
    public User registerGarageOwner(@RequestBody GarageRegistrationRequest request) {
        User user = request.getUser();
        Garage garage = request.getGarage();
        return userService.registerGarageOwner(user, garage);
    }

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegistrationRequest request) {
        User user = request.getUser();
        CustomerProfile profile = request.getProfile();
        User savedUser = userService.registerCustomer(user, profile);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        Map<String, Object> body = new HashMap<>();
        body.put("token", token);

        Map<String, Object> userResp = new HashMap<>();
        userResp.put("id", savedUser.getId());
        userResp.put("email", savedUser.getEmail());
        userResp.put("name", savedUser.getName());
        body.put("user", userResp);

        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }


    @GetMapping("/garages/search/{name}")
    public List<Garage> searchGarages(@PathVariable String name) {
        return userService.searchGarages(name);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty() || !passwordEncoder.matches(request.getPassword(), optionalUser.get().getPassword())) {
            response.put("message", "Invalid email or password");
            return response;
        }
        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user.getEmail());
        response.put("token", token);
        response.put("user", user); // You may want to exclude password field in real response
        return response;
    }
}

// Helper DTOs
@Getter
class GarageRegistrationRequest {
    private User user;
    private Garage garage;
}

@Getter
class LoginRequest {
    // getters and setters
    private String email;
    private String password;

    public void setEmail(String email) { this.email = email; }

    public void setPassword(String password) { this.password = password; }
}
@Getter
class CustomerRegistrationRequest {
    private User user;
    private CustomerProfile profile;
}
