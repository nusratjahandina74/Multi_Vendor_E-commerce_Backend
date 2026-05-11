const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
exports.registrationController = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body

        //Simple Validation

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            })
        }

        //Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email."
            })
        }

        //Create User
        const user = new User({
            name: name,
            email: email,
            password: password,
            phone: phone || undefined,
            role: role || 'customer'
        })

        //Save User
        await user.save()
        return res.status(201).send({
            success: true,
            message: "Registration Successfully Done",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}