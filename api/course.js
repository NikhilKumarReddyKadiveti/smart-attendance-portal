const connectToDatabase = require('./utils/_db');

module.exports = async (req, res) => {
  const db = await connectToDatabase();
  
  if (req.method === 'POST') {
    const { courseName, facultyId } = req.body;
    await db.collection('courses').insertOne({
      courseName,
      facultyId,
      status: 'Open',
      createdAt: new Date()
    });
    return res.status(201).json({ success: true });
  }

  if (req.method === 'GET') {
    const { facultyId } = req.query;
    const courses = await db.collection('courses').find({ facultyId }).toArray();
    return res.status(200).json(courses);
  }
  
  if (req.method === 'PATCH') {
    const { courseId } = req.body;
    await db.collection('courses').updateOne(
      { _id: new ObjectId(courseId) },
      { $set: { status: 'Closed' } }
    );
    // Trigger Hall Ticket Generation Logic here
    return res.status(200).json({ success: true });
  }
};
