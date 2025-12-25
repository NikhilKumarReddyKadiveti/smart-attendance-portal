const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();

    // POST: Mark Attendance
    if (req.method === 'POST') {
        const { courseId, date, presentStudentIds } = req.body;

        const record = {
            courseId: new ObjectId(courseId),
            date: new Date(date),
            presentStudents: presentStudentIds, // Array of IDs who were present
        };

        await db.collection('attendance').insertOne(record);
        
        // Increment total classes for the course
        await db.collection('courses').updateOne(
            { _id: new ObjectId(courseId) },
            { $inc: { totalClasses: 1 } }
        );

        return res.status(200).json({ message: 'Attendance marked' });
    }

    // GET: Get Student Attendance Summary
    if (req.method === 'GET') {
        const { studentId } = req.query;

        // 1. Get all courses student is enrolled in
        const courses = await db.collection('courses').find({ 
            enrolledStudents: { $in: [studentId] } 
        }).toArray();

        const summary = [];

        for (const course of courses) {
            // 2. Count how many times this student ID appears in attendance for this course
            const presentCount = await db.collection('attendance').countDocuments({
                courseId: course._id,
                presentStudents: { $in: [studentId] }
            });

            const total = course.totalClasses || 0;
            const percentage = total === 0 ? 0 : ((presentCount / total) * 100).toFixed(1);

            summary.push({
                courseName: course.name,
                courseId: course._id,
                totalClasses: total,
                attended: presentCount,
                percentage: parseFloat(percentage),
                status: course.status
            });
        }

        return res.status(200).json(summary);
    }
};
