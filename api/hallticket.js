const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();
    const { studentId } = req.query;

    if (!studentId) return res.status(400).json({ error: 'Missing Student ID' });

    const student = await db.collection('users').findOne({ _id: new ObjectId(studentId) });
    
    // Logic: Fetch courses that are CLOSED and calculate eligibility
    const courses = await db.collection('courses').find({ 
        enrolledStudents: { $in: [studentId] },
        status: 'closed'
    }).toArray();

    const tickets = [];

    for (const course of courses) {
        const presentCount = await db.collection('attendance').countDocuments({
            courseId: course._id,
            presentStudents: { $in: [studentId] }
        });

        const percentage = course.totalClasses === 0 ? 0 : (presentCount / course.totalClasses) * 100;
        const eligible = percentage >= 75;

        tickets.push({
            studentName: student.name,
            rollNumber: student.rollNumber,
            courseName: course.name,
            percentage: percentage.toFixed(1),
            eligible: eligible
        });
    }

    return res.status(200).json(tickets);
};
