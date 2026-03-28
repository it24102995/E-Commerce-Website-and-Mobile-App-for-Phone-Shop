let editingId = null;
let allUsers = [];

// ─── Load all users ───────────────────────────────────────
async function loadUsers() {
    try {
        const response = await fetch('/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const result = await response.json();
        // Handle both wrapped and unwrapped responses
        allUsers = result.data || (Array.isArray(result) ? result : []);
        renderUsersTable(allUsers);
        updateStats();
    } catch (error) {
        showToastGlobal('Error loading users: ' + error.message, 'error');
        console.error(error);
    }
}

// ─── Render users in table ──────────────────────────────────
function renderUsersTable(users) {
    const tbody = document.getElementById('userTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map((user, index) => `
        <tr>
            <td><strong>#${user.id}</strong></td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="role-pill ${user.role === 'ADMIN' ? 'admin' : 'user'}">
                    <i class="fa-solid fa-${user.role === 'ADMIN' ? 'shield-halved' : 'user'}"></i>
                    ${user.role}
                </span>
            </td>
            <td><span class="status-badge active">Active</span></td>
            <td>
                <button class="btn-edit btn-sm" onclick="editUser(${user.id})" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-delete btn-sm" onclick="deleteUserConfirm(${user.id})" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ─── Handle form submission ──────────────────────────────────
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('uName').value.trim();
    const email = document.getElementById('uEmail').value.trim();
    const password = document.getElementById('uPassword').value;
    const role = document.getElementById('uRole').value;
    
    // Validation
    if (!name || !email || !role) {
        showToastGlobal('All fields are required', 'error');
        return;
    }

    if (!editingId && !password) {
        showToastGlobal('Password is required for new users', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToastGlobal('Please enter a valid email', 'error');
        return;
    }
    
    if (editingId) {
        // Update user (only name and role)
        await updateUser(editingId, name, role);
    } else {
        // Create new user
        await createUser(name, email, password, role);
    }
}

// ─── Create new user ────────────────────────────────────────
async function createUser(name, email, password, role) {
    try {
        const response = await fetch('/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToastGlobal('User created successfully', 'success');
            resetForm();
            loadUsers();
            updateStats();
        } else {
            showToastGlobal(data.message || 'Failed to create user', 'error');
        }
    } catch (error) {
        showToastGlobal('Error creating user: ' + error.message, 'error');
        console.error(error);
    }
}

// ─── Edit user (populate form) ───────────────────────────────
async function editUser(id) {
    try {
        const response = await fetch(`/admin/users/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        
        const user = data.data;
        document.getElementById('editId').value = id;
        document.getElementById('uName').value = user.name;
        document.getElementById('uEmail').value = user.email;
        document.getElementById('uEmail').disabled = true;
        document.getElementById('uPassword').value = '';
        document.getElementById('uPassword').disabled = true;
        document.getElementById('uPassword').placeholder = 'Password cannot be changed via edit';
        document.getElementById('uRole').value = user.role;
        
        document.getElementById('formTitle').innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit User`;
        document.getElementById('submitBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update User`;
        
        editingId = id;
        
        // Scroll to form
        document.querySelector('.admin-card').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showToastGlobal('Error loading user: ' + error.message, 'error');
        console.error(error);
    }
}

// ─── Update user ────────────────────────────────────────────
async function updateUser(id, name, role) {
    try {
        const response = await fetch(`/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToastGlobal('User updated successfully', 'success');
            resetForm();
            loadUsers();
            updateStats();
        } else {
            showToastGlobal(data.message || 'Failed to update user', 'error');
        }
    } catch (error) {
        showToastGlobal('Error updating user: ' + error.message, 'error');
        console.error(error);
    }
}

// ─── Delete user (with confirmation) ─────────────────────────
function deleteUserConfirm(id) {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`)) {
        deleteUser(id);
    }
}

// ─── Delete user request ────────────────────────────────────
async function deleteUser(id) {
    try {
        const response = await fetch(`/admin/users/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToastGlobal('User deleted successfully', 'success');
            loadUsers();
            updateStats();
        } else {
            showToastGlobal(data.message || 'Failed to delete user', 'error');
        }
    } catch (error) {
        showToastGlobal('Error deleting user: ' + error.message, 'error');
        console.error(error);
    }
}

// ─── Reset form ──────────────────────────────────────────────
function resetForm() {
    const form = document.getElementById('userForm');
    if (form) form.reset();
    
    document.getElementById('editId').value = '';
    
    const uEmail = document.getElementById('uEmail');
    if (uEmail) {
        uEmail.disabled = false;
        uEmail.value = '';
    }
    
    const uPassword = document.getElementById('uPassword');
    if (uPassword) {
        uPassword.disabled = false;
        uPassword.placeholder = 'Enter password';
        uPassword.value = '';
    }
    
    const uRole = document.getElementById('uRole');
    if (uRole) uRole.value = '';
    
    document.getElementById('formTitle').innerHTML = `<i class="fa-solid fa-user-plus"></i> Add New User`;
    document.getElementById('submitBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save User`;
    
    editingId = null;
}

// ─── Filter table by search ───────────────────────────────────
function filterTable() {
    const searchTerm = document.getElementById('tblSearch').value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    renderUsersTable(filtered);
}

// ─── Update statistics ───────────────────────────────────────
function updateStats() {
    const totalUsers = allUsers.length;
    const adminCount = allUsers.filter(u => u.role === 'ADMIN').length;
    const userCount = allUsers.filter(u => u.role === 'USER').length;
    
    const stTotal = document.getElementById('st-total');
    const stAdmin = document.getElementById('st-admin');
    const stUsers = document.getElementById('st-users');
    
    if (stTotal) stTotal.textContent = totalUsers;
    if (stAdmin) stAdmin.textContent = adminCount;
    if (stUsers) stUsers.textContent = userCount;
}

// ─── Utility: Escape HTML ─────────────────────────────────────
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ─── Utility: Validate email ──────────────────────────────────
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
