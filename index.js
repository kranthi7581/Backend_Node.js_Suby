const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { URL } = require("url");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require("body-parser");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/prroductRoutes");
const path = require("path");
//const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI_DIRECT || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MongoDB connection string is missing.");
  console.error("Set MONGO_URI or MONGO_URI_DIRECT in your .env file.");
  process.exit(1);
}

app.use(bodyParser.json());
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the backend of the Swiggy Clone!");
});

async function resolveDnsOverHttps(name, type) {
  const endpoint = new URL("https://dns.google/resolve");
  endpoint.searchParams.set("name", name);
  endpoint.searchParams.set("type", type);

  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`DNS-over-HTTPS request failed with ${response.status}`);
  }

  const payload = await response.json();

  if (payload.Status !== 0 || !Array.isArray(payload.Answer)) {
    throw new Error(`No ${type} DNS answers found for ${name}`);
  }

  return payload.Answer;
}

async function buildDirectMongoUriFromSrv(srvUri) {
  const parsedUri = new URL(srvUri);
  const srvHostname = parsedUri.hostname;
  const srvRecordName = `_mongodb._tcp.${srvHostname}`;

  const [srvAnswers, txtAnswers] = await Promise.all([
    resolveDnsOverHttps(srvRecordName, "SRV"),
    resolveDnsOverHttps(srvHostname, "TXT").catch(() => []),
  ]);

  const hosts = srvAnswers
    .map((answer) => answer.data.trim().split(/\s+/))
    .filter((parts) => parts.length === 4)
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map((parts) => parts[3].replace(/\.$/, ""));

  if (!hosts.length) {
    throw new Error(`No SRV hosts found for ${srvHostname}`);
  }

  const txtParams = txtAnswers
    .map((answer) => answer.data.replace(/^"|"$/g, ""))
    .join("&")
    .trim();

  const finalUri = new URL(`mongodb://${parsedUri.username}:${parsedUri.password}@${hosts.join(",")}${parsedUri.pathname}`);
  const searchParams = new URLSearchParams(parsedUri.searchParams);

  if (txtParams) {
    const txtSearchParams = new URLSearchParams(txtParams);
    txtSearchParams.forEach((value, key) => {
      if (!searchParams.has(key)) {
        searchParams.set(key, value);
      }
    });
  }

  if (!searchParams.has("tls")) {
    searchParams.set("tls", "true");
  }

  finalUri.search = searchParams.toString();
  return finalUri.toString();
}

async function connectToMongo() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    return;
  } catch (err) {
    const canRetryWithDirectUri =
      mongoUri.startsWith("mongodb+srv://") &&
      ["ENOTFOUND", "ECONNREFUSED", "ETIMEOUT"].includes(err.code);

    if (!canRetryWithDirectUri) {
      throw err;
    }

    console.error("MongoDB SRV lookup failed. Retrying with DNS-over-HTTPS...");

    const directUri = await buildDirectMongoUriFromSrv(mongoUri);
    await mongoose.connect(directUri, {
      serverSelectionTimeoutMS: 10000,
    });
  }
}

async function startServer() {
  try {
    await connectToMongo();
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Failed:");
    console.error(err.message);

    if (["ENOTFOUND", "ECONNREFUSED", "ETIMEOUT"].includes(err.code)) {
      console.error(
        "DNS lookup for your MongoDB Atlas host failed on this machine."
      );
      console.error(
        "Either switch your system DNS to 8.8.8.8 / 1.1.1.1 or use Atlas's standard mongodb:// connection string in MONGO_URI_DIRECT."
      );
    }

    process.exit(1);
  }
}

startServer();

