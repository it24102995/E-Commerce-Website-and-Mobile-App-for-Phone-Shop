package com.hyundai.complaints.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hyundai.complaints.entity.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Spring Data JPA automatically provides save(), findAll(), deleteById(), etc.
}