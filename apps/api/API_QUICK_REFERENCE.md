# 🚀 API Quick Reference

Base URL: `http://localhost:3002/api`

---

## 📋 Endpoints Summary

| Method | Endpoint                     | Description           | Auth |
| ------ | ---------------------------- | --------------------- | ---- |
| GET    | `/`                          | Health check          | ❌   |
| GET    | `/api/portfolios`            | Get all portfolios    | ❌   |
| GET    | `/api/portfolios/:id`        | Get portfolio by ID   | ❌   |
| GET    | `/api/portfolios/categories` | Get unique categories | ❌   |
| POST   | `/api/portfolios`            | Create portfolio      | ❌   |
| PUT    | `/api/portfolios/:id`        | Update portfolio      | ❌   |
| DELETE | `/api/portfolios/:id`        | Delete portfolio      | ❌   |
| POST   | `/api/upload`                | Upload image file     | ❌   |

---

## 🔥 Quick Examples

### Get All Portfolios

```bash
curl http://localhost:3002/api/portfolios
```

### Get Categories

```bash
curl http://localhost:3002/api/portfolios/categories
```

### Create Portfolio

```bash
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Name",
    "description": "Description here",
    "images": ["https://example.com/image.jpg"],
    "categories": ["Branding", "Design"],
    "createdBy": "Designer Name",
    "year": "2024"
  }'
```

### Upload Image

```bash
curl -X POST http://localhost:3002/api/upload \
  -F "file=@image.jpg"
```

### Update Portfolio

```bash
curl -X PUT http://localhost:3002/api/portfolios/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete Portfolio

```bash
curl -X DELETE http://localhost:3002/api/portfolios/{id}
```

---

## 📦 Request/Response Examples

### Portfolio Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Brand Identity Design",
  "description": "Complete brand identity for tech startup",
  "images": [
    "https://supabase.co/storage/.../image1.jpg",
    "https://supabase.co/storage/.../image2.jpg"
  ],
  "categories": ["Branding", "Design"],
  "createdBy": "John Doe",
  "year": "2024",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Upload Response

```json
{
  "fileName": "1234567890-abc123.jpg",
  "publicUrl": "https://project.supabase.co/storage/v1/object/public/portfolio-images/1234567890-abc123.jpg",
  "bucket": "portfolio-images"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## ✅ Validation Rules

### Create/Update Portfolio

| Field       | Type     | Required | Rules      |
| ----------- | -------- | -------- | ---------- |
| title       | string   | ✅       | Min 1 char |
| description | string   | ✅       | Min 1 char |
| images      | string[] | ✅       | Min 1 URL  |
| categories  | string[] | ✅       | Min 1 item |
| createdBy   | string   | ✅       | Min 1 char |
| year        | string   | ✅       | -          |

### Upload File

| Field  | Type   | Required | Rules                       |
| ------ | ------ | -------- | --------------------------- |
| file   | file   | ✅       | Max 5MB, Image only         |
| bucket | string | ❌       | Default: "portfolio-images" |

**Allowed file types:** JPEG, PNG, GIF, WebP

---

## 🎯 Common Use Cases

### 1. Create Portfolio with Image Upload

```javascript
// Step 1: Upload image
const formData = new FormData();
formData.append('file', imageFile);

const uploadRes = await fetch('http://localhost:3002/api/upload', {
  method: 'POST',
  body: formData,
});
const { publicUrl } = await uploadRes.json();

// Step 2: Create portfolio
const portfolioRes = await fetch('http://localhost:3002/api/portfolios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Project',
    description: 'Project description',
    images: [publicUrl],
    categories: ['Branding'],
    createdBy: 'Designer',
    year: '2024',
  }),
});
const portfolio = await portfolioRes.json();
```

### 2. Filter by Category (Client-side)

```javascript
// Get all portfolios
const res = await fetch('http://localhost:3002/api/portfolios');
const portfolios = await res.json();

// Filter by category
const brandingProjects = portfolios.filter((p) =>
  p.categories.includes('Branding'),
);
```

### 3. Update Portfolio Images

```javascript
// Upload new image
const formData = new FormData();
formData.append('file', newImageFile);

const uploadRes = await fetch('http://localhost:3002/api/upload', {
  method: 'POST',
  body: formData,
});
const { publicUrl } = await uploadRes.json();

// Update portfolio with new image
const updateRes = await fetch(`http://localhost:3002/api/portfolios/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    images: [...existingImages, publicUrl],
  }),
});
```

---

## 🔍 Status Codes

| Code | Meaning                           |
| ---- | --------------------------------- |
| 200  | OK - Success                      |
| 201  | Created - Resource created        |
| 204  | No Content - Deleted successfully |
| 400  | Bad Request - Validation error    |
| 404  | Not Found - Resource not found    |
| 500  | Internal Server Error             |

---

## 🌐 Environment Variables

```env
# Required
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...

# Optional
PORT=3002
HOST=0.0.0.0
NODE_ENV=production
ALLOWED_ORIGINS=https://app1.com,https://app2.com
```

---

## 🧪 Testing Tools

### cURL

```bash
curl http://localhost:3002/api/portfolios
```

### HTTPie

```bash
http GET http://localhost:3002/api/portfolios
```

### JavaScript Fetch

```javascript
const res = await fetch('http://localhost:3002/api/portfolios');
const data = await res.json();
```

### Axios

```javascript
const { data } = await axios.get('http://localhost:3002/api/portfolios');
```

---

## 📊 Available Categories

Default categories (can be extended):

- Branding
- Design
- Photography
- Motion
- Illustration
- Web Design
- UI/UX
- 3D
- Art Direction

---

## 🚨 Common Errors

### 1. CORS Error

**Problem:** Request blocked by CORS  
**Solution:** Add your domain to `ALLOWED_ORIGINS` env var

### 2. Database Connection Failed

**Problem:** Can't connect to database  
**Solution:** Check `DATABASE_URL` is correct

### 3. File Upload Failed

**Problem:** Image upload returns 400  
**Solution:** Check file size (<5MB) and type (image only)

### 4. Validation Error

**Problem:** 400 with validation messages  
**Solution:** Check all required fields are provided

---

## 📞 Quick Links

- [Full API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](../../DEPLOYMENT.md)
- [Database Setup](../../DATABASE_SETUP.md)

---

**Need help?** Check the full documentation or server logs for detailed errors.
