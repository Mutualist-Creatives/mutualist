# Upload Flow Documentation

## 🔄 Alur Upload File (Upload on Submit)

### Alur Lengkap:

```
1. User membuka form portfolio (New/Edit)
   ↓
2. User klik tombol Upload (📤)
   ↓
3. File picker terbuka
   ↓
4. User pilih file gambar
   ↓
5. File disimpan di state (belum upload ke Supabase)
   ↓
6. Preview URL dibuat dengan URL.createObjectURL()
   ↓
7. Nama file dan ukuran ditampilkan di bawah input
   ↓
8. User mengisi form lainnya (title, description, dll)
   ↓
9. User klik "Create Portfolio" atau "Update Portfolio"
   ↓
10. Semua file diupload ke Supabase satu per satu
    ↓
11. URL dari Supabase dikumpulkan
    ↓
12. Data portfolio disimpan dengan URL yang sudah diupload
    ↓
13. Redirect ke halaman portfolios
```

### Validasi File:

**Tipe File yang Diizinkan:**

- image/jpeg
- image/jpg
- image/png
- image/gif
- image/webp

**Ukuran Maksimal:**

- 5MB per file

### Keuntungan Alur Ini:

✅ **Tidak ada file orphan** - File hanya diupload jika user benar-benar submit form
✅ **User experience lebih baik** - User bisa preview file sebelum upload
✅ **Bandwidth efisien** - Upload hanya terjadi sekali saat submit
✅ **Rollback mudah** - Jika user cancel, tidak ada file yang tersimpan di Supabase
✅ **Progress indicator** - User tahu kapan file sedang diupload

### State Management:

```typescript
// State untuk menyimpan URL (bisa URL asli atau blob URL untuk preview)
const [images, setImages] = useState<string[]>([""]);

// State untuk menyimpan File object yang dipilih user
const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);

// State untuk loading saat upload
const [uploading, setUploading] = useState(false);
```

### Fungsi Utama:

**1. handleFileSelect(index, file)**

- Validasi tipe file dan ukuran
- Simpan file di state
- Buat preview URL dengan `URL.createObjectURL()`
- Tampilkan nama file dan ukuran

**2. uploadFiles()**

- Loop semua file yang ada di state
- Upload satu per satu ke Supabase
- Kumpulkan semua URL yang berhasil diupload
- Return array of URLs

**3. handleSubmit()**

- Upload semua file terlebih dahulu
- Tunggu sampai semua file selesai diupload
- Simpan portfolio dengan URL yang sudah diupload
- Redirect ke halaman portfolios

### Error Handling:

**Jika upload file gagal:**

- Error message ditampilkan
- Form tidak di-submit
- User bisa coba lagi

**Jika save portfolio gagal:**

- File sudah terupload ke Supabase (orphan)
- Error message ditampilkan
- User bisa coba submit lagi tanpa upload ulang

### UI/UX Features:

✅ **File info display** - Nama file dan ukuran ditampilkan
✅ **Loading states** - Button disabled saat upload/save
✅ **Toast notifications** - Feedback untuk setiap aksi
✅ **Progress message** - "Uploading images..." saat upload
✅ **Validation feedback** - Error message jika file tidak valid

### Example Usage:

```typescript
// User pilih file
handleFileSelect(0, selectedFile);
// Output: "File 'image.jpg' selected. Will be uploaded on save."

// User submit form
handleSubmit();
// Output: "Uploading images..."
// Output: "Portfolio created successfully!"
```

### API Endpoint Used:

**POST** `/api/upload`

- Upload file ke Supabase Storage
- Return public URL dan path

**POST/PUT** `/api/portfolios` atau `/api/portfolios/:id`

- Simpan/update portfolio dengan image URLs
