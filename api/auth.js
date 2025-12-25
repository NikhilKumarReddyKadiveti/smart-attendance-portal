const connectToDatabase = require('./db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();

    if (req.method === 'POST') {
        const { email, password } = req.body;

        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            rollNumber: user.rollNumber || null
        };

        return res.status(200).json(userData);
    }

    res.status(405).json({ error: 'Method not allowed' });
};
