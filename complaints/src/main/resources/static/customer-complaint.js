document.getElementById('customerComplaintForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent page reload

    // 1. Clear any old error messages from a previous attempt
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = "");

    // 2. Gather the raw values
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const orderNumber = document.getElementById('orderNumber').value.trim();
    const issueType = document.getElementById('issueType').value;
    const description = document.getElementById('complaintDescription').value.trim();

    // 3. Run Validations
    let isValid = true;

    if (name === "") {
        document.getElementById("nameError").textContent = "Full Name is required.";
        isValid = false;
    }

    // Standard Regex to check if the email has an @ and a domain
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    if (issueType === "") {
        document.getElementById("issueTypeError").textContent = "Please select an issue type.";
        isValid = false;
    }

    if (description.length < 15) {
        document.getElementById("descError").textContent = "Please provide at least 15 characters of detail.";
        isValid = false;
    }

    // If any validation failed, stop the script right here
    if (!isValid) return;

    // 4. Gather the verified data for the database
    const complaintData = {
        customerName: name,
        customerEmail: email,
        orderNumber: orderNumber,
        issueType: issueType,
        description: description,
        
        // Auto-fill the admin fields behind the scenes!
        status: "Pending", 
        assignedStaff: "Unassigned",
        dateSubmitted: new Date().toISOString().split('T')[0]
    };

    console.log("Sending to database:", complaintData);

    // 5. Send to your Spring Boot Backend using fetch()
    try {
        // NOTE: Make sure this URL matches your Spring Boot @PostMapping URL
        const response = await fetch("http://localhost:8080/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaintData)
        });

        // If the server replies with a 200 OK status, the save was successful!
        if (response.ok) {
            // Show success message to the customer
            document.getElementById('successMessage').style.display = 'block';
            
            // Clear the form
            document.getElementById('customerComplaintForm').reset();
            
            // Hide the success message after 5 seconds
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        } else {
            alert("The server received the request but couldn't save it. Check your Java console for errors.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Could not connect to the database. Is your Spring Boot server running?");
    }
});