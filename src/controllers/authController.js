const User = require('../models/User')
const VerificationToken = require('../models/VerificationToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create User
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone || undefined,
            role: role || 'customer'
        })

        //Save User
        await user.save()

        //Create verification token
        const token = uuidv4()
        await new VerificationToken({ userId: user._id, token }).save()

        //Send Email
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const verificationUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}&email=${user.email}`
        const mailOption = {
            from: `"Multivendor Shop",<${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify your Email - Multivendor Ecommerce',
            html:
                `<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased"><table border=0 cellpadding=0 cellspacing=0 style="background-color:#f4f6f9;padding:40px 0"width=100%><tr><td align=center><table border=0 cellpadding=0 cellspacing=0 style="background-color:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.05)"width=600><tr><td align=center style="background-color:#1e293b;padding:30px 20px"><h1 style=color:#fff;margin:0;font-size:26px;font-weight:700;letter-spacing:1px><span style=color:#3b82f6>Multi</span>Market</h1><p style="color:#94a3b8;margin:5px 0 0 0;font-size:13px">Your Premium Multi-Vendor Marketplace<tr><td style="padding:40px 30px;background-color:#fff"><h2 style=color:#1e293b;margin-top:0;font-size:22px;font-weight:600>Welcome to Our Marketplace!</h2><p style=color:#475569;font-size:15px;line-height:1.6;margin-bottom:25px>Hello, ${user.name}<br>Thank you for registering with us. To complete your account setup and start exploring thousands of products (or setting up your shop), please verify your email address.<table border=0 cellpadding=0 cellspacing=0 style=margin-bottom:30px width=100%><tr><td align=center><a href=${verificationUrl} style="background-color:#3b82f6;color:#fff;text-decoration:none;padding:14px 30px;font-size:16px;font-weight:600;border-radius:6px;display:inline-block;box-shadow:0 4px 6px rgba(59,130,246,.2)"target=_blank>Verify Email Address</a></table><p style=color:#475569;font-size:14px;line-height:1.6>If the button above doesn't work, copy and paste the following link into your web browser:<p style=margin:0;font-size:13px;word-break:break-all><a href=${verificationUrl} style=color:#3b82f6;text-decoration:underline target=_blank>${verificationUrl}</a><hr style="border:0;border-top:1px solid #e2e8f0;margin:30px 0"><p style=color:#64748b;font-size:13px;line-height:1.5;margin:0><strong>Note:</strong> This verification link will expire in 24 hours. If you did not create an account, no further action is required.<tr><td style="background-color:#f8fafc;padding:30px;text-align:center;border-top:1px solid #e2e8f0"><p style="color:#64748b;font-size:13px;margin:0 0 10px 0">© 2026 MultiMarket Inc. All rights reserved.<p style=color:#94a3b8;font-size:12px;margin:0>Dhaka, Bangladesh | <a href=# style=color:#64748b;text-decoration:underline>Privacy Policy</a> | <a href=# style=color:#64748b;text-decoration:underline>Support</a></table></table></body>`
        }

        try {
            await transporter.sendMail(mailOption)
            console.log('Email Send');
        } catch (error) {
            console.error("Email send error:", error);
        }

        return res.status(201).json({
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
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        //Simple Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            })
        }
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        //Generate Token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIREY }
        )
        const refreshToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIREY }
        )

        //Save refresh token to user
        user.refreshToken.push({
            token: refreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        await user.save()
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })
        return res.status(200).json({
            success: true,
            message: "Login Successfully Done",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        })
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookie?.refreshToken
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token found inside application contexts"
            })
        }

        //Find user with refresh Token
        const user = await User.findOne({
            refreshToken: {
                $eleMatch: {
                    token: refreshToken
                }
            }
        })
        if (!user) {
            res.clearCookie(refreshToken)
            return res.status(403).json({
                success: false,
                message: "Invalid session identity match tracking"
            })
        }

        //Verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                res.clearCookie(refreshToken)
                return res.status(403).json({
                    success: false,
                    message: "Invalid or refresh token expires"
                })
            }
        })
        const newAccessToken = jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIREY || '15m'}
    )
    return res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })
    } catch (error) {
        console.error("Refresh token Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}