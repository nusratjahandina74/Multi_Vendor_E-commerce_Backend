const { z } = require('zod')

// Registration Schema
const registrationSchema = z.object({
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(50, { message: 'Name cannot exceed 50 characters.' })
        .trim(),
    
    email: z.string()
        .email({ message: 'Please provide a valid email address.' })
        .toLowerCase()
        .trim(),
    
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one numeric digit.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
    
    phone: z.string()
        .regex(/^\+?8801[3-9]\d{8}$/, { message: 'Please provide a valid Bangladeshi phone number.' })
        .optional(),
    role: z.enum(['customer', 'vendor'], {message: 'Invalid Role'})
        .optional()
        .default('customer')
});

const loginSchema = z.object({
    email: z.string()
        .email({ message: 'Please provide a valid email address.' })
        .toLowerCase()
        .trim(),
    
    password: z.string()
        .min(1, { message: 'Password is required.' }),
})
const vendorSchema = z.object({
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(50, { message: 'Name cannot exceed 50 characters.' })
        .trim(),
    
    email: z.string()
        .email({ message: 'Please provide a valid email address.' })
        .toLowerCase()
        .trim(),
    
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long.' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
        .regex(/[0-9]/, { message: 'Password must contain at least one numeric digit.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
    
    phone: z.string()
        .regex(/^\+?8801[3-9]\d{8}$/, { message: 'Please provide a valid Bangladeshi phone number.' })
        .optional(),

    // Vendor Specific
    shopName: z.string()
        .min(2, { message: 'Shop Name must be at least 2 characters long.' })
        .max(50, { message: 'Shop Name cannot exceed 50 characters.' })
        .trim(),
        
    shopDescription: z.string()
        .min(10, { message: 'Description must be at least 10 characters long.' }) 
        .max(1000, { message: 'Description cannot exceed 1000 characters.' })
        .trim(),
        
    shopAddress: z.string()
        .min(10, { message: 'Address must be at least 10 characters long.' })
        .max(200, { message: 'Address cannot exceed 200 characters.' }) 
        .trim(),
        
    nidNumber: z.string()
        .regex(/^(?:\d{10}|\d{13}|\d{17})$/, { message: 'Please provide a valid Bangladeshi NID number (10, 13, or 17 digits).' })
        .trim(),
        
    bankInfo: z.object({
        bankName: z.string()
            .min(2, { message: 'Bank Name must be at least 2 characters long.' })
            .max(100, { message: 'Bank Name cannot exceed 100 characters.' })
            .trim(),
        branchName: z.string()
            .min(4, { message: 'Branch Name must be at least 4 characters long.' }) 
            .max(100, { message: 'Branch Name cannot exceed 100 characters.' })
            .trim(),
        accountNumber: z.string()
            .min(8, { message: 'Account Number must be at least 8 characters long.' }) 
            .max(50, { message: 'Account Number cannot exceed 50 characters.' })
            .trim(),
        accountHolder: z.string()
            .min(2, { message: 'Account Holder Name must be at least 2 characters long.' })
            .max(100, { message: 'Account Holder Name cannot exceed 100 characters.' })
            .trim(),
    })
});


module.exports = { registrationSchema, loginSchema, vendorSchema };