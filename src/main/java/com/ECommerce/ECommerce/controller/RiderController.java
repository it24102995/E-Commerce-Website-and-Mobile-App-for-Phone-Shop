package com.ECommerce.ECommerce.controller;

import com.ECommerce.ECommerce.model.Rider;
import com.ECommerce.ECommerce.service.RiderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/riders")
@CrossOrigin(origins = "*")
public class RiderController {

    private final RiderService riderService;

    public RiderController(RiderService riderService) {
        this.riderService = riderService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Rider> signup(@RequestBody Rider rider) {
        return ResponseEntity.ok(riderService.registerRider(rider));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Rider loginRequest) {
        return riderService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
