const mongoose = require('mongoose')
const dbConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error('Database Connection Error:', error.message);
    }
}
module.exports = dbConfig