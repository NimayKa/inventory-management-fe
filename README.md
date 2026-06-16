# Inventory Management System — Frontend

The frontend for the Inventory Management System, built with **React** and **Vite**.

> ⚠️ This app requires the [Backend API](https://github.com/<your-backend-repo>) to be running before use.

---

## 📋 Table of Contents

- [Software Requirements](#software-requirements)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [Troubleshooting](#troubleshooting)

---

## 🖥️ Software Requirements

| Software | Version | Download |
|----------|---------|----------|
| Node.js | >= 18.x | https://nodejs.org |
| npm | >= 9.x | Comes with Node.js |
| Git | Latest | https://git-scm.com/downloads |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-frontend-repo-url> inventory-frontend
cd inventory-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

### 4. Configure the `.env` file

Open `.env` and set the backend API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

> If the backend is running on a different port, update the URL accordingly (e.g. `http://localhost:8001/api`).

---

## ▶️ Running the App

> Make sure the **backend API is running** at `http://localhost:8000` before starting the frontend.

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

Open your browser and go to **http://localhost:5173** to use the application.

---

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder. You can preview it locally with:

```bash
npm run preview
```

---

## 🛠️ Troubleshooting

**Blank page or API errors on load**
Make sure the Laravel backend is running at `http://localhost:8000` and the `VITE_API_URL` in your `.env` matches.

**`npm install` fails**
Ensure you are using Node.js >= 18. Check your version with:
```bash
node -v
```

**Port 5173 already in use**
Vite will automatically try the next available port. Check the terminal output for the correct URL.

**CORS error in browser console**
Ask the backend team to add `http://localhost:5173` to the allowed origins in `config/cors.php`.
