package com.fooddelivery.config;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fooddelivery.model.AppUser;
import com.fooddelivery.model.FoodItem;
import com.fooddelivery.model.Role;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FoodItemRepository foodItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(AppUser.builder()
                    .fullName("Admin User")
                    .email("admin@foodhub.com")
                    .password(passwordEncoder.encode("Admin@12345"))
                    .phone("+94 70 000 0000")
                    .address("Admin Office")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .createdAt(Instant.now())
                    .build());

            userRepository.save(AppUser.builder()
                    .fullName("Demo Customer")
                    .email("user@foodhub.com")
                    .password(passwordEncoder.encode("User@12345"))
                    .phone("+94 71 000 0000")
                    .address("Student Hostel")
                    .role(Role.USER)
                    .enabled(true)
                    .createdAt(Instant.now())
                    .build());

            userRepository.save(AppUser.builder()
                    .fullName("Second Admin")
                    .email("admin2@foodhub.com")
                    .password(passwordEncoder.encode("Admin2@12345"))
                    .phone("+94 72 000 0000")
                    .address("Second Admin Office")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .createdAt(Instant.now())
                    .build());
        }

        userRepository.findByEmail("admin@foodhub.com").ifPresent(adminUser -> {
            boolean changed = false;
            if (adminUser.getRole() != Role.ADMIN) {
                adminUser.setRole(Role.ADMIN);
                changed = true;
            }
            if (!adminUser.isEnabled()) {
                adminUser.setEnabled(true);
                changed = true;
            }
            if (changed) {
                userRepository.save(adminUser);
            }
        });

        userRepository.findByEmail("user@foodhub.com").ifPresent(demoUser -> {
            boolean changed = false;
            if (demoUser.getRole() != Role.USER) {
                demoUser.setRole(Role.USER);
                changed = true;
            }
            if (!demoUser.isEnabled()) {
                demoUser.setEnabled(true);
                changed = true;
            }
            if (changed) {
                userRepository.save(demoUser);
            }
        });

        if (userRepository.findByEmail("admin2@foodhub.com").isEmpty()) {
            userRepository.save(AppUser.builder()
                    .fullName("Second Admin")
                    .email("admin2@foodhub.com")
                    .password(passwordEncoder.encode("Admin2@12345"))
                    .phone("+94 72 000 0000")
                    .address("Second Admin Office")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .createdAt(Instant.now())
                    .build());
        }

        if (foodItemRepository.count() == 0) {
            foodItemRepository.save(FoodItem.builder()
                    .name("Chicken Burger Combo")
                    .description("Grilled chicken burger with fries and soft drink.")
                    .category("Burgers")
                    .price(new BigDecimal("12.50"))
                    .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80")
                    .available(true)
                    .featured(true)
                    .prepTimeMinutes(20)
                    .createdAt(Instant.now())
                    .build());

            foodItemRepository.save(FoodItem.builder()
                    .name("Spicy Noodles")
                    .description("Wok-tossed noodles with chili garlic sauce and vegetables.")
                    .category("Asian")
                    .price(new BigDecimal("9.25"))
                    .imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80")
                    .available(true)
                    .featured(true)
                    .prepTimeMinutes(15)
                    .createdAt(Instant.now())
                    .build());

            foodItemRepository.save(FoodItem.builder()
                    .name("Fresh Veggie Pizza")
                    .description("Stone baked pizza with fresh vegetables and mozzarella.")
                    .category("Pizza")
                    .price(new BigDecimal("14.00"))
                    .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80")
                    .available(true)
                    .featured(false)
                    .prepTimeMinutes(25)
                    .createdAt(Instant.now())
                    .build());
        }
    }
}
