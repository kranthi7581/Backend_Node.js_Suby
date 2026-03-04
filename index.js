  const express = require("express");
  const dotenv = require("dotenv");
  dotenv.config();

  const mongoose = require("mongoose");
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  const vendorRoutes = require("./routes/vendorRoutes");
  const bodyParser = require("body-parser");
  const firmRoutes = require("./routes/firmRoutes");
  const productRoutes = require("./routes/prroductRoutes");
  const path = require("path");
  //const cors = require("cors");

  const app = express();

  const PORT = process.env.PORT || 4000;

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
      console.error("MongoDB Connection Failed:");
      console.error(err.message);
      process.exit(1);
    });


  app.use(bodyParser.json());
  app.use("/vendor", vendorRoutes);
  app.use("/firm", firmRoutes);
  app.use("/product", productRoutes);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.get("/", (req, res) => {
    res.send("Welcome to the backend of the Swiggy Clone!");
  });
