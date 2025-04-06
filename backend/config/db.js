/**
 * @author: Jam Furaque
 */

// DON'T PAY TOO MUCH ATTENTION TO THIS FILE, 
// IT'S JUST MY CONNECTION TO THE DATABASE.

const mongoose = require('mongoose');
const databaseConnection = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    });
    console.log('Database connected');
} catch (error) {
    console.log('Database connection failed');
    process.exit(1);
}};

module.exports = databaseConnection;