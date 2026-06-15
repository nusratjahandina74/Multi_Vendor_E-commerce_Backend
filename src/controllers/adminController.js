const User = require("../models/User")


exports.getPendingVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'pending'
        }).select('name email shopName shopAddress nidNumber createdAt')
        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
            message: "Pending Vendors",
        })
    } catch (error) {
        console.error("Get Pending Vendors Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
        }).select('name email shopName status shopAddress approvedAt rejectReason nidNumber createdAt')
        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
            message: "All Vendors",
        })
    } catch (error) {
        console.error("Get All Vendors Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
exports.getApprovedVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'approved'
        }).select('name email shopName shopAddress nidNumber approvedAt createdAt')
        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
            message: "Get Approved Vendors",
        })
    } catch (error) {
        console.error("Get Approved Vendors Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
exports.getRejectedVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'rejected'
        }).select('name email shopName shopAddress nidNumber approvedAt rejectReason createdAt')
        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors,
            message: "Get Rejected Vendors",
        })
    } catch (error) {
        console.error("Get Rejected Vendors Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
exports.approvedVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(400).json({
                success: false,
                message: "Vendor not found."
            })
        }
        vendor.status = 'approved';
        vendor.approvedAt = new Date();
        await vendor.save();
        //Todo Send Approval Email
        return res.status(200).json({
            success: true,
            message: "Vendor Approved",
        })
    } catch (error) {
        console.error("Vendor Approved Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
exports.rejectVendor = async (req, res) => {
    try {
        const { id } = req.params
        const { reason } = req.body
        if (!reason) {
            return req.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            })
        }
        const vendor = await User.findOneAndUpdate({ _id: id, role: 'vendor', status: 'pending' }, { status: 'rejected', rejectReason: reason, approvedAt: null },
            { new: true }
        ).select('name email shopName status rejectReason')
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor Not Found or Already Approved."
            })
        }
        //Todo: Send mail with reason
        return res.status(200).json({
            success: true,
            message: "Vendor Rejected Successfully",
            data: vendor
        })
    } catch (error) {
        console.error("Vendor Reject Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
//Users 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('name email role status createdAt').sort({createdAt: -1})
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
            message: "All Users",
        })
    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
//Get Admin Stats
exports.getAdminStats = async (req, res) => {
    try {
        const [] = await Promise.all([
            //Total Users
            User.countDocuments({}),
            //Total Customer
            User.countDocuments({role:'customer'}),
            //Vendor BreakDown Using Aggregation pipeline
            User.aggregate([
                {$match: {role:'vendor'}},
                {
                    $group: {
                        _id: null,
                        totalVendors: {$sum: 1},
                        approved: {
                            $sum: {
                                $cond: [{$eq: ['status','approved']}, 1, 0]
                            }
                        },
                        pending: {
                            $sum: {
                                $cond: [{$eq: ['status','pending']}, 1, 0]
                            }
                        },
                        rejected: {
                            $sum: {
                                $cond: [{$eq: ['status','rejected']}, 1, 0]
                            }
                        },
                        suspended: {
                            $sum: {
                                $cond: [{$eq: ['status','suspended']}, 1, 0]
                            }
                        },
                        
                    }
                }
            ])

        ])
    } catch (error) {
        console.error("Get Admin Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}