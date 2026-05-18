const mongoose = require('mongoose')
const { Schema } = mongoose
const verificationTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
})
module.exports = mongoose.model('VerificationToken', verificationTokenSchema)