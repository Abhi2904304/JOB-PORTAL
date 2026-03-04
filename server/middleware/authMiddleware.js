import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import { getAuth } from "@clerk/express";   // 👈 add this

// 🔹 Company Auth (same rahega)
export const protectCompany = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.json({ success: false, message: "Not authorized, Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.company = await Company.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// 🔹 User Auth (Clerk based)
export const protectUser = (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.json({ success: false, message: "Not authorized, Login Again" });
        }

        req.auth = { userId };   // 👈 ye important hai (controller me use ho raha hai)

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
