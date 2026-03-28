package com.hyundai.complaints.controller;

import com.hyundai.complaints.entity.Complaint;
import com.hyundai.complaints.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // NEW: Required for checking if a complaint exists before updating

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*") // Crucial: Allows your HTML frontend to communicate with this backend
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // 1. GET ALL: Fetches all complaints for the Dashboard grid
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // 2. CREATE: Saves a new complaint from the frontend form
    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        // Generate a custom ticket ID based on the current timestamp for uniqueness
        complaint.setTicketId("HYU-TKT-" + System.currentTimeMillis() % 10000);
        return complaintRepository.save(complaint);
    }

    // 3. DELETE: Removes a complaint when the staff clicks the trash icon
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        complaintRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 4. UPDATE (NEW): Updates an existing complaint (like marking it RESOLVED)
    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(@PathVariable Long id, @RequestBody Complaint updatedComplaint) {
        // First, check if the complaint actually exists in the database
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);

        if (existingComplaintOpt.isPresent()) {
            Complaint existingComplaint = existingComplaintOpt.get();
            
            // Update the status with the new status sent from the frontend ("RESOLVED")
            existingComplaint.setStatus(updatedComplaint.getStatus());
            
            // Save the updated complaint back to the database
            Complaint savedComplaint = complaintRepository.save(existingComplaint);
            return ResponseEntity.ok(savedComplaint);
        } else {
            // Return 404 Not Found if the ID doesn't exist
            return ResponseEntity.notFound().build();
        }
    }
}