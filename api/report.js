const connectToDatabase = require('./utils/_db');

module.exports = async (req, res) => {
  const db = await connectToDatabase();
  
  try {
    const studentCount = await db.collection('users').countDocuments({ role: 'student' });
    const facultyCount = await db.collection('users').countDocuments({ role: 'faculty' });
    const courseCount = await db.collection('courses').countDocuments();
    
    res.status(200).json({
      students: studentCount,
      faculty: facultyCount,
      courses: courseCount
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};
