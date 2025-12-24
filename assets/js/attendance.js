// SDLC: Implementation Phase - Business Logic Layer
// This file handles specific attendance rules, calculations, and formatting.

const Attendance = {
    /**
     * Calculate Attendance Percentage for a specific student
     * @param {number|string} studentId 
     * @returns {number} Percentage (0-100)
     */
    calculatePercentage: function(studentId) {
        const records = Storage.getAttendance();
        // Filter records belonging to this student
        const studentRecords = records.filter(r => r.studentId == studentId);
        
        if (studentRecords.length === 0) return 0;

        const presentCount = studentRecords.filter(r => r.status === 'Present').length;
        return Math.round((presentCount / studentRecords.length) * 100);
    },

    /**
     * Check if attendance is below the threshold (Smart Feature)
     * @param {number|string} studentId 
     * @returns {boolean} True if warning needed
     */
    isLowAttendance: function(studentId) {
        return this.calculatePercentage(studentId) < 75;
    },

    /**
     * Helper to get CSS class for status
     * @param {string} status 'Present' or 'Absent'
     * @returns {string} Bootstrap text class
     */
    getStatusClass: function(status) {
        return status === 'Present' ? 'text-success fw-bold' : 'text-danger fw-bold';
    },

    /**
     * Get formatted history for a student
     * @param {number|string} studentId 
     * @returns {Array} Sorted records
     */
    getStudentHistory: function(studentId) {
        const records = Storage.getAttendance();
        return records.filter(r => r.studentId == studentId).reverse();
    }
};
