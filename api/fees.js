const connectToDatabase = require('./utils/_db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const db = await connectToDatabase();

  if (req.method === 'GET') {
    const { studentId } = req.query;
    const feeData = await db.collection('fees').findOne({ studentId });
    return res.status(200).json(feeData || { status: 'Pending', amount: 5000 });
  }

  if (req.method === 'POST') {
    const { studentId, amount } = req.body;
    await db.collection('fees').updateOne(
      { studentId },
      { $set: { amount, status: 'Paid', date: new Date() } },
      { upsert: true }
    );
    return res.status(200).json({ success: true });
  }
};
