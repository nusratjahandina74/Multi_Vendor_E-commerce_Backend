const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    approvedVendor,
    getAllVendors,
    getApprovedVendors,
    getRejectedVendors,
    getPendingVendors,
    rejectVendor,
    getAllUsers,
    getAdminStats
} = require('../controllers/adminController');

/**
 * @swagger
 * components:
 *   schemas:
 *     BankInformation:
 *       type: object
 *       properties:
 *         bankName: { type: string, example: "Dutch-Bangla Bank" }
 *         branchName: { type: string, example: "Tejgaon Branch" }
 *         accountNumber: { type: string, example: "1234567890123" }
 *         accountHolder: { type: string, example: "Alex Green Enterprises" }
 * 
 *     VendorAdminView:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "651c6c5a3d7b42001f3e721b" }
 *         name: { type: string, example: "Alex Green" }
 *         email: { type: string, example: "vendor@ecobazar.com" }
 *         phone: { type: string, example: "+8801700000000" }
 *         role: { type: string, example: "vendor" }
 *         isEmailVerified: { type: boolean, example: true }
 *         shopName: { type: string, example: "EcoMarket Hub" }
 *         shopDescription: { type: string, example: "Premium organic vegetables and herbal products." }
 *         shopAddress: { type: string, example: "Tejgaon Industrial Area, Dhaka" }
 *         shopLogo: { type: string, example: "https://cloudinary.com" }
 *         nidNumber: { type: string, example: "19942615847321" }
 *         bankInfo:
 *           $ref: '#/components/schemas/BankInformation'
 *         status: { type: string, enum: [pending, approved, rejected, suspended], example: "pending" }
 *         approvedAt: { type: string, format: date-time, example: "2026-06-15T15:00:00.000Z" }
 *         rejectReason: { type: string, example: "Documents verification failed." }
 *         createdAt: { type: string, format: date-time, example: "2026-06-15T15:00:00.000Z" }
 * 
 *     UserAdminView:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "651c6c5a3d7b42001f3e721a" }
 *         name: { type: string, example: "John Customer" }
 *         email: { type: string, example: "customer@example.com" }
 *         role: { type: string, enum: [customer, vendor, admin], example: "customer" }
 *         status: { type: string, example: "approved" }
 *         createdAt: { type: string, format: date-time, example: "2026-06-15T12:00:00.000Z" }
 * 
 *     AdminStatsResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         data:
 *           type: object
 *           properties:
 *             totalUsers: { type: number, example: 1250 }
 *             totalVendors: { type: number, example: 45 }
 *             pendingVendors: { type: number, example: 8 }
 *             totalSales: { type: number, example: 15420.50 }
 */

// All admin routes are globally locked by auth + Only admin role signature
router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * /api/v1/admin/vendors/pending:
 *   get:
 *     summary: Get all pending vendor accounts awaiting review
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched pending applications data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 3 }
 *                 message: { type: string, example: "Pending Vendors" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorAdminView'
 *       401:
 *         description: Unauthorized - Token missing or expired
 *       403:
 *         description: Forbidden - Lacks admin privileges
 *       500:
 *         description: Internal server error
 */
router.get('/vendors/pending', getPendingVendors);
/**
 * @swagger
 * /api/v1/admin/vendors/all:
 *   get:
 *     summary: Fetch all registered vendors across all lifecycles
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Global vendor matrix list returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 25 }
 *                 message: { type: string, example: "All Vendors" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorAdminView'
 */
router.get('/vendors/all', getAllVendors);
/**
 * @swagger
 * /api/v1/admin/vendors/approved:
 *   get:
 *     summary: Fetch list of verified approved active vendor stores
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Verified active store profiles dataset array returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 18 }
 *                 message: { type: string, example: "Get Approved Vendors" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorAdminView'
 */
router.get('/vendors/approved', getApprovedVendors);
/**
 * @swagger
 * /api/v1/admin/vendors/rejected:
 *   get:
 *     summary: Retrieve list of onboarding rejected vendor profiles
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rejected vendor entities retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 4 }
 *                 message: { type: string, example: "Get Rejected Vendors" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VendorAdminView'
 */
router.get('/vendors/rejected', getRejectedVendors);
/**
 * @swagger
 * /api/v1/admin/vendors/{id}/approved:
 *   patch:
 *     summary: Verify and approve a vendor onboarding request
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Valid BSON MongoDB Document ObjectId identifier of target vendor.
 *         example: "651c6c5a3d7b42001f3e721b"
 *     responses:
 *       200:
 *         description: Vendor onboarding verified and approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Vendor Approved" }
 *       400:
 *         description: Bad request - Profile mismatch or resource not found.
 */
router.patch('/vendors/:id/approved', approvedVendor);
/**
 * @swagger
 * /api/v1/admin/vendors/{id}/reject:
 *   patch:
 *     summary: Decline a pending vendor application request with reason comments
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identity Object ID of the target pending vendor document.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Explanation detailing why validation failed parameters.
 *                 example: "Provided NID number validation failed against official records."
 *     responses:
 *       200:
 *         description: Application safely rejected and justification logged.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Vendor Rejected Successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/VendorAdminView'
 *       400:
 *         description: Validation error - Rejection justification missing.
 *       404:
 *         description: Profile not found or already verified.
 */
router.patch('/vendors/:id/reject', rejectVendor);
/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Retrieve marketplace dashboard statistics and analytics overview
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytical system operational statistics parameters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStatsResponse'
 */
router.get('/stats', getAdminStats);
/**
 * @swagger
 * /api/v1/admin/users/all:
 *   get:
 *     summary: Fetch list of all registered platform user accounts globally
 *     tags: [Admin Dashboard Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Complete platform membership accounts database fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 340 }
 *                 message: { type: string, example: "All Users" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAdminView'
 */
router.get('/users/all', getAllUsers);


module.exports = router;
