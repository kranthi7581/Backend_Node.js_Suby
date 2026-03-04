const Product = require("../models/Product");
const Firm = require("../models/Firm");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, description, category, bestseller } =
      req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    const product = new Product({
      productName,
      price,
      description,
      category,
      image,
      bestseller,
      firm: firm._id,
    });
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save();
    return res
      .status(200)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

const getProductsByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm){
            return res.status(404).json({ message: "Firm not found" });
        }
        const products = await Product.find({ firm: firmId });
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
};

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId); 
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        await Firm.findByIdAndUpdate(deletedProduct.firm, { $pull: { products: productId } });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirm: getProductsByFirm,
  deleteProductById: deleteProductById,
};
