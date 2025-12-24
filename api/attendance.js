const connectToDatabase = require('./utils/_db');

module.exports = async (req, res) => {
  const db = await connectToDatabase();

  if (req.method === 'POST') {
    const { courseId, date, records } = req.body;
    await db.collection('attendance').insertOne({
      courseId,
      date,
      records // Array of { studentId, status }
    });
    res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { studentId } = req.query;
    // Aggregation to find student attendance %
    const logs = await db.collection('attendance').find({ "records.studentId": studentId }).toArray();
    res.status(200).json(logs);
  }
};
