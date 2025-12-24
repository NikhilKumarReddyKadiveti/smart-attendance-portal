const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let dbConnection;

module.exports = async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  await client.connect();
  dbConnection = client.db('smart_attendance');
  return dbConnection;
};
