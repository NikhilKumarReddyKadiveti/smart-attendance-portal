const connectToDatabase = require('./db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
        const { studentId } = req.query;
        const fees = await db.collection('fees').find({ studentId }).toArray();
        // If no fee record, return a default mock one
        if(fees.length === 0) {
             return res.status(200).json([{
                 term: "Semester 1",
                 amount: 50000,
                 status: "Pending",
                 dueDate: "2024-12-31"
             }]);
        }
        return res.status(200).json(fees);
    }

    if (req.method === 'POST') {
        const { studentId, term, amount } = req.body;
        // Simulate payment
        const payment = {
            studentId,
            term,
            amount,
            status: "Paid",
            paidDate: new Date()
        };
        await db.collection('fees').insertOne(payment);
        return res.status(200).json({ message: "Payment Successful" });
    }
};
