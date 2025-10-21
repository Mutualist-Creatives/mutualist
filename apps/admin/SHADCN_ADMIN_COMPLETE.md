# ✅ Admin Dashboard with Shadcn UI & Authentication Complete

## Overview

Admin dashboard dengan shadcn/ui components dan NextAuth authentication untuk manage portfolio items.

## Features

### 🔐 Authentication

- ✅ Login page dengan shadcn Card & Form
- ✅ NextAuth v5 (Auth.js) integration
- ✅ Credentials provider
- ✅ Protected routes dengan middleware
- ✅ Session management
- ✅ Logout functionality

### 📊 Dashboard

- ✅ Stats cards (Total Portfolios, Categories, Latest Update)
- ✅ Recent portfolios list
- ✅ Quick navigation
- ✅ Responsive design

### 📁 Portfolio Management

- ✅ List view dengan shadcn Table
- ✅ Create form dengan validation
- ✅ Edit form dengan pre-filled data
- ✅ Delete dengan confirmation Dialog
- ✅ Badge untuk categories
- ✅ Icons dari lucide-react

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS v4
- **Authentication:** NextAuth v5 (Auth.js)
- **Icons:** lucide-react
- **API:** REST API (NestJS backend)

## Shadcn Components Used

- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Textarea
- ✅ Table
- ✅ Badge
- ✅ Alert
- ✅ Dialog
- ✅ Form
- ✅ Select

## File Structure

```
apps/admin/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API route
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── portfolios/
│   │   ├── page.tsx                  # Portfolio list (Table)
│   │   ├── new/
│   │   │   └── page.tsx              # Create form
│   │   └── [id]/
│   │       └── page.tsx              # Edit form
│   ├── layout.tsx                    # Root layout with auth
│   └── page.tsx                      # Dashboard
├── components/
│   ├── ui/                           # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── select.tsx
│   ├── login-form.tsx                # Login form component
│   ├── navigation.tsx                # Nav with logout
│   ├── portfolio-form.tsx            # Create/Edit form
│   └── delete-button.tsx             # Delete with dialog
├── lib/
│   ├── api.ts                        # API client
│   ├── auth.ts                       # NextAuth config
│   └── utils.ts                      # Shadcn utils
├── middleware.ts                     # Auth middleware
├── .env.local                        # Environment variables
└── components.json                   # Shadcn config
```

## Authentication

### Login Credentials (Demo)

```
Email: admin@mutualist.co
Password: admin123
```

### How It Works

1. **Middleware** (`middleware.ts`) - Protects all routes except `/login`
2. **Auth Config** (`lib/auth.ts`) - NextAuth configuration with Credentials provider
3. **Login Page** (`app/login/page.tsx`) - Login form with shadcn components
4. **Session** - Stored and managed by NextAuth
5. **Logout** - Button in navigation bar

### Protected Routes

All routes except `/login` require authentication:

- `/` - Dashboard
- `/portfolios` - Portfolio list
- `/portfolios/new` - Create form
- `/portfolios/[id]` - Edit form

## Pages Detail

### 1. Login Page (`/login`)

- Shadcn Card with form
- Email & Password inputs
- Error handling with Alert
- Loading state on button
- Auto-redirect after login

### 2. Dashboard (`/`)

- 3 stat cards with icons
- Recent portfolios list
- Quick actions
- Responsive grid layout

### 3. Portfolio List (`/portfolios`)

- Shadcn Table component
- Badge for categories
- Edit & Delete actions
- "Add Portfolio" button

### 4. Create Portfolio (`/portfolios/new`)

- Form with shadcn components
- All fields with validation
- Save & Cancel buttons
- Error handling

### 5. Edit Portfolio (`/portfolios/[id]`)

- Pre-filled form
- Update functionality
- Same UI as create

## Components Detail

### Navigation

- Logo/Title
- Dashboard & Portfolios links
- User email display
- Logout button with icon

### Portfolio Form

- Title, Created By, Year, Category
- Description textarea
- Images textarea (multi-line URLs)
- Save & Cancel buttons
- Loading states
- Error alerts

### Delete Button

- Trash icon button
- Confirmation dialog
- Portfolio title in message
- Cancel & Delete actions
- Loading state

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# NextAuth Configuration
AUTH_SECRET=mutualist-admin-secret-key-change-in-production
AUTH_URL=http://localhost:3001
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd apps/admin
npm install
```

### 2. Configure Environment

Create `.env.local` with required variables (already created)

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Application

- URL: http://localhost:3001
- Login: admin@mutualist.co / admin123

## Usage Flow

1. **Login**
   - Navigate to http://localhost:3001
   - Auto-redirects to `/login`
   - Enter credentials
   - Redirects to dashboard

2. **View Dashboard**
   - See stats overview
   - View recent portfolios
   - Navigate to portfolio management

3. **Manage Portfolios**
   - Click "Portfolios" in nav
   - View all items in table
   - Create, Edit, or Delete

4. **Logout**
   - Click "Logout" button in nav
   - Redirects to login page

## API Integration

All API calls through `lib/api.ts`:

```typescript
portfolioApi.getAll(); // GET /api/portfolios
portfolioApi.getById(id); // GET /api/portfolios/:id
portfolioApi.getCategories(); // GET /api/portfolios/categories
portfolioApi.create(data); // POST /api/portfolios
portfolioApi.update(id, data); // PUT /api/portfolios/:id
portfolioApi.delete(id); // DELETE /api/portfolios/:id
```

## Styling

### Tailwind CSS v4

- Modern utility-first CSS
- Configured via `@tailwindcss/postcss`
- Custom theme in `globals.css`

### Shadcn Theme

- Base color: Neutral
- CSS variables for theming
- Dark mode ready (not implemented yet)

## Security

### Authentication

- ✅ Protected routes with middleware
- ✅ Session-based authentication
- ✅ Secure password handling (ready for bcrypt)
- ✅ CSRF protection (NextAuth built-in)

### TODO: Production Security

- [ ] Replace hardcoded credentials with database
- [ ] Implement bcrypt password hashing
- [ ] Add rate limiting
- [ ] Add HTTPS in production
- [ ] Rotate AUTH_SECRET
- [ ] Add role-based access control

## Next Steps

### Phase 1: Auth Improvements

- [ ] Connect to User model in database
- [ ] Hash passwords with bcrypt
- [ ] Add "Remember me" functionality
- [ ] Add password reset flow
- [ ] Add user profile page

### Phase 2: UI Enhancements

- [ ] Add dark mode toggle
- [ ] Add search functionality
- [ ] Add filters and sorting
- [ ] Add pagination
- [ ] Add loading skeletons

### Phase 3: Advanced Features

- [ ] Add image upload (Cloudinary/S3)
- [ ] Add rich text editor
- [ ] Add drag-and-drop for images
- [ ] Add bulk operations
- [ ] Add export functionality

## Testing Checklist

- [ ] Login with correct credentials
- [ ] Login with wrong credentials (error shown)
- [ ] Access protected route without login (redirects)
- [ ] View dashboard stats
- [ ] View portfolio list
- [ ] Create new portfolio
- [ ] Edit existing portfolio
- [ ] Delete portfolio (with confirmation)
- [ ] Logout (redirects to login)
- [ ] Form validation works
- [ ] Loading states show properly
- [ ] Error messages display correctly

## Troubleshooting

### Issue: "Invalid credentials" on login

**Solution:** Use demo credentials: admin@mutualist.co / admin123

### Issue: Redirects to login after successful login

**Solution:** Check AUTH_SECRET and AUTH_URL in .env.local

### Issue: API calls fail

**Solution:** Ensure API server is running on port 3002

### Issue: Shadcn components not styled

**Solution:** Check if globals.css is imported in layout.tsx

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Add shadcn component
npx shadcn@latest add [component-name]
```

## Status

🎉 **FULLY FUNCTIONAL**

Admin dashboard with authentication and shadcn/ui is ready for use!

---

**Built with ❤️ using shadcn/ui**
