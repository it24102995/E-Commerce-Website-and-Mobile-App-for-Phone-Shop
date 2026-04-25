package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.model.Rider;
import com.ECommerce.ECommerce.repository.RiderRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class RiderService {

    private final RiderRepository riderRepository;

    public RiderService(RiderRepository riderRepository) {
        this.riderRepository = riderRepository;
    }

    public Rider registerRider(Rider rider) {
        return riderRepository.save(rider);
    }

    public Optional<Rider> login(String email, String password) {
        return riderRepository.findByEmail(email)
                .filter(r -> r.getPassword().equals(password)); // In production, use password hashing
    }

    public Optional<Rider> getRiderById(Long id) {
        return riderRepository.findById(id);
    }
}
