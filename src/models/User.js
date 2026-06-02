const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: 2
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: [{
        token: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    expiresAt: {
        type: Date
    },
    shopName: {
        type: String,
        unique: true,
        sparse: true
    },
    shopDescription: {
        type: String,
        trim: true,
        maxLength: 1000
    },
    shopAddress: {
        type: String,
        trim: true
    },
    shopLogo: {
        type: String
    },
    nidNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    bankInfo: {
        bankName: String,
        branchName: String,
        accountNumber: String,
        accountHolder: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'customer'
    },
    approvedAt: {
        type: Date
    },
    rejectReason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true })

//Password Hash
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('role') && this.role !== 'vendor') {
            this.status = 'pending'
        }
        if (this.role !== 'vendor') {
            this.status = 'customer'
            this.shopName = 'undefined'
        }
        next()
    } catch (error) {
        next(error)
    }
})

//Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}
module.exports = mongoose.model('User', userSchema)