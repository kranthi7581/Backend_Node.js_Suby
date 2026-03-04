const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/addProduct/:firmId", productController.addProduct);
router.get("/getProductsByFirm/:firmId", productController.getProductsByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete("/deleteProduct/:productId", productController.deleteProductById);

module.exports = router; 