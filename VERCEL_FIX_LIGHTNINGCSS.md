# 🔧 Fix Vercel Deployment - LightningCSS Error

## ❌ Error yang Muncul:

```
Error: Cannot find module '../lightningcss.linux-x64-gnu.node'
```

## ✅ Solusi yang Sudah Diterapkan:

### 1. Tambahkan postinstall script

Sudah ditambahkan di:

- ✅ `package.json` (root)
- ✅ `apps/life/package.json`
- ✅ `apps/admin/package.json`

Script yang ditambahkan:

```json
"postinstall": "npm rebuild lightningcss --platform=linux --arch=x64 || true"
```

### 2. Update Vercel Settings

**PENTING:** Gunakan **npm** bukan bun untuk install di Vercel!

---

## 🌐 Vercel Configuration

### **Life (Public Frontend)**

```bash
# Framework Preset
Next.js

# Root Directory
apps/life

# Build Command
cd ../.. && turbo run build --filter=life

# Output Directory
.next

# Install Command (PENTING - GUNAKAN NPM!)
cd ../.. && npm install

# Node Version
20.x
```

---

### **Admin (Dashboard)**

```bash
# Framework Preset
Next.js

# Root Directory
apps/admin

# Build Command
cd ../.. && turbo run build --filter=admin

# Output Directory
.next

# Install Command (PENTING - GUNAKAN NPM!)
cd ../.. && npm install

# Node Version
20.x
```

---

## 🔍 Kenapa Harus npm?

1. **Bun** di Vercel belum fully support native binaries seperti lightningcss
2. **npm** lebih stabil untuk rebuild native modules
3. **postinstall** script akan otomatis rebuild lightningcss untuk Linux x64

---

## 🧪 Test Lokal Sebelum Deploy

```bash
# Test dengan npm (simulasi Vercel)
cd apps/life
rm -rf node_modules
npm install
npm run build

# Jika berhasil, deploy ke Vercel
```

---

## 🚀 Deploy Steps

1. **Commit & Push** perubahan package.json

   ```bash
   git add .
   git commit -m "fix: add postinstall script for lightningcss"
   git push
   ```

2. **Vercel akan auto-deploy** atau trigger manual

3. **Verifikasi** build logs:
   - Cari "postinstall" di logs
   - Pastikan lightningcss rebuild berhasil
   - Build Next.js harus sukses

---

## 🐛 Jika Masih Error

### Opsi 1: Clear Vercel Cache

1. Go to Vercel Dashboard
2. Project Settings → General
3. Scroll to "Build & Development Settings"
4. Click **"Clear Cache"**
5. Redeploy

### Opsi 2: Tambahkan .npmrc

Buat file `.npmrc` di root:

```
platform=linux
arch=x64
```

### Opsi 3: Lock npm version

Tambahkan di root `package.json`:

```json
"engines": {
  "node": ">=20",
  "npm": ">=10"
}
```

---

## 📊 Expected Build Output

Setelah fix, build logs harus seperti ini:

```
✓ Installing dependencies...
> postinstall
> npm rebuild lightningcss --platform=linux --arch=x64 || true

rebuilt 1 package in 2s

✓ Running "turbo run build"
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Build completed successfully!
```

---

## 🎯 Summary

**Yang Sudah Dilakukan:**

- ✅ Tambah postinstall script di 3 package.json
- ✅ Script akan auto-rebuild lightningcss untuk Linux

**Yang Harus Dilakukan:**

1. ✅ Commit & push changes
2. ✅ Update Vercel install command ke `npm install`
3. ✅ Clear Vercel cache (optional)
4. ✅ Redeploy

**Install Command di Vercel:**

```bash
cd ../.. && npm install
```

**JANGAN gunakan:**

```bash
cd ../.. && bun install  ❌
```

---

## 📞 Troubleshooting

### Error: "postinstall script failed"

**Solution:** Tambahkan `|| true` di akhir script (sudah ditambahkan)

### Error: "npm not found"

**Solution:** Vercel default sudah ada npm, pastikan Node version 20.x

### Error: "lightningcss still not found"

**Solution:**

1. Clear Vercel cache
2. Pastikan install command menggunakan npm
3. Check build logs untuk error detail

---

## ✅ Verification Checklist

Sebelum deploy, pastikan:

- [ ] `postinstall` script ada di root package.json
- [ ] `postinstall` script ada di apps/life/package.json
- [ ] `postinstall` script ada di apps/admin/package.json
- [ ] Vercel install command menggunakan `npm install`
- [ ] Git changes sudah di-commit dan push
- [ ] Vercel cache sudah di-clear (optional)

---

Setelah semua checklist ✅, deploy ulang ke Vercel!

Build seharusnya berhasil sekarang. 🎉
