const venderController = require('../controllers/vendorController');
const express = require('express');

const router = express.Router();

router.post('/register', venderController.vendorRegister);
router.post('/login', venderController.vendorLogin);

router.get('/allVendors', venderController.getAllVendors);
router.get('/singleVendor/:id', venderController.getVendorById);

module.exports = router;