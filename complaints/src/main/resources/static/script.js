// Global state to hold complaints for searching and rendering
let complaintsState = [];
let currentTab = 'ACTIVE'; // NEW: Tracks which tab we are currently viewing

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 2. Initialize Dashboard if we are already logged in (for testing)
    // document.getElementById('login-container').classList.add('hidden');
    // showDashboard();
});

// ==========================================
// LOGIN & NAVIGATION LOGIC
// ==========================================
// ==========================================
// LOGIN & NAVIGATION LOGIC
// ==========================================
function handleLogin(e) {
    e.preventDefault();
    
    // Get the values the user typed in
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // SET YOUR SPECIFIC USERNAME AND PASSWORD HERE
    const validUsername = "admin";
    const validPassword = "password123";

    // Check if what they typed matches your specific credentials
    if (user === validUsername && pass === validPassword) {
        // Success! Hide login and show dashboard
        document.getElementById('login-error').textContent = ''; // clear any old errors
        document.getElementById('login-container').classList.add('hidden');
        showDashboard();
    } else {
        // Failed! Show error message
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = 'Invalid username or password!';
            errorElement.style.color = 'red'; // Just to make sure it stands out
        } else {
            alert('Invalid username or password!');
        }
    }
}

function showDashboard() {
    document.getElementById('dashboard-container').classList.remove('hidden');
    initializeDashboard();
    fetchComplaints(); // Fetch data from Spring Boot when dashboard loads
}

function initializeDashboard() {
    populateStaffDropdown();

    // Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.panel-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Only prevent default if it has a target, otherwise let onclick handle it
            e.preventDefault(); 
            
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => {
                sec.classList.remove('active');
                sec.classList.add('hidden');
            });

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }
            
            document.getElementById('dynamic-title').textContent = item.textContent.trim();
        });
    });

    // Form Submission
    const newComplaintForm = document.getElementById('new-complaint-form');
    if (newComplaintForm) {
        newComplaintForm.addEventListener('submit', handleNewComplaint);
    }

    // Toggle Switch
    const toggle = document.getElementById('assigned-toggle');
    const toggleText = document.querySelector('.toggle-status-text');
    const staffInput = document.getElementById('assigned_staff');
    
    if (toggle) {
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                toggleText.textContent = "Initially Assigned";
                staffInput.disabled = false;
                staffInput.required = true;
            } else {
                toggleText.textContent = "Unassigned";
                staffInput.disabled = true;
                staffInput.value = "";
                staffInput.required = false;
            }
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('dashboard-container').classList.add('hidden');
            document.getElementById('login-container').classList.remove('hidden');
            document.getElementById('login-form').reset();
        });
    }

    // Attach Search Functionality
    const searchBar = document.getElementById('complaint-search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', handleSearch);
    }
}

// ==========================================
// STAFF DROPDOWN & SEARCH
// ==========================================
function populateStaffDropdown() {
    const staffMembers = [
        "Sarah Jenkins (Staff-01)", 
        "Mike Ross (Staff-02)", 
        "Harvey Specter (Staff-03)", 
        "Donna Paulsen (Staff-04)",
        "John Doe (Tech Support Alpha)",
        "Jane Smith (Tech Support Beta)"
    ];
    
    const dataList = document.getElementById('staff-options');
    if (!dataList) return;
    
    dataList.innerHTML = ''; 
    
    staffMembers.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff;
        dataList.appendChild(option);
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // First, respect the current tab filter
    let baseData = complaintsState.filter(complaint => {
        const status = (complaint.status || '').toUpperCase();
        return currentTab === 'SOLVED' ? status === 'RESOLVED' : status !== 'RESOLVED';
    });

    // Then apply the search term
    const filteredComplaints = baseData.filter(tkt => {
        return (
            (tkt.ticketId && tkt.ticketId.toLowerCase().includes(searchTerm)) ||
            (tkt.hTrackingNumber && tkt.hTrackingNumber.toLowerCase().includes(searchTerm)) ||
            (tkt.customerName && tkt.customerName.toLowerCase().includes(searchTerm)) ||
            (tkt.status && tkt.status.toLowerCase().includes(searchTerm))
        );
    });

    renderComplaintsTable(filteredComplaints);
}

// ==========================================
// NEW FEATURE: FILTER TABS
// ==========================================
function filterComplaints(tabType) {
    currentTab = tabType;
    
    // Filter the global state
    const filteredData = complaintsState.filter(complaint => {
        const status = (complaint.status || '').toUpperCase();
        if (currentTab === 'SOLVED') {
            return status === 'RESOLVED';
        } else {
            return status !== 'RESOLVED'; // Shows Pending and In Progress
        }
    });

    renderComplaintsTable(filteredData); 
}

// ==========================================
// DATA FETCHING & RENDERING
// ==========================================
async function fetchComplaints() {
    try {
        const response = await fetch('http://localhost:8080/api/complaints');
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        complaintsState = data; 
        
        filterComplaints(currentTab); // Re-apply the current tab filter
        updateDashboardStats();
    } catch (error) {
        console.error("Error fetching complaints:", error);
    }
}

function renderComplaintsTable(dataToRender = complaintsState) {
    const tbody = document.getElementById('complaints-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 

    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 20px;">No complaints found in this category.</td></tr>`;
        return;
    }

    dataToRender.forEach((tkt, index) => {
        const row = tbody.insertRow();
        row.style.opacity = '0'; 
        row.classList.add('table-row-animate'); 

        const getBadge = (text, type) => `<span class="badge ${type}">${text}</span>`;
        
        const safeStatus = tkt.status || "PENDING";
        const safePriority = tkt.priority || "Medium";
        const safeSeverity = tkt.severity || "Medium";

        const statusType = safeStatus.toUpperCase() === 'RESOLVED' ? 'resolved' : (safeStatus.toUpperCase() === 'IN_PROGRESS' ? 'progress' : 'pending');
        const priorityType = safePriority.toLowerCase();
        const severityType = safeSeverity.toLowerCase();

        const staffName = tkt.assignedStaff && tkt.assignedStaff !== "Unassigned" ? tkt.assignedStaff : "Unassigned";
        const staffIcon = staffName === "Unassigned" 
            ? '<i class="fas fa-exclamation-circle" style="color:#e67e22; margin-left:5px"></i>' 
            : '<i class="fas fa-user-check" style="color:#2ecc71; margin-left:5px; font-size:12px;"></i>';

        // NEW: Decide whether to show the Resolve button based on status
        const isResolved = safeStatus.toUpperCase() === 'RESOLVED';
        const resolveButtonHTML = !isResolved ? 
            `<button onclick="resolveComplaint(${tkt.id})" title="Mark as Resolved" style="background: none; border: none; cursor: pointer; margin-right: 15px;">
                <i class="fas fa-check-circle" style="color: #27ae60; font-size: 18px; transition: transform 0.2s;"></i>
            </button>` : '';

        row.innerHTML = `
            <td><strong>${tkt.ticketId || tkt.id || "NEW-TKT"}</strong></td>
            <td style="color: #002c5f; font-weight: bold;">${tkt.hTrackingNumber || "N/A"}</td>
            <td>
                <span style="font-weight: 500; color: #333;">${tkt.customerName || "Unknown Customer"}</span><br>
                <span style="font-size:11px; color:#aaa">${tkt.email || "No email"}</span>
            </td>
            <td>${tkt.category || tkt.issue_type || "General"}</td>
            <td>${getBadge(safePriority, priorityType)}</td>
            <td>${getBadge(safeSeverity, severityType)}</td>
            <td>${getBadge(safeStatus, statusType)}</td>
            <td style="text-transform: uppercase; font-size: 0.85em; font-weight: bold; color: #555;">
                ${staffName} ${staffIcon}
            </td>
            <td>
                ${resolveButtonHTML}
                <button class="delete-btn" onclick="deleteComplaint(${tkt.id}, this)" title="Delete Complaint" style="background: none; border: none; cursor: pointer;">
                    <i class="fas fa-trash-alt" style="color: #e74c3c; font-size: 18px; transition: transform 0.2s;"></i>
                </button>
            </td>
        `;
        
        setTimeout(() => row.style.opacity = '1', 50 * index);
    });
}

// ==========================================
// CRUD OPERATIONS
// ==========================================
async function handleNewComplaint(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        form.reportValidity(); 
        return; 
    }

    const formData = new FormData(form);
    const isAssigned = document.getElementById('assigned-toggle').checked;
    const assignedStaff = isAssigned ? formData.get('assigned_staff') : "Unassigned";

    const newComplaint = {
        customerName: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone_number'),
        orderId: formData.get('order_id'),
        productName: formData.get('product_name'),
        hTrackingNumber: formData.get('h_tracking_number'), 
        category: formData.get('category'), 
        priority: formData.get('priority'),
        description: formData.get('description'),
        severity: formData.get('severity'),
        status: isAssigned ? "IN_PROGRESS" : "PENDING", 
        assignedStaff: assignedStaff 
    };

    try {
        const response = await fetch('http://localhost:8080/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComplaint)
        });

        if (response.ok) {
            alert('Complaint registered successfully!');
            form.reset();
            document.querySelector('.nav-item[data-target="all-complaints-section"]').click();
            fetchComplaints(); 
        } else {
            alert('Error saving complaint. Please check your backend.');
        }
    } catch (error) {
        console.error("Error posting complaint:", error);
        alert('Network error. Is your Spring Boot server running?');
    }
}

// NEW FEATURE: Resolve Complaint Function
async function resolveComplaint(id) {
    if (!confirm('Are you sure you want to mark this complaint as Resolved?')) return;

    // We find the existing complaint so we can send the whole object back to Spring Boot
    const existingComplaint = complaintsState.find(c => c.id === id);
    if(!existingComplaint) return;

    // Create a copy but change the status
    const updatedComplaint = { ...existingComplaint, status: "RESOLVED" };

    try {
        const response = await fetch(`http://localhost:8080/api/complaints/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedComplaint)
        });

        if (response.ok) {
            // Re-fetch the data to refresh the tables and charts
            fetchComplaints(); 
        } else {
            alert("Failed to resolve the complaint. Check your Spring Boot backend.");
        }
    } catch (error) {
        console.error("Error resolving complaint:", error);
    }
}

async function deleteComplaint(id, btnElement) {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    try {
        const response = await fetch(`http://localhost:8080/api/complaints/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const row = btnElement.closest('tr');
            row.style.opacity = '0';
            setTimeout(() => {
                fetchComplaints(); // Refresh table and stats after deletion
            }, 300);
        } else {
            alert("Failed to delete the complaint.");
        }
    } catch (error) {
        console.error("Error deleting complaint:", error);
    }
}

function updateDashboardStats() {
    const total = complaintsState.length;
    const pending = complaintsState.filter(c => (c.status || '').toUpperCase() === 'PENDING').length;
    const inProgress = complaintsState.filter(c => (c.status || '').toUpperCase() === 'IN_PROGRESS').length;
    const resolved = complaintsState.filter(c => (c.status || '').toUpperCase() === 'RESOLVED').length;

    const statValues = document.querySelectorAll('.stat-value');
    if(statValues.length >= 4) {
        statValues[0].textContent = total;
        statValues[1].textContent = pending;
        statValues[2].textContent = inProgress;
        statValues[3].textContent = resolved;
    }
}
// ==========================================
// PROMOTION & DISCOUNT LOGIC
// ==========================================

// Make sure to attach the event listener when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('apply-promo-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyPromoCode);
    }
});

async function applyPromoCode() {
    // Get the code the user typed, remove extra spaces, and make it uppercase
    const codeInput = document.getElementById('promo-code-input').value.trim().toUpperCase();
    const messageEl = document.getElementById('promo-message');
    
    // Grab the current prices from the HTML
    const originalPrice = parseFloat(document.getElementById('original-price').textContent);
    
    if (!codeInput) {
        messageEl.textContent = "Please enter a code.";
        messageEl.style.color = "red";
        return;
    }

    try {
        // 1. Send the code to our Spring Boot Backend
        const response = await fetch(`http://localhost:8080/api/promotions/validate/${codeInput}`);
        
        if (response.ok) {
            // 2. The code is VALID! Get the discount percentage
            const promoData = await response.json();
            const discountPercent = promoData.discountPercentage; // e.g., 10.0
            
            // 3. Do the math
            const discountAmount = (originalPrice * (discountPercent / 100)).toFixed(2);
            const finalPrice = (originalPrice - discountAmount).toFixed(2);
            
            // 4. Update the HTML with the new prices
            document.getElementById('discount-amount').textContent = discountAmount;
            document.getElementById('final-price').textContent = finalPrice;
            
            // Show success message
            messageEl.textContent = `Success! ${discountPercent}% discount applied.`;
            messageEl.style.color = "green";

        } else {
            // The code is INVALID or INACTIVE. The backend sends back an error message.
            const errorText = await response.text();
            messageEl.textContent = errorText || "Invalid promo code.";
            messageEl.style.color = "red";
            
            // Reset the prices back to normal
            document.getElementById('discount-amount').textContent = "0.00";
            document.getElementById('final-price').textContent = originalPrice.toFixed(2);
        }
    } catch (error) {
        console.error("Error applying promo code:", error);
        messageEl.textContent = "Error connecting to the database.";
        messageEl.style.color = "red";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // 1. Trigger the popup after 3 seconds (3000 milliseconds)
    setTimeout(loadAndShowPopup, 3000);

    // 2. Setup Close Button
    document.getElementById('close-promo-btn').addEventListener('click', () => {
        document.getElementById('promo-modal-overlay').classList.remove('show');
        setTimeout(() => document.getElementById('promo-modal-overlay').classList.add('hidden'), 400);
    });

    // 3. Setup Copy Button
    document.getElementById('copy-code-btn').addEventListener('click', () => {
        const code = document.getElementById('popup-promo-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const copyBtn = document.getElementById('copy-code-btn');
            copyBtn.textContent = "Copied!";
            copyBtn.style.backgroundColor = "#27ae60"; // Turn green
            setTimeout(() => {
                copyBtn.textContent = "Copy Code";
                copyBtn.style.backgroundColor = "#f39c12"; // Revert to orange
            }, 2000);
        });
    });
});

async function loadAndShowPopup() {
    try {
        const response = await fetch('http://localhost:8080/api/promotions');
        const promotions = await response.json();
        const activePromo = promotions.find(p => p.active === true);

        if (activePromo) {
            document.getElementById('popup-discount-text').textContent = `${activePromo.discountPercentage}% OFF`;
            document.getElementById('popup-promo-code').textContent = activePromo.promoCode;
            
            // ==========================================
            // NEW TIMER LOGIC
            // ==========================================
            // Get the time from the database (e.g., activePromo.timeLimitInSeconds)
            // If the admin didn't set a time, default to 5 minutes (300 seconds)
            const timeLimit = activePromo.timeLimitInSeconds || 300; 
            
            // Start the ticking clock!
            startCountdown(timeLimit);
            // ==========================================

            const modalOverlay = document.getElementById('promo-modal-overlay');
            modalOverlay.classList.remove('hidden');
            setTimeout(() => modalOverlay.classList.add('show'), 10); 
        }
    } catch (error) {
        console.error("No active promotions found or database offline.");
    }
}
// A global variable to hold the timer so we can stop it later
let countdownInterval; 

function startCountdown(totalSeconds) {
    let timer = totalSeconds;
    const timerDisplay = document.getElementById('promo-timer-display');

    // Clear any existing timers so they don't overlap
    clearInterval(countdownInterval);

    // setInterval runs the code inside it every 1000 milliseconds (1 second)
    countdownInterval = setInterval(() => {
        // Calculate minutes and seconds
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        // Add a "0" in front of single digits (e.g., "05" instead of "5")
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Update the HTML
        timerDisplay.textContent = minutes + ":" + seconds;

        // Subtract 1 second. If it hits less than 0, the timer is done!
        if (--timer < 0) {
            clearInterval(countdownInterval); // Stop the clock
            timerDisplay.textContent = "EXPIRED";
            
            // Optional: Automatically close the popup when time runs out!
            document.getElementById('promo-modal-overlay').classList.remove('show');
            setTimeout(() => document.getElementById('promo-modal-overlay').classList.add('hidden'), 400);
        }
    }, 1000);
}