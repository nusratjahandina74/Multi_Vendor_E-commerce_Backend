const jwt = require('jsonwebtoken')
const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid token"
        });
    }
}

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }
        next()

    }
}
module.exports = {protect, restrictTo}