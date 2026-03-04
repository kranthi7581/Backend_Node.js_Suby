const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
    console.log("Vendor registered successfully");
  } catch (error) {
    console.error("Error registering vendor:", error);
    res.status(500).json({ message: error.message });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Vendor logged in successfully", token });
    console.log(email, "okay", token);
  } catch (error) {
    console.error("Error logging in vendor:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.status(200).json({ vendors });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: error.message });
  }
};

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById,
};
