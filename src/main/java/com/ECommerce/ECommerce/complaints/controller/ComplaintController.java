package com.ECommerce.ECommerce.complaints.controller;

import com.ECommerce.ECommerce.complaints.entity.Complaint;
import com.ECommerce.ECommerce.complaints.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        complaint.setTicketId("HYU-TKT-" + System.currentTimeMillis() % 10000);
        return complaintRepository.save(complaint);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        complaintRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(@PathVariable Long id, @RequestBody Complaint updatedComplaint) {
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);

        if (existingComplaintOpt.isPresent()) {
            Complaint existingComplaint = existingComplaintOpt.get();
            existingComplaint.setStatus(updatedComplaint.getStatus());
            Complaint savedComplaint = complaintRepository.save(existingComplaint);
            return ResponseEntity.ok(savedComplaint);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
