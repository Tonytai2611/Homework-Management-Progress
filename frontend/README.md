# 🎨 Frontend Setup Instructions

## Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18
- React Router DOM (routing)
- Axios (API calls)
- Tailwind CSS (styling)
- Vite (build tool)

## Step 2: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## 🎯 Features

### Authentication Pages
- **Sign In** (`/signin`) - Login with email and password
- **Sign Up** (`/signup`) - Register as Student or Admin

### Protected Dashboards
- **Student Dashboard** (`/student/dashboard`) - For students
- **Admin Dashboard** (`/admin/dashboard`) - For teachers/admins

### Features Included
- ✅ Beautiful gradient UI (purple/teal theme)
- ✅ Form validation with error messages
- ✅ Role-based routing (Student/Admin)
- ✅ JWT token management
- ✅ Auto-login on page refresh
- ✅ Protected routes
- ✅ Responsive design

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#a855f7 to #14b8a6)
- **Accent**: Teal (#14b8a6)
- **Background**: Light gradients

### Components
- `btn-primary` - Gradient button
- `btn-secondary` - Outlined button
- `input-field` - Form input
- `card` - White card container

## 📱 Pages Overview

### Sign In Page
- Email and password fields
- Remember me checkbox
- Forgot password link
- Link to sign up

### Sign Up Page
- Full name, email, password fields
- Role selection (Student/Admin)
- Level field (for students only)
- Password confirmation
- Client-side validation

### Student Dashboard
- Welcome banner with user name
- Stats cards (assignments, progress)
- User profile information
- Sign out button

### Admin Dashboard
- System overview
- Student management stats
- Admin profile
- Sign out button

## 🔗 API Integration

The frontend connects to: `http://localhost:5000/api`

Make sure the backend server is running before testing!

## 🧪 Testing Flow

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Sign Up**: Create a student account
4. **Sign In**: Login with your credentials
5. **Dashboard**: View your dashboard based on role

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## 📦 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # API client
│   ├── components/
│   │   └── ProtectedRoute.jsx # Route guard
│   ├── contexts/
│   │   └── AuthContext.jsx   # Auth state
│   ├── pages/
│   │   ├── SignIn.jsx        # Login page
│   │   ├── SignUp.jsx        # Register page
│   │   ├── StudentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx               # Main app + routes
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎉 You're All Set!

Your authentication system is ready to use!
