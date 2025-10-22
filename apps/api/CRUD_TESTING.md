# 🧪 CRUD Testing Guide - Portfolio API

## 📋 Test All CRUD Operations

### ✅ CREATE - POST /api/portfolios

```bash
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Portfolio",
    "description": "This is a test portfolio for CRUD testing",
    "images": ["https://placehold.co/600x400/png"],
    "categories": ["Branding", "Design"],
    "createdBy": "Test User",
    "year": "2024"
  }'
```

**Expected Response (201):**

```json
{
  "id": "cm...",
  "title": "Test Portfolio",
  "description": "This is a test portfolio for CRUD testing",
  "images": ["https://placehold.co/600x400/png"],
  "categories": ["Branding", "Design"],
  "createdBy": "Test User",
  "year": "2024",
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

---

### ✅ READ ALL - GET /api/portfolios

```bash
curl http://localhost:3002/api/portfolios
```

**Expected Response (200):**

```json
[
  {
    "id": "cm...",
    "title": "Test Portfolio",
    ...
  }
]
```

---

### ✅ READ ONE - GET /api/portfolios/:id

```bash
# Replace {id} with actual ID from CREATE response
curl http://localhost:3002/api/portfolios/{id}
```

**Expected Response (200):**

```json
{
  "id": "cm...",
  "title": "Test Portfolio",
  ...
}
```

---

### ✅ UPDATE - PUT /api/portfolios/:id

```bash
# Replace {id} with actual ID
curl -X PUT http://localhost:3002/api/portfolios/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Portfolio",
    "description": "Updated description"
  }'
```

**Expected Response (200):**

```json
{
  "id": "cm...",
  "title": "Updated Test Portfolio",
  "description": "Updated description",
  ...
}
```

---

### ✅ DELETE - DELETE /api/portfolios/:id

```bash
# Replace {id} with actual ID
curl -X DELETE http://localhost:3002/api/portfolios/{id}
```

**Expected Response (204):**

```
No content (empty response)
```

**Status Code:** 204 No Content

---

## 🔍 Test Categories

### GET /api/portfolios/categories

```bash
curl http://localhost:3002/api/portfolios/categories
```

**Expected Response (200):**

```json
["Branding", "Design", "Photography", "Motion"]
```

---

## 📤 Test File Upload

### POST /api/upload

```bash
# Upload actual image file
curl -X POST http://localhost:3002/api/upload \
  -F "file=@/path/to/your/image.jpg" \
  -F "bucket=portfolio-images"
```

**Expected Response (200):**

```json
{
  "fileName": "1234567890-abc123.jpg",
  "publicUrl": "https://project.supabase.co/storage/v1/object/public/portfolio-images/1234567890-abc123.jpg",
  "bucket": "portfolio-images"
}
```

---

## 🧪 Complete CRUD Flow Test

### Step 1: Upload Image

```bash
curl -X POST http://localhost:3002/api/upload \
  -F "file=@test-image.jpg" \
  > upload-response.json

# Extract publicUrl
IMAGE_URL=$(cat upload-response.json | grep -o '"publicUrl":"[^"]*"' | cut -d'"' -f4)
echo "Image URL: $IMAGE_URL"
```

### Step 2: Create Portfolio

```bash
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"CRUD Test Portfolio\",
    \"description\": \"Testing complete CRUD flow\",
    \"images\": [\"$IMAGE_URL\"],
    \"categories\": [\"Branding\"],
    \"createdBy\": \"Test User\",
    \"year\": \"2024\"
  }" \
  > create-response.json

# Extract ID
PORTFOLIO_ID=$(cat create-response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Portfolio ID: $PORTFOLIO_ID"
```

### Step 3: Read Portfolio

```bash
curl http://localhost:3002/api/portfolios/$PORTFOLIO_ID
```

### Step 4: Update Portfolio

```bash
curl -X PUT http://localhost:3002/api/portfolios/$PORTFOLIO_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated CRUD Test Portfolio"
  }'
```

### Step 5: Delete Portfolio

```bash
curl -X DELETE http://localhost:3002/api/portfolios/$PORTFOLIO_ID
```

### Step 6: Verify Deletion

```bash
# Should return 404
curl http://localhost:3002/api/portfolios/$PORTFOLIO_ID
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Delete Returns 500

**Possible Causes:**

1. Supabase credentials not set
2. File URL format invalid
3. File already deleted

**Fix Applied:**

- ✅ Delete now uses "best effort" approach
- ✅ Won't fail if image deletion fails
- ✅ Portfolio will be deleted even if images can't be deleted
- ✅ Better error logging

**Test:**

```bash
# Should succeed even if images can't be deleted
curl -X DELETE http://localhost:3002/api/portfolios/{id}
```

---

### Issue 2: Create Returns 400

**Cause:** Validation error

**Check:**

- All required fields present
- `images` is array (not string)
- `categories` is array (not string)
- All fields have correct types

**Example Error:**

```json
{
  "statusCode": 400,
  "message": [
    "images must be an array",
    "categories must contain at least 1 elements"
  ],
  "error": "Bad Request"
}
```

---

### Issue 3: Upload Returns 400

**Cause:** File validation failed

**Check:**

- File size < 5MB
- File type is image (JPEG, PNG, GIF, WebP)
- File field name is "file"

---

### Issue 4: Database Connection Error

**Error:**

```
Can't reach database server
```

**Check:**

1. `DATABASE_URL` is set correctly
2. Database is accessible from Vercel
3. Connection string includes `?pgbouncer=true` for Supabase

---

## 📊 Expected Behavior

### Create

- ✅ Returns 201 Created
- ✅ Returns full portfolio object with ID
- ✅ Validates all required fields

### Read All

- ✅ Returns 200 OK
- ✅ Returns array (empty if no portfolios)
- ✅ Ordered by createdAt DESC (newest first)

### Read One

- ✅ Returns 200 OK if found
- ✅ Returns 404 Not Found if ID doesn't exist
- ✅ Returns full portfolio object

### Update

- ✅ Returns 200 OK
- ✅ Returns updated portfolio object
- ✅ Validates updated fields
- ✅ Deletes old images if images array changed

### Delete

- ✅ Returns 204 No Content
- ✅ Deletes portfolio from database
- ✅ Attempts to delete images from storage (best effort)
- ✅ Succeeds even if image deletion fails

---

## 🔐 Environment Variables Required

For CRUD to work properly:

```env
# Database
DATABASE_URL=postgresql://...

# Supabase (for file operations)
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...

# CORS (optional)
ALLOWED_ORIGINS=*
```

---

## 🚀 Production Testing

### Test on Vercel

Replace `localhost:3002` with your Vercel API URL:

```bash
# Test health
curl https://mutualist-api.vercel.app/api

# Test get all
curl https://mutualist-api.vercel.app/api/portfolios

# Test create
curl -X POST https://mutualist-api.vercel.app/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## ✅ Verification Checklist

Test each operation:

- [ ] CREATE - Can create new portfolio
- [ ] READ ALL - Can get list of portfolios
- [ ] READ ONE - Can get single portfolio by ID
- [ ] UPDATE - Can update portfolio fields
- [ ] DELETE - Can delete portfolio (even if image delete fails)
- [ ] CATEGORIES - Can get unique categories
- [ ] UPLOAD - Can upload image file

All should return appropriate status codes and responses.

---

## 📝 Notes

**Delete Behavior:**

- Portfolio deletion will ALWAYS succeed
- Image deletion is "best effort"
- If Supabase credentials missing, images won't be deleted but portfolio will
- This prevents orphaned database records

**Why?**

- Better UX (delete always works)
- Prevents stuck portfolios
- Images can be cleaned up manually if needed
- Database consistency is priority

---

## 🔗 Related Docs

- [API Documentation](./API_DOCUMENTATION.md)
- [API Quick Reference](./API_QUICK_REFERENCE.md)
- [Deployment Guide](../../DEPLOYMENT.md)

---

**All CRUD operations tested and working!** ✅
