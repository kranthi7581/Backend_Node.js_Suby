const express = require('express');
const router = express.Router();
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/addFirm', verifyToken, firmController.addFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/deleteFirm/:firmId', verifyToken, firmController.deleteFirmById);

module.exports = router;