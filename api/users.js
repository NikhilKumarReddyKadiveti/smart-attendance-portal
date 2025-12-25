const connectToDatabase = require('./db');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();

    // GET: Get dashboard stats (Admin) or User Profile (Student)
    if (req.method === 'GET') {
        const { id, role } = req.query; // Simple query param check

        if (role === 'admin') {
            const studentCount = await db.collection('users').countDocuments({ role: 'student' });
            const facultyCount = await db.collection('users').countDocuments({ role: 'faculty' });
            const courseCount = await db.collection('courses').countDocuments();
            return res.status(200).json({ studentCount, facultyCount, courseCount });
        }
        
        if (id) {
             const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
             if(user) {
                 delete user.password; // Security
                 return res.status(200).json(user);
             }
        }
    }

    // POST: Create User (Admin Only)
    if (req.method === 'POST') {
        const { name, email, password, role, rollNumber } = req.body;
        
        // Basic check to prevent duplicate emails
        const existing = await db.collection('users').findOne({ email });
        if(existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role, // 'student' or 'faculty'
            rollNumber: role === 'student' ? rollNumber : null,
            createdAt: new Date()
        };

        await db.collection('users').insertOne(newUser);
        return res.status(201).json({ message: 'User created successfully' });
    }

    // PUT: Update Profile (Student password)
    if (req.method === 'PUT') {
        const { id, oldPassword, newPassword } = req.body;
        
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        if(!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: hashedPassword } }
        );

        return res.status(200).json({ message: 'Password updated' });
    }
};
