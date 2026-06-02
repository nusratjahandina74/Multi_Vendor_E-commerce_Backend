const { rateLimit } = require('express-rate-limit')
const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        message: "Too many registration attempts, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
})
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})
const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many refresh token attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})
module.exports = {registrationLimiter, loginLimiter, refreshLimiter, apiLimiter };