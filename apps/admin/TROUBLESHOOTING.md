# 🔧 Troubleshooting Guide

## Network Fetch Error

### Symptoms

- "Network fetch error" when creating/editing/deleting portfolios
- CRUD operations fail
- Console shows fetch errors

### Solutions

#### 1. Check API Server is Running

**Problem:** API server not running on port 3002

**Solution:**

```bash
cd apps/api
npm run dev
```

Verify it's running:

- Check terminal output: "🚀 API running on http://localhost:3002/api"
- Test in browser: http://localhost:3002/api/portfolios

#### 2. Check CORS Configuration

**Problem:** API doesn't allow requests from admin dashboard (port 3001)

**Solution:** Already fixed! API now allows:

- http://localhost:3000 (frontend)
- http://localhost:3001 (admin)
- http://localhost:3002 (API itself)

If still having issues, check `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  credentials: true,
});
```

#### 3. Check Environment Variables

**Problem:** Wrong API URL in admin dashboard

**Solution:** Check `apps/admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

**Important:** After changing .env.local, restart admin server!

#### 4. Check Database Connection

**Problem:** API can't connect to database

**Solution:**

```bash
cd apps/api
bunx prisma db push
bunx prisma db seed
```

#### 5. Check Port Conflicts

**Problem:** Port 3002 already in use

**Solution:**

```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Or change port in apps/api/.env
PORT=3003
```

Then update admin .env.local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003/api
```

## Common Issues

### Issue: "Failed to fetch portfolios"

**Cause:** API server not running or wrong URL

**Fix:**

1. Start API server: `cd apps/api && npm run dev`
2. Check URL in browser: http://localhost:3002/api/portfolios
3. Verify .env.local has correct URL

### Issue: "CORS error" in browser console

**Cause:** API doesn't allow admin origin

**Fix:**

1. Check `apps/api/src/main.ts` includes `http://localhost:3001`
2. Restart API server after changes

### Issue: "401 Unauthorized" or "403 Forbidden"

**Cause:** Auth guards enabled in API

**Fix:**

1. Check `apps/api/src/portfolio/portfolio.controller.ts`
2. Make sure `@UseGuards(JwtAuthGuard)` is commented out
3. Or implement proper authentication

### Issue: Changes not reflecting

**Cause:** Next.js cache or server not restarted

**Fix:**

1. Restart admin server: `Ctrl+C` then `npm run dev`
2. Clear browser cache: `Ctrl+Shift+R`
3. Check if .env.local changes require restart

### Issue: "Cannot read property of undefined"

**Cause:** API response format mismatch

**Fix:**

1. Check API response in browser DevTools Network tab
2. Verify response matches TypeScript interfaces in `lib/api.ts`
3. Check for null/undefined values

## Testing Steps

### 1. Test API Directly

```bash
# Test GET
curl http://localhost:3002/api/portfolios

# Test POST
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","createdBy":"Admin","year":"2024","category":"Test","description":"Test","images":["test.jpg"]}'
```

### 2. Test in Browser Console

Open browser DevTools (F12) and run:

```javascript
// Test fetch
fetch("http://localhost:3002/api/portfolios")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### 3. Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try CRUD operation
4. Check request/response details
5. Look for errors (red entries)

## Debug Checklist

- [ ] API server running on port 3002
- [ ] Admin server running on port 3001
- [ ] Database connected and seeded
- [ ] CORS includes localhost:3001
- [ ] .env.local has correct API_URL
- [ ] Both servers restarted after config changes
- [ ] Browser cache cleared
- [ ] No port conflicts
- [ ] No firewall blocking localhost

## Quick Fix Commands

```bash
# Restart everything
# Terminal 1
cd apps/api
npm run dev

# Terminal 2
cd apps/admin
npm run dev

# If database issues
cd apps/api
bunx prisma db push
bunx prisma db seed

# If port conflicts
# Kill process on port 3002 (Windows)
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

## Still Having Issues?

### Check Console Logs

**Admin Dashboard:**

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**API Server:**

- Check terminal running API
- Look for error messages
- Check if requests are reaching API

### Verify Configuration

1. **API** (`apps/api/src/main.ts`):
   - CORS includes localhost:3001
   - Global prefix is 'api'
   - Port is 3002

2. **Admin** (`apps/admin/.env.local`):
   - NEXT_PUBLIC_API_URL=http://localhost:3002/api
   - AUTH_SECRET is set
   - AUTH_URL=http://localhost:3001

3. **Database** (`apps/api/.env`):
   - DATABASE_URL is correct
   - DIRECT_URL is correct

## Contact

If issues persist:

1. Check all error messages in console
2. Verify all services are running
3. Test API endpoints directly
4. Check network connectivity

---

**Most Common Fix:** Restart both API and Admin servers after any configuration changes!
