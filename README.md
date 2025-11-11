# Subscription Tracker - Full Stack Application

<div align="center">
  <div>
    <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="vite" />
    <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="node.js" />
    <img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="express.js" />
    <img src="https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
  </div>

  <h3 align="center">Subscription Tracker</h3>

   <div align="center">
     A modern full-stack application to help users manage and track recurring subscriptions efficiently with a beautiful React frontend and robust Node.js backend.
    </div>
</div>

## 📋 Table of Contents

1. [🤖 Introduction](#introduction)
2. [⚙️ Tech Stack](#tech-stack)
3. [🔋 Features](#features)
4. [🚀 Quick Start](#quick-start)
5. [🏗️ Project Structure](#project-structure)
6. [🔗 Environment Setup](#environment-setup)
7. [📡 API Endpoints](#api-endpoints)
8. [🎯 Future Plans](#future-plans)
9. [👨‍💻 Author](#author)

---

## <a name="introduction">🤖 Introduction</a>

**Subscription Tracker** is a complete full-stack application that allows users to easily manage, organize, and monitor their active subscriptions such as Netflix, Spotify, or productivity tools. It provides a modern React frontend with complete CRUD operations, automatic status updates, and secure authentication.

---

## <a name="tech-stack">⚙️ Tech Stack</a>

### Frontend
* **React** - Modern UI library
* **Vite** - Fast build tool and dev server
* **Tailwind CSS** - Utility-first CSS framework
* **React Router** - Client-side routing

### Backend
* **Node.js** - JavaScript runtime environment
* **Express.js** - Lightweight backend framework
* **MongoDB + Mongoose** - Database and ORM
* **JWT** - Authentication and authorization
* **dotenv** - Environment variable management

---

## <a name="features">🔋 Features</a>

* 🎨 **Modern React UI** with responsive design
* ⚡ **Fast Development** with Vite hot reload
* 🔑 **JWT Authentication** for secure user access
* 🔄 **Subscription CRUD Operations** (Create, Read, Update, Delete)
* 📅 **Auto-status updates** based on start/end dates
* 📊 **Categorization** by service type (Entertainment, Education, etc.)
* 🔐 **Environment-based Configuration** using dotenv
* 🛡️ **Security Middleware** (Helmet & CORS)
* 📧 **Email Notifications** for expiring subscriptions

---

## <a name="quick-start">🚀 Quick Start</a>

### Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)
* Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/xobiya/subscription-tracker.git
cd subscription-tracker
```

2. **Backend Setup**
```bash
# Navigate to backend directory
cd Backend

# Install backend dependencies
npm install

# Start the backend server
npm run dev
```
Backend runs on: `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## <a name="project-structure">🏗️ Project Structure</a>

```
subscription-tracker/
├── Backend/                 # Node.js + Express API
│   ├── config/             # Configuration helpers
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models (User, Subscription)
│   ├── routes/             # API routes (auth, subscriptions, users)
│   ├── middlewares/        # Auth & validation middlewares
│   ├── utils/              # Helper utilities (email templates)
│   └── app.js              # Express application entry
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # API client & helpers
│   ├── vite.config.js      # Vite configuration with proxy
│   └── tailwind.config.cjs # Tailwind CSS config
└── README.md
```

---

## <a name="environment-setup">🔗 Environment Setup</a>

### Backend Environment
Create a `.env` or `.env.development.local` file in the `Backend` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/subscription_tracker
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d

# Optional email configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
```

### Frontend Configuration
The frontend is configured in `vite.config.js` to proxy API requests to the backend:

```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

---

## <a name="api-endpoints">📡 API Endpoints</a>

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Categories
- `GET /api/categories` - Get subscription categories

---

## <a name="future-plans">🎯 Future Plans</a>

* 📢 Enhanced email reminders for expiring subscriptions
* 🔄 Auto-renewal logic and tracking
* 📊 Advanced analytics and reporting dashboard
* 🛠️ Payment gateway integration
* 📱 Mobile application
* 🔔 Push notifications
* 🌐 Multi-language support
* 👥 Family/shared subscription management
* 💰 Cost analysis and budgeting features

---

## <a name="author">👨‍💻 Author</a>

Developed by **Feleke Eshetu**

Connect on GitHub: [@xobiya](https://github.com/xobiya)

---

## 🔄 Development Workflow

### Running Both Servers
For development, you'll need to run both servers simultaneously:

1. **Terminal 1 - Backend**
```bash
cd Backend
npm run dev
```

2. **Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd Backend
npm start
```

> 📖 *A complete full-stack solution to track all your subscriptions in one place with a beautiful interface and powerful backend. Keep all your subscriptions organized and never miss a renewal date again!*