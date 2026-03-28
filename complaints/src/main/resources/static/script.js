// Global state to hold complaints for searching and rendering
let complaintsState = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 2. Initialize Dashboard if we are already logged in (for testing)
    // If you want to bypass login during development, you can uncomment the next two lines:
    // document.getElementById('login-container').classList.add('hidden');
    // showDashboard();
});

// ==========================================
// LOGIN & NAVIGATION LOGIC
// ==========================================
function handleLogin(e) {
    e.preventDefault();
    // Dummy login validation - replace with real auth if needed
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user && pass) {
        document.getElementById('login-container').classList.add('hidden');
        showDashboard();
    } else {
        document.getElementById('login-error').textContent = 'Invalid credentials';
    }
}

function showDashboard() {
    document.getElementById('dashboard-container').classList.remove('hidden');
    initializeDashboard();
    fetchComplaints(); // Fetch data from Spring Boot when dashboard loads
}

function initializeDashboard() {
    // Populate the Staff Dropdown list
    populateStaffDropdown();

    // Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.panel-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => {
                sec.classList.remove('active');
                sec.classList.add('hidden');
            });

            // Add active class to clicked nav and target section
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }
            
            // Update Header Title dynamically
            document.getElementById('dynamic-title').textContent = item.textContent.trim();
        });
    });

    // Form Submission for New Complaints
    const newComplaintForm = document.getElementById('new-complaint-form');
    if (newComplaintForm) {
        newComplaintForm.addEventListener('submit', handleNewComplaint);
    }

    // Toggle Switch Text Logic (Assigned / Unassigned)
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
// NEW FEATURE: POPULATE STAFF DROPDOWN
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

// ==========================================
// NEW FEATURE: UNIFIED SEARCH FUNCTION
// ==========================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter the state array based on ID, H-Code, Customer Name, or Status
    const filteredComplaints = complaintsState.filter(tkt => {
        return (
            (tkt.ticketId && tkt.ticketId.toLowerCase().includes(searchTerm)) ||
            (tkt.hTrackingNumber && tkt.hTrackingNumber.toLowerCase().includes(searchTerm)) ||
            (tkt.customerName && tkt.customerName.toLowerCase().includes(searchTerm)) ||
            (tkt.status && tkt.status.toLowerCase().includes(searchTerm))
        );
    });

    // Render the table with only the filtered data
    renderComplaintsTable(filteredComplaints);
}

// ==========================================
// DATA FETCHING & RENDERING (SPRING BOOT INTEGRATION)
// ==========================================

// 1. Fetch from database
async function fetchComplaints() {
    try {
        // UPDATE THIS URL IF YOUR SPRING BOOT PORT/ENDPOINT IS DIFFERENT
        const response = await fetch('http://localhost:8080/api/complaints');
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        complaintsState = data; // Save to global state for searching
        
        renderComplaintsTable();
        updateDashboardStats();
    } catch (error) {
        console.error("Error fetching complaints:", error);
    }
}

// 2. Render Table (WITH THE EXACT 9-COLUMN FIX)
function renderComplaintsTable(dataToRender = complaintsState) {
    const tbody = document.getElementById('complaints-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = ''; 

    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 20px;">No complaints found.</td></tr>`;
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
                <button class="delete-btn" onclick="deleteComplaint(${tkt.id}, this)" title="Delete Complaint" style="background: none; border: none; cursor: pointer;">
                    <i class="fas fa-trash-alt" style="color: #777; font-size: 16px; transition: color 0.2s;"></i>
                </button>
            </td>
        `;
        
        setTimeout(() => row.style.opacity = '1', 50 * index);
    });
}

// 3. Handle Form Submission (Saving to Spring Boot)
async function handleNewComplaint(e) {
    e.preventDefault();

    const form = e.target;

    // --- NEW VALIDATION CHECK ---
    // This forces the HTML pattern/regex rules to trigger before sending data
    if (!form.checkValidity()) {
        form.reportValidity(); // Shows the popup errors
        return; // Stops the function right here
    }
    // ----------------------------

    const formData = new FormData(form);
    
    const isAssigned = document.getElementById('assigned-toggle').checked;
    const assignedStaff = isAssigned ? formData.get('assigned_staff') : "Unassigned";

    // Build the object exactly how Complaint.java expects it
    const newComplaint = {
        customerName: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone_number'),
        orderId: formData.get('order_id'),
        productName: formData.get('product_name'),         // NEW: Grabs the selected phone from dropdown!
        hTrackingNumber: formData.get('h_tracking_number'), // Grabs the H-Code
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComplaint)
        });

        if (response.ok) {
            alert('Complaint registered successfully!');
            form.reset();
            // Go back to all complaints section
            document.querySelector('.nav-item[data-target="all-complaints-section"]').click();
            fetchComplaints(); // Refresh the table data
        } else {
            alert('Error saving complaint. Please check your backend.');
        }
    } catch (error) {
        console.error("Error posting complaint:", error);
        alert('Network error. Is your Spring Boot server running?');
    }
}

// 4. Delete Complaint
async function deleteComplaint(id, btnElement) {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    try {
        const response = await fetch(`http://localhost:8080/api/complaints/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove from local state array
            complaintsState = complaintsState.filter(c => c.id !== id);
            // Re-render table
            renderComplaintsTable();
            updateDashboardStats();
            
            // Optional: visual deletion animation on the row
            const row = btnElement.closest('tr');
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        } else {
            alert("Failed to delete the complaint.");
        }
    } catch (error) {
        console.error("Error deleting complaint:", error);
    }
}

// 5. Update Dashboard Statistics
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