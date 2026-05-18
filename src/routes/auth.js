const express = require('express');
const router = express.Router();
const { registrationController, loginController, refreshToken } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/verifyEmail');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name: { type: string, example: John Doe }
 *         email: { type: string, format: email, example: john@example.com }
 *         password: { type: string, format: password, example: securePassword123 }
 *         phone: { type: string, example: "+1234567890" }
 *         role: { type: string, enum: [customer, vendor, admin], default: customer, example: customer }
 *     
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: Registration Successfully Done }
 *         user:
 *           type: object
 *           properties:
 *             id: { type: string, example: 60d0fe4f5311236168a109ca }
 *             name: { type: string, example: John Doe }
 *             email: { type: string, example: john@example.com }
 *             role: { type: string, example: customer }
 * 
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email, example: john@example.com }
 *         password: { type: string, format: password, example: securePassword123 }
 * 
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: Login Successfully Done }
 *         accessToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *         user:
 *           type: object
 *           properties:
 *             id: { type: string, example: 60d0fe4f5311236168a109ca }
 *             name: { type: string, example: John Doe }
 *             email: { type: string, example: john@example.com }
 *             role: { type: string, example: customer }
 *             isEmailVerified: { type: boolean, example: false }
 * 
 *     # ---- NEW SUBSYSTEM RESPONSE SCHEMAS ADDED FOR REFRESH ENGINE ----
 *     RefreshSuccessResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         accessToken: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newAccessSignature..." }
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         message: { type: string, example: Internal server error }
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error or missing fields
 *       409:
 *         description: Email or Phone already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', registrationController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User Login Authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login Successful. HttpOnly Cookie 'refreshToken' has been set safely.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: refreshToken=abc123xyz...; Path=/; HttpOnly; Secure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing fields input validation error
 *       401:
 *         description: Invalid Credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   get:
 *     summary: Verify User Email Account & Redirect
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Cryptographic token.
 *         example: "abcdef1234567890verificationtoken"
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Target user validation account identity mapping checking rules.
 *         example: "john@example.com"
 *     responses:
 *       302:
 *         description: Verified successfully. Redirecting frontend portal link context.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "http://localhost:5173/verify-success?email=john@example.com"
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.get('/verify-email', verifyEmail);

/**
 * @swagger
 * /api/v1/auth/refreshToken:
 *   post:
 *     summary: Regenerate New Access Token via Session Rotation Cookie
 *     description: Read incoming HttpOnly cookies structure silently, maps session tracking token against active model profile records, validates signature matrix and grants a short lived accessToken signature parameter.
 *     tags: [Authentication]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The session validation cookie tracking entity mapping profiles.
 *         example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *     responses:
 *       200:
 *         description: Short-lived authentication credentials access granted token returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshSuccessResponse'
 *       400:
 *         description: No refresh token present inside application headers cookie space area configuration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access Forbidden. Invalid token / expired structural token context mismatch data logic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error execution trace logging errors failure.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refreshToken', refreshToken);

module.exports = router;


