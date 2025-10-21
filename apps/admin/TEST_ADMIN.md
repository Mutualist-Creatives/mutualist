# Testing Admin Dashboard

## Prerequisites

1. ✅ API server running on port 3002
2. ✅ Database seeded with portfolio data

## Test Steps

### 1. Start Admin Dashboard

```bash
cd apps/admin
npm run dev
```

Expected: Server starts on http://localhost:3001 (or next available port)

### 2. Test Dashboard Page

- Navigate to http://localhost:3001
- Should see:
  - Total Portfolios: 7
  - Categories: 6
  - Recent portfolios list

### 3. Test Portfolio List

- Click "Portfolios" in navigation or "View All"
- Should see table with all 7 portfolios
- Verify columns: Title, Category, Year, Created By, Actions

### 4. Test Create Portfolio

- Click "+ Add Portfolio" button
- Fill form:
  - Title: "Test Admin Portfolio"
  - Created By: "Admin User"
  - Year: "2024"
  - Category: "Testing"
  - Description: "Created from admin dashboard"
  - Images: "https://example.com/test.jpg"
- Click "Create"
- Should redirect to portfolio list
- Verify new portfolio appears in list

### 5. Test Edit Portfolio

- Click "Edit" on any portfolio
- Modify title or description
- Click "Update"
- Should redirect to portfolio list
- Verify changes are saved

### 6. Test Delete Portfolio

- Click "Delete" on test portfolio
- Confirm deletion dialog
- Portfolio should be removed from list

## Expected Results

✅ All pages load without errors
✅ Data fetched from API correctly
✅ Create operation works
✅ Update operation works
✅ Delete operation works
✅ Navigation works smoothly
✅ Loading states show properly
✅ Error handling works

## Troubleshooting

### Issue: Cannot connect to API

**Solution:** Make sure API server is running on port 3002

```bash
cd apps/api
npm run dev
```

### Issue: Empty data

**Solution:** Seed the database

```bash
cd apps/api
bunx prisma db seed
```

### Issue: CORS error

**Solution:** Check API CORS configuration in `apps/api/src/main.ts`
Should include: `http://localhost:3001`

### Issue: Port already in use

**Solution:** Next.js will automatically use next available port (3001, 3002, etc.)

---

## Quick Test Checklist

- [ ] Dashboard loads with correct stats
- [ ] Portfolio list shows all items
- [ ] Can create new portfolio
- [ ] Can edit existing portfolio
- [ ] Can delete portfolio
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Navigation works
