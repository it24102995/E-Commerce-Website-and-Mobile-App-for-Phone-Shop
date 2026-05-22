package com.fooddelivery.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fooddelivery.model.AppUser;

public interface UserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);
}