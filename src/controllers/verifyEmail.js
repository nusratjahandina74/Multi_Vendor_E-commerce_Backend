const User = require('../models/User')
const verificationToken = require('../models/VerificationToken');
exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query
    try {
        const matchedToken = await verificationToken.findOne({ token });
        if (!matchedToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }
        const user = await User.findById(matchedToken.userId);
        if (!user || user.email !== email) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            })
        }
        user.isEmailVerified = true;
        await user.save();
        await verificationToken.deleteOne({_id: matchedToken._id});

    //Frontend Redirect Url
    return res.redirect(`${process.env.FRONTEND_URL}/verify-success?email=${email}`);

    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}