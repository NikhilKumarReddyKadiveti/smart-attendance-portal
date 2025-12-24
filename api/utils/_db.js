const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let dbConnection;

module.exports = async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  try {
    await client.connect();
    dbConnection = client.db('smart_attendance');
    console.log("Connected to MongoDB Atlas");
    return dbConnection;
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw error;
  }
};
