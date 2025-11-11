<div align="center">
  <div>
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="node.js" />
    <img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="express.js" />
    <img src="https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
  </div>

  <h3 align="center">Subscription Tracker API</h3>

   <div align="center">
     A modern backend API built with Node.js, Express, and MongoDB to help users manage and track recurring subscriptions efficiently.
    </div>
</div>

## 📋 Table of Contents

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Environment Setup](#environment)
6. 🚀 [Future Plans](#future)
7. 👨‍💻 [Author](#author)

---

## <a name="introduction">🤖 Introduction</a>

**Subscription Tracker API** allows users to easily manage, organize, and monitor their active subscriptions such as Netflix, Spotify, or productivity tools. It provides complete CRUD operations, automatic status updates, and secure authentication.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

* **Node.js** - JavaScript runtime environment
* **Express.js** - Lightweight backend framework
* **MongoDB + Mongoose** - Database and ORM
* **dotenv** - Environment variable management
* **JWT** - Authentication and authorization

---

## <a name="features">🔋 Features</a>

* 🔑 **JWT Authentication** for secure user access
* 🔄 **Subscription CRUD Operations** (Create, Read, Update, Delete)
* 📅 **Auto-status updates** based on start/end dates
* 📊 **Categorization** by service type (Entertainment, Education, etc.)
* 🔐 **Environment-based Configuration** using dotenv
* 🛡️ **Security Middleware** (Helmet & CORS)

---

## <a name="quick-start">🤸 Quick Start</a>

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)
* Git

### Installation

```bash
git clone https://github.com/xobiya/subscription-tracker-api.git
cd subscription-tracker-api
npm install
```

### Run the Project

```bash
npm run dev
```

Server will start on:
**[http://localhost:5000](http://localhost:5000)**

---

## <a name="environment">🔗 Environment Setup</a>

Create a `.env.development.local` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/subscription_tracker
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

---

## <a name="future">🚀 Future Plans</a>

* 📢 Email reminders for expiring subscriptions
* 🔄 Auto-renewal logic
* 📊 Admin dashboard and analytics
* 🛠️ Payment gateway integration

---

## <a name="author">👨‍💻 Author</a>

Developed by **Feleke Eshetu**
Connect on GitHub: @xobiya(https://github.com/xobiya)

---

> 📖 *A lightweight and secure solution to track all your subscriptions in one place.*
