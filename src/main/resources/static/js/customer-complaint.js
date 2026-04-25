document.getElementById('customerComplaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Gather data using names that match the Java Complaint entity
    const complaintData = {
        customerName: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        orderId: document.getElementById('orderNumber').value,
        category: document.getElementById('issueType').value,
        description: document.getElementById('complaintDescription').value,
        status: "PENDING",
        assignedStaff: "Unassigned"
    };

    // Validation
    if (!complaintData.customerName || !complaintData.email || !complaintData.category || !complaintData.description) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch('/api/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complaintData)
        });

        if (response.ok) {
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('customerComplaintForm').reset();
            
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        } else {
            alert("Failed to submit complaint. Please try again later.");
        }
    } catch (error) {
        console.error("Error submitting complaint:", error);
        alert("Server error. Please check your connection.");
    }
});