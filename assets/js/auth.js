// SDLC: Implementation Phase - Security Module
// Handles Authentication and Authorization

const Auth = {
    // Login Logic
    login: function(email, password) {
        const users = Storage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Create Session
            const session = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem(DB_SESSION, JSON.stringify(session));
            return { success: true, role: user.role };
        } else {
            return { success: false, message: "Invalid credentials" };
        }
    },

    // Check if user is logged in
    checkSession: function() {
        const session = localStorage.getItem(DB_SESSION);
        if (!session) {
            // Redirect to login if no session found (adjusting path based on depth)
            const path = window.location.pathname;
            if(!path.endsWith('login.html') && !path.endsWith('register.html') && !path.endsWith('index.html') && path !== '/') {
                 window.location.href = '../login.html';
            }
            return null;
        }
        return JSON.parse(session);
    },

    // Get Current User Data
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem(DB_SESSION));
    },

    // Logout
    logout: function() {
        localStorage.removeItem(DB_SESSION);
        window.location.href = '../login.html';
    }
};
