const connectToDatabase = require('./utils/_db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const db = await connectToDatabase();
  const { method } = req;

  switch (method) {
    case 'GET': // Fetch User Data
      const { id } = req.query;
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      res.status(200).json(user);
      break;

    case 'POST': // Create User (Admin Only)
      const newUser = req.body;
      const result = await db.collection('users').insertOne(newUser);
      res.status(201).json({ success: true, id: result.insertedId });
      break;

    case 'PUT': // Update Profile
      const { userId, ...updateData } = req.body;
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      res.status(200).json({ success: true });
      break;

    default:
      res.status(405).end();
  }
};
