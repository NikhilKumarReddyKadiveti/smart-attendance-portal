const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();

    // GET: List courses
    if (req.method === 'GET') {
        const { facultyId, studentId } = req.query;

        if (facultyId) {
            const courses = await db.collection('courses').find({ facultyId }).toArray();
            return res.status(200).json(courses);
        }
        
        if (studentId) {
            // Find courses where student is in 'enrolledStudents' array
            const courses = await db.collection('courses').find({ 
                enrolledStudents: { $in: [studentId] },
                status: 'open' // Only show active courses for attendance view usually
            }).toArray();
            return res.status(200).json(courses);
        }
    }

    // POST: Create Course (Faculty)
    if (req.method === 'POST') {
        const { name, code, facultyId } = req.body;
        // Fetch all students to assign (simplified for this project) or manual assign
        // Here we assume Faculty selects ALL students for simplicity or adds ID
        // For this demo, let's auto-enroll ALL students to test easier
        const allStudents = await db.collection('users').find({ role: 'student' }).toArray();
        const studentIds = allStudents.map(s => s._id.toString());

        const newCourse = {
            name,
            code,
            facultyId,
            enrolledStudents: studentIds, // Array of Student IDs
            status: 'open',
            totalClasses: 0
        };

        await db.collection('courses').insertOne(newCourse);
        return res.status(201).json({ message: 'Course created and students enrolled' });
    }
    
    // PUT: Close Course
    if (req.method === 'PUT') {
        const { courseId, status } = req.body;
        await db.collection('courses').updateOne(
            { _id: new ObjectId(courseId) },
            { $set: { status } }
        );
        return res.status(200).json({ message: 'Course status updated' });
    }
};
