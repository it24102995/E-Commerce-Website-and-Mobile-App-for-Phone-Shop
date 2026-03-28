package com.mobileshop.service;

import com.mobileshop.dto.LoginRequest;
import com.mobileshop.dto.RegisterRequest;
import com.mobileshop.dto.UserCreateRequest;
import com.mobileshop.dto.UserDTO;
import com.mobileshop.dto.UserUpdateRequest;
import com.mobileshop.model.User;
import com.mobileshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // ── Register new user (duplicate email check) ──────────────────────
    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered");
            return response;
        }

        // Generate username from email (part before @)
        String username = request.getEmail().split("@")[0];

        User user = User.builder()
                .username(username)
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role("USER")
                .build();

        User saved = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("userId", saved.getId());
        response.put("name", saved.getName());
        response.put("email", saved.getEmail());
        response.put("role", saved.getRole());
        return response;
    }

    // ── User login ───────────────────────────────────────────────────
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found with this email");
            return response;
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        return response;
    }

    // ── ADMIN: Get all users ──────────────────────────────────────────
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    // ── ADMIN: Get user by ID ─────────────────────────────────────────
    public UserDTO getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User u = user.get();
            return UserDTO.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .role(u.getRole())
                    .build();
        }
        return null;
    }

    // ── ADMIN: Create new user ────────────────────────────────────────
    public Map<String, Object> createUser(UserCreateRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return response;
        }

        String role = request.getRole();
        if (!role.equals("ADMIN") && !role.equals("USER")) {
            response.put("success", false);
            response.put("message", "Invalid role. Use 'ADMIN' or 'USER'");
            return response;
        }

        // Generate username from email (part before @)
        String username = request.getEmail().split("@")[0];

        User user = User.builder()
                .username(username)
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(role)
                .build();

        User saved = userRepository.save(user);

        response.put("success", true);
        response.put("message", "User created successfully");
        response.put("user", UserDTO.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .build());
        return response;
    }

    // ── ADMIN: Update user ────────────────────────────────────────────
    public Map<String, Object> updateUser(Long id, UserUpdateRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        String role = request.getRole();
        if (!role.equals("ADMIN") && !role.equals("USER")) {
            response.put("success", false);
            response.put("message", "Invalid role. Use 'ADMIN' or 'USER'");
            return response;
        }

        User user = userOpt.get();
        user.setName(request.getName());
        user.setRole(role);

        User updated = userRepository.save(user);

        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("user", UserDTO.builder()
                .id(updated.getId())
                .name(updated.getName())
                .email(updated.getEmail())
                .role(updated.getRole())
                .build());
        return response;
    }

    // ── ADMIN: Delete user ────────────────────────────────────────────
    public Map<String, Object> deleteUser(Long id) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return response;
        }

        userRepository.deleteById(id);

        response.put("success", true);
        response.put("message", "User deleted successfully");
        return response;
    }

    // ── ADMIN: Get users by role ──────────────────────────────────────
    public List<UserDTO> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }
}
