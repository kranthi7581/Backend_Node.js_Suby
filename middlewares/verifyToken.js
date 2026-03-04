const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.WhatIsYourName;

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.vendor = vendor._id;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
