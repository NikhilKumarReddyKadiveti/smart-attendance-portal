const API_BASE = '/api';

// Utility to handle API calls with fetch
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    
    // Attach token if exists
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        // In a real app, send token. Here we simulate via session check or header
        headers['Authorization'] = `Bearer ${user.token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

// Redirect if not logged in
function checkAuth(requiredRole = null) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
        return;
    }
    if (requiredRole && user.role !== requiredRole) {
        alert("Unauthorized Access");
        window.location.href = '/login.html';
    }
    return user;
}

// Global Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Render dynamic navbar
function renderNav(user) {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <div style="font-weight: bold; font-size: 1.2rem;">Smart Attendance <span style="color:var(--primary)">Portal</span></div>
        <div style="display:flex; gap:15px; align-items:center;">
            <span>Hello, ${user.name}</span>
            <span class="logout-link" onclick="logout()">Logout</span>
        </div>
    `;
    document.body.prepend(nav);
}
