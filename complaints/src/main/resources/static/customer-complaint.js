document.getElementById('customerComplaintForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    // Gather the data from the customer form
    const complaintData = {
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        orderNumber: document.getElementById('orderNumber').value,
        issueType: document.getElementById('issueType').value,
        description: document.getElementById('complaintDescription').value,
        
        // Auto-fill the admin fields behind the scenes!
        status: "Pending", 
        assignedStaff: "Unassigned",
        dateSubmitted: new Date().toISOString().split('T')[0]
    };

    // Note: Once your Spring Boot backend is ready, you will use fetch() here 
    // to send this 'complaintData' to your database via POST request.
    console.log("Sending to database:", complaintData);

    // Show success message to the customer
    document.getElementById('successMessage').style.display = 'block';
    
    // Clear the form
    document.getElementById('customerComplaintForm').reset();
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
});