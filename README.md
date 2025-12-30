# Community Skill Exchange Platform

A MERN-based web application that allows users to exchange skills within a community.

## 🚀 Project Status
Backend authentication module completed.

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt.js

## 🔐 Features Implemented
- User Registration
- User Login
- Password Hashing
- JWT-based Authentication
- Protected Routes using Middleware

## 📂 Backend Structure
server/
├── models/
│ └── User.js
├── routes/
│ └── authRoutes.js
├── middleware/
│ └── authMiddleware.js
├── server.js
└── .env (ignored)

## 📌 API Endpoints
- POST `/api/auth/register` – Register user
- POST `/api/auth/login` – Login user & generate JWT
- GET `/api/auth/profile` – Protected route

## 🧪 Testing
APIs tested using Thunder Client / Postman.

## 🔜 Upcoming Features
- React frontend integration
- Skill matching
- User dashboard
- Logout functionality

---