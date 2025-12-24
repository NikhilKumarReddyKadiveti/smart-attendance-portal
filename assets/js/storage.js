// SDLC: Implementation Phase - Data Persistence Layer
// This file simulates a database using the browser's LocalStorage API.

const DB_USERS = 'sap_users';
const DB_ATTENDANCE = 'sap_attendance';
const DB_SESSION = 'sap_session';

const Storage = {
    // SDLC: Requirement - System Initialization
    init: function() {
        if (!localStorage.getItem(DB_USERS)) {
            // Seed initial data if empty
            const initialUsers = [
                { id: 1, name: 'System Admin', email: 'admin@college.edu', password: 'admin', role: 'admin' },
                { id: 2, name: 'Dr. Smith', email: 'faculty@college.edu', password: '123', role: 'faculty' }
            ];
            localStorage.setItem(DB_USERS, JSON.stringify(initialUsers));
            console.log("Database initialized with seed data.");
        }
        if (!localStorage.getItem(DB_ATTENDANCE)) {
            localStorage.setItem(DB_ATTENDANCE, JSON.stringify([]));
        }
    },

    // User Operations
    getUsers: function() {
        return JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    },

    saveUser: function(user) {
        const users = this.getUsers();
        user.id = Date.now(); // Auto-increment simulation
        users.push(user);
        localStorage.setItem(DB_USERS, JSON.stringify(users));
        return user;
    },

    getStudents: function() {
        return this.getUsers().filter(u => u.role === 'student');
    },

    // Attendance Operations
    getAttendance: function() {
        return JSON.parse(localStorage.getItem(DB_ATTENDANCE) || '[]');
    },

    saveAttendance: function(record) {
        const data = this.getAttendance();
        record.id = Date.now();
        record.timestamp = new Date().toISOString();
        data.push(record);
        localStorage.setItem(DB_ATTENDANCE, JSON.stringify(data));
    },

    // Statistics
    getStats: function() {
        const users = this.getUsers();
        const attendance = this.getAttendance();
        return {
            totalStudents: users.filter(u => u.role === 'student').length,
            totalFaculty: users.filter(u => u.role === 'faculty').length,
            totalRecords: attendance.length
        };
    }
};

// Initialize on load
Storage.init();
