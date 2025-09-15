# 📝 Multi-Tenant Notes Application

A full-stack **multi-tenant notes management system** built with:

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication
- **Frontend:** React (Vite), TailwindCSS
- **Deployment:** Vercel (frontend), Render/railway (backend)

This project supports **multi-tenancy**, where each company (tenant) has its own users and notes, with **subscription plans** (Free & Pro).

---

## ✨ Features

### 🔒 Authentication & Multi-tenancy
- Tenant registration with initial **Admin**
- Secure **JWT login** for Admins & Members
- Role-based access control (Admin vs Member)

### 🧑‍🤝‍🧑 Tenant Management
- Register new tenant (`/api/tenants/register`)
- Invite users to tenant (Admin only)
- Upgrade tenant plan from **Free → Pro**

### 📝 Notes Management
- Create, update, delete, and view notes
- Tenant isolation → users see only their tenant’s notes
- Free Plan: Max **3 notes**
- Pro Plan: Unlimited notes

### 🎨 Frontend
- Responsive & interactive UI
- Built with React + Vite + TailwindCSS
- State management with React Context
- JWT-based auth flows

---

## 📂 Project Structure

multi-tenant-notes-app/
├── backend/
│ ├── api/ # Express app entry
│ ├── models/ # Mongoose models
│ ├── routes/ # Auth, tenants, notes routes
│ ├── middleware/ # JWT + role-based access
│ ├── scripts/seed.js # Seed demo data
│ └── README.md
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Navbar, NoteCard, forms
│ │ ├── pages/ # Login, Register, Dashboard, etc.
│ │ ├── context/ # Auth context
│ │ ├── utils/ # Axios instance
│ │ └── App.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── README.md
│
└── README.md (this file)

yaml
Copy code

---

## 🚀 Getting Started

### 1️⃣ Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/multi-tenant-notes-app.git
cd multi-tenant-notes-app
2️⃣ Setup Backend
Environment variables (backend/.env)
ini
Copy code
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes_db
JWT_SECRET=your_strong_secret
PORT=5000
Install dependencies & seed data
bash
Copy code
cd backend
npm install
npm run seed
npm run dev
Backend runs at:
http://localhost:5000

3️⃣ Setup Frontend
Environment variables (frontend/.env)
ini
Copy code
VITE_API_URL=http://localhost:5000
Install dependencies & run
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs at:
http://localhost:5173

🌍 Deployment
Frontend → Vercel
Import frontend repo on Vercel

Framework preset: Vite

Build command: npm run build

Output directory: dist

Add Environment Variable:

VITE_API_URL=https://your-backend-url.com

Backend → Render / Railway
Push backend to GitHub

Import repo in Render

Set Environment Variables (MONGO_URI, JWT_SECRET, PORT)

Deploy → get backend API URL

Use this URL in frontend .env (VITE_API_URL)

🔑 Default Seeded Accounts
When you run npm run seed, these accounts are created:

Tenant: Acme
Admin: admin@acme.test / password

User: user@acme.test / password

Tenant: Globex
Admin: admin@globex.test / password

User: user@globex.test / password

🛠 Tech Stack
Backend: Node.js, Express, MongoDB, JWT, Bcrypt

Frontend: React, Vite, TailwindCSS, Axios

Deployment: Vercel, Render

Other: Role-based Access Control, Tenant Isolation

✅ TODO / Improvements
 Add forgot password / reset flow

 Add note search & tags

 Add subscription billing (Stripe)

 Better error handling on frontend

📜 License
MIT License © 2025 Your Name

yaml
Copy code

---

Do you want me to make **two separate `README.md` files** (one for backend, one for frontend) as well, or keep just this root README?