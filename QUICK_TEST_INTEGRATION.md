# 🚀 Quick Test - Life App API Integration

## Test dalam 3 Langkah

### Step 1: Start API Backend

```bash
cd apps/api
npm run dev
```

✅ API akan running di `http://localhost:3002`

### Step 2: Start Life App

```bash
cd apps/life
npm run dev
```

✅ Life app akan running di `http://localhost:3000`

### Step 3: Test

Buka browser: `http://localhost:3000`

**Expected Result:**

- ✅ Portfolio cards muncul di infinite canvas
- ✅ Data dari database (jika ada)
- ✅ Atau fallback ke data statis (jika database kosong)

---

## Test dengan Admin App (Optional)

### Step 1: Start Admin App

```bash
cd apps/admin
npm run dev
```

✅ Admin akan running di `http://localhost:3001`

### Step 2: Login & Add Portfolio

1. Buka `http://localhost:3001`
2. Login dengan credentials
3. Tambah portfolio baru dengan gambar

### Step 3: Verify di Life App

1. Buka `http://localhost:3000`
2. Refresh page (F5)
3. Portfolio baru akan muncul! 🎉

---

## Quick Verification

### Check API Response

```bash
curl http://localhost:3002/api/portfolios
```

Expected: JSON array of portfolios

### Check Environment Variable

```bash
# File: apps/life/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

---

## Troubleshooting

### Portfolio tidak muncul?

1. Cek API running: `http://localhost:3002/api/portfolios`
2. Cek browser console (F12) untuk errors
3. Refresh browser (F5)

### API Error?

- Pastikan database connection OK
- Cek `apps/api/.env` untuk DATABASE_URL

### Still Issues?

Lihat dokumentasi lengkap di:

- `apps/life/API_INTEGRATION.md`
- `LIFE_API_INTEGRATION_COMPLETE.md`

---

## Success! 🎉

Jika portfolio muncul di Life app, integration berhasil!

Portfolio yang diinput dari Admin app akan langsung tersedia di Life app.
