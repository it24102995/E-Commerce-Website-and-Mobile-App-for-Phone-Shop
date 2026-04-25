package com.ECommerce.ECommerce.service;

import com.ECommerce.ECommerce.dto.AdminLoginRequest;
import com.ECommerce.ECommerce.model.Admin;
import com.ECommerce.ECommerce.model.User;
import com.ECommerce.ECommerce.repository.AdminRepository;
import com.ECommerce.ECommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.ECommerce.ECommerce.model.Payment;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final com.ECommerce.ECommerce.repository.PaymentRepository paymentRepository;

    public List<com.ECommerce.ECommerce.model.Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Map<String, Object> login(AdminLoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByUsername(request.getUsername());

        // Backward compatible login path:
        // 1) legacy records in `admin` table
        // 2) users promoted to ADMIN role in `users` table
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();

            if (!admin.getPassword().equals(request.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid password");
                return response;
            }

            response.put("success", true);
            response.put("message", "Admin login successful");
            response.put("adminId", admin.getId());
            response.put("username", admin.getUsername());
            response.put("role", "ADMIN");
            return response;
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getUsername());

        if (userOpt.isEmpty() || !"ADMIN".equalsIgnoreCase(userOpt.get().getRole())) {
            response.put("success", false);
            response.put("message", "Admin not found");
            return response;
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(request.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return response;
        }

        response.put("success", true);
        response.put("message", "Admin login successful");
        response.put("adminId", user.getId());
        response.put("username", user.getEmail());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", "ADMIN");
        return response;
    }
}
