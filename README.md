# 🏪 Multi-Vendor B2B2C Backend API

This project is a **Node.js + Express.js REST API** designed for a **Multi-Vendor B2B2C (Business-to-Business-to-Consumer)** platform.

It enables vendors to register, manage their profiles, and interact with the system securely using **JWT-based authentication and authorization**.

---

## 🚀 Live API

👉 https://backend-node-js-suby-3.onrender.com

---

## 📌 Key Features

- 🏪 Multi-vendor system (Multiple vendors can register & manage data)
- 🔐 JWT Authentication (Secure login & token-based access)
- 🛡️ Role-based Authorization (Protected routes)
- 📦 B2B2C architecture (Vendor → Platform → Customer flow)
- 🌐 RESTful API design
- 🗄️ MongoDB integration
- 🧪 API tested using Postman

---

## 🧑‍💻 Tech Stack

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Atlas)

### Authentication
- JSON Web Tokens (JWT)

### Tools
- Postman  
- Git & GitHub  
- Render (Deployment)

---

## 🏗️ Architecture (B2B2C)

``` id="arch-b2b2c"
Vendor → Platform (Backend API) → Customer

Vendors register & manage their data
Platform handles authentication, validation, and APIs
Customers consume vendor services/products
🔐 Authentication & Authorization
Users (vendors) must register and login
On login, a JWT token is generated
Protected routes require token in headers:
Authorization: Bearer <your_token>
Middleware verifies token and grants access based on roles
📡 API Endpoints
🔑 Authentication Routes
Method	Endpoint	Description
POST	/vendor/register	Register a new vendor
POST	/vendor/login	Login vendor & get JWT
📦 Vendor Routes
Method	Endpoint	Description
GET	/vendor/allVendors	Get all vendors
GET	/vendor/singleVendor/:id	Get vendor by ID
📂 Project Structure
project/
│
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Auth middleware (JWT)
├── config/          # DB connection
├── index.js         # Entry point
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo
2️⃣ Install dependencies
npm install
3️⃣ Run the server
npm start
🔑 Environment Variables

Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
🧪 API Testing
Tested using Postman
Includes:
Authentication APIs
Vendor APIs
Protected routes with JWT
🎯 Key Highlights
Scalable multi-vendor backend system
Secure JWT authentication flow
Clean REST API structure
Real-world B2B2C architecture implementation
📈 Future Enhancements
🛒 Product & order management
💳 Payment gateway integration
📊 Admin dashboard
📦 Order tracking system
🔔 Notification system
👨‍💼 Author

Kranthi Kumar Akula
MERN Stack Developer
Passionate about building scalable backend systems
