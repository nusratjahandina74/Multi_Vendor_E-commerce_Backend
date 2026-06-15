const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [2, "Name must be at least 2 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false 
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
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
        token: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    shopName: {
        type: String,
        unique: true,
        sparse: true, 
        trim: true
    },
    shopDescription: {
        type: String,
        trim: true,
        maxLength: [1000, "Description cannot exceed 1000 characters"]
    },
    shopAddress: {
        type: String,
        trim: true
    },
    shopLogo: {
        type: String,
        default: ""
    },
    nidNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    bankInfo: {
        bankName: { type: String, trim: true },
        branchName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        accountHolder: { type: String, trim: true }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'approved' 
    },
    approvedAt: {
        type: Date
    },
    rejectReason: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

//Password Hash
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
userSchema.pre('save', async function (next) {
    try {
        
        if (this.isNew && this.role === 'vendor') {
            this.status = 'pending'; 
        }

        if (this.role !== 'vendor') {
            this.status = 'approved'; 
            this.shopName = undefined;
            this.shopDescription = undefined;
            this.shopAddress = undefined;
            this.shopLogo = undefined;
            this.nidNumber = undefined;
            this.bankInfo = undefined;
        }
        next();
    } catch (error) {
        next(error);
    }
});
//Compare Password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
