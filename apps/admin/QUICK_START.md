# 🚀 Quick Start Guide

## Prerequisites

✅ API server running on port 3002
✅ Database seeded with portfolio data

## Start Admin Dashboard

```bash
cd apps/admin
npm run dev
```

## Access & Login

1. Open http://localhost:3001
2. You'll be redirected to `/login`
3. Enter credentials:
   - **Email:** admin@mutualist.co
   - **Password:** admin123
4. Click "Sign In"

## What You'll See

### Dashboard

- Total portfolios count
- Categories count
- Latest update date
- Recent 5 portfolios

### Portfolio Management

- Click "Portfolios" in navigation
- View all items in table
- Create, Edit, or Delete portfolios

## Quick Actions

### Create Portfolio

1. Click "+ Add Portfolio" button
2. Fill in all required fields
3. Click "Create Portfolio"

### Edit Portfolio

1. Click "Edit" on any portfolio
2. Modify fields
3. Click "Update Portfolio"

### Delete Portfolio

1. Click "Delete" on any portfolio
2. Confirm in dialog
3. Portfolio removed

### Logout

- Click "Logout" button in top-right corner

## Demo Credentials

```
Email: admin@mutualist.co
Password: admin123
```

## Ports

- Admin Dashboard: **3001**
- API Server: **3002**
- Frontend (life): **3000**

## Features

✅ Authentication with NextAuth
✅ Protected routes
✅ Dashboard with stats
✅ Full CRUD operations
✅ Shadcn/ui components
✅ Responsive design
✅ Form validation
✅ Error handling
✅ Loading states
✅ Confirmation dialogs

---

**That's it! You're ready to manage portfolios! 🎉**
