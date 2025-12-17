# TRAS - Time & Resource Allocation System

A Single Page Application (SPA) for managing time and resource allocation in organizations. Built with React 19 for modern, efficient employee scheduling and project management.

## 🚀 Features

- **User Dashboard** - Employee view with personal schedule and task management
- **Admin Dashboard** - Administrative panel for resource allocation and team oversight
- **Calendar View** - Interactive calendar for visualizing time allocations
- **User Profiles** - Personal information and availability management
- **Authentication System** - Role-based access control (User/Admin)
- **Data Visualization** - Charts and analytics using Recharts
- **Responsive Design** - Mobile-friendly interface with modern UI components

## 🛠️ Tech Stack

- **React 19** - Latest React version with improved performance
- **React Router v7** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization library
- **React Hook Form** - Form validation and management
- **Sass** - CSS preprocessing


## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context (AuthContext, etc.)
├── data/            # Mock data and constants
├── pages/           # Main application pages
│   ├── Login.jsx
│   ├── UserDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── UserProfile.jsx
├── styles/          # Global styles and SCSS modules
├── utils/           # Helper functions and utilities
└── App.jsx          # Main application component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.



## 🔐 Authentication

The application includes a role-based authentication system:

- **User Role** - Access to personal dashboard and profile
- **Admin Role** - Full access to resource management and team oversight

Routes are protected using React Router's `ProtectedRoute` component.

## 🎨 Design

- Modern, clean interface with intuitive navigation
- Responsive design optimized for desktop and mobile
- Consistent color scheme and typography

## 📊 Key Components

### Dashboard
- Real-time overview of tasks and allocations
- Visual charts for resource utilization
- Quick actions and notifications

### Calendar View
- Interactive calendar interface
- Multi-user scheduling

### User Management
- Profile editing and preferences
- Availability settings
- Performance metrics
