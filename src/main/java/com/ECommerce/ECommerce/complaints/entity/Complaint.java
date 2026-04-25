package com.ECommerce.ECommerce.complaints.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A customized string ID for the staff UI (e.g., "HYU-TKT-1001")
    private String ticketId; 

    // Customer Info
    private String customerName;
    private String email;
    private String phone;
    private String orderId;

    // Product & Issue Info
    private String productName;
    private String category;
    private String priority;
    
    // NEW FIELD: H Tracking Number
    @Column(name = "h_tracking_number")
    @JsonProperty("hTrackingNumber") 
    private String hTrackingNumber;

    @Column(length = 2000)
    private String description;

    // Staff & Resolution Tracking
    private String severity;
    private String status = "PENDING"; // PENDING, IN_PROGRESS, RESOLVED
    private String assignedStaff;

    private LocalDateTime createdAt = LocalDateTime.now();

    // =======================================================
    // GETTERS AND SETTERS 
    // =======================================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getHTrackingNumber() { return hTrackingNumber; }
    public void setHTrackingNumber(String hTrackingNumber) { this.hTrackingNumber = hTrackingNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
