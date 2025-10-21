# 📚 API Documentation - Mutualist Backend

Base URL: `http://localhost:3002/api` (Development)  
Production: `https://your-domain.com/api`

---

## 🏠 Health Check

### GET `/`

Check if API is running.

**Response:**

```json
"Hello World!"
```

---

## 📁 Portfolio Endpoints

### 1. Get All Portfolios

**GET** `/api/portfolios`

Get list of all portfolios.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Project Title",
    "description": "Project description",
    "images": ["url1", "url2"],
    "categories": ["Branding", "Design"],
    "createdBy": "Designer Name",
    "year": "2024",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 2. Get Portfolio by ID

**GET** `/api/portfolios/:id`

Get single portfolio by ID.

**Parameters:**

- `id` (path) - Portfolio UUID

**Response:**

```json
{
  "id": "uuid",
  "title": "Project Title",
  "description": "Project description",
  "images": ["url1", "url2"],
  "categories": ["Branding", "Design"],
  "createdBy": "Designer Name",
  "year": "2024",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Portfolio not found
- `500 Internal Server Error` - Server error

---

### 3. Get Categories

**GET** `/api/portfolios/categories`

Get list of unique categories from all portfolios.

**Response:**

```json
["Branding", "Design", "Photography", "Motion", "Illustration"]
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### 4. Create Portfolio

**POST** `/api/portfolios`

Create new portfolio.

**Request Body:**

```json
{
  "title": "Project Title",
  "description": "Project description",
  "images": ["url1", "url2"],
  "categories": ["Branding", "Design"],
  "createdBy": "Designer Name",
  "year": "2024"
}
```

**Validation Rules:**

- `title` - Required, string, min 1 char
- `description` - Required, string, min 1 char
- `images` - Required, array of strings (URLs), min 1 image
- `categories` - Required, array of strings, min 1 category
- `createdBy` - Required, string, min 1 char
- `year` - Required, string

**Response:**

```json
{
  "id": "uuid",
  "title": "Project Title",
  "description": "Project description",
  "images": ["url1", "url2"],
  "categories": ["Branding", "Design"],
  "createdBy": "Designer Name",
  "year": "2024",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**

- `201 Created` - Success
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

**Example cURL:**

```bash
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "description": "Amazing project description",
    "images": ["https://example.com/image1.jpg"],
    "categories": ["Branding"],
    "createdBy": "John Doe",
    "year": "2024"
  }'
```

---

### 5. Update Portfolio

**PUT** `/api/portfolios/:id`

Update existing portfolio.

**Parameters:**

- `id` (path) - Portfolio UUID

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "images": ["url1", "url2", "url3"],
  "categories": ["Branding", "Design", "Motion"],
  "createdBy": "Designer Name",
  "year": "2024"
}
```

**Validation Rules:**

- All fields are optional
- If provided, must follow same rules as Create

**Response:**

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "images": ["url1", "url2", "url3"],
  "categories": ["Branding", "Design", "Motion"],
  "createdBy": "Designer Name",
  "year": "2024",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - Validation error
- `404 Not Found` - Portfolio not found
- `500 Internal Server Error` - Server error

**Example cURL:**

```bash
curl -X PUT http://localhost:3002/api/portfolios/uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Project Title"
  }'
```

---

### 6. Delete Portfolio

**DELETE** `/api/portfolios/:id`

Delete portfolio by ID. Also deletes associated images from Supabase Storage.

**Parameters:**

- `id` (path) - Portfolio UUID

**Response:**

```
No content (empty response)
```

**Status Codes:**

- `204 No Content` - Success
- `404 Not Found` - Portfolio not found
- `500 Internal Server Error` - Server error

**Example cURL:**

```bash
curl -X DELETE http://localhost:3002/api/portfolios/uuid-here
```

---

## 📤 Upload Endpoints

### Upload File

**POST** `/api/upload`

Upload image file to Supabase Storage.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `file` (file) - Image file (required)
  - `bucket` (string) - Bucket name (optional, default: "portfolio-images")

**Supported File Types:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**File Size Limit:** 5MB

**Response:**

```json
{
  "fileName": "1234567890-abc123.jpg",
  "publicUrl": "https://project.supabase.co/storage/v1/object/public/portfolio-images/1234567890-abc123.jpg",
  "bucket": "portfolio-images"
}
```

**Status Codes:**

- `200 OK` - Success
- `400 Bad Request` - No file uploaded or invalid file type
- `500 Internal Server Error` - Upload failed

**Example cURL:**

```bash
curl -X POST http://localhost:3002/api/upload \
  -F "file=@/path/to/image.jpg" \
  -F "bucket=portfolio-images"
```

**Example JavaScript (FormData):**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('bucket', 'portfolio-images');

const response = await fetch('http://localhost:3002/api/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.publicUrl); // Use this URL in portfolio
```

---

## 🔐 Authentication (Coming Soon)

Currently, all endpoints are **public** (no authentication required).

**Planned Protected Endpoints:**

- `POST /api/portfolios` - Create (Admin only)
- `PUT /api/portfolios/:id` - Update (Admin only)
- `DELETE /api/portfolios/:id` - Delete (Admin only)
- `POST /api/upload` - Upload (Admin only)

**Public Endpoints:**

- `GET /api/portfolios` - List all
- `GET /api/portfolios/:id` - Get one
- `GET /api/portfolios/categories` - Get categories

---

## 🌐 CORS Configuration

**Allowed Origins:**

- Development: `http://localhost:3000`, `http://localhost:3001`
- Production: Set via `ALLOWED_ORIGINS` environment variable

**Allowed Methods:**

- GET, POST, PUT, DELETE, PATCH, OPTIONS

**Credentials:** Enabled

---

## 📊 Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

**Common Error Codes:**

- `400 Bad Request` - Invalid input/validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Validation Error Example:**

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "images must be an array",
    "categories must contain at least 1 elements"
  ],
  "error": "Bad Request"
}
```

---

## 🧪 Testing Endpoints

### Using cURL

**Get all portfolios:**

```bash
curl http://localhost:3002/api/portfolios
```

**Get categories:**

```bash
curl http://localhost:3002/api/portfolios/categories
```

**Create portfolio:**

```bash
curl -X POST http://localhost:3002/api/portfolios \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test description",
    "images": ["https://placehold.co/600x400"],
    "categories": ["Branding"],
    "createdBy": "Test User",
    "year": "2024"
  }'
```

### Using Postman

1. Import collection from `postman_collection.json` (if available)
2. Set base URL: `http://localhost:3002/api`
3. Test each endpoint

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set URL: `http://localhost:3002/api/portfolios`
4. Send request

---

## 🔄 Workflow Example

### Complete Portfolio Creation Flow:

1. **Upload Image:**

```bash
POST /api/upload
Body: file (multipart/form-data)
Response: { publicUrl: "https://..." }
```

2. **Create Portfolio:**

```bash
POST /api/portfolios
Body: {
  "title": "New Project",
  "description": "Description",
  "images": ["https://..."], // Use publicUrl from step 1
  "categories": ["Branding"],
  "createdBy": "Designer",
  "year": "2024"
}
Response: { id: "uuid", ... }
```

3. **Verify:**

```bash
GET /api/portfolios/:id
Response: { id: "uuid", title: "New Project", ... }
```

---

## 📝 Database Schema

### Portfolio Table

```prisma
model Portfolio {
  id          String   @id @default(uuid())
  title       String
  description String
  images      String[] // Array of image URLs
  categories  String[] // Array of category names
  createdBy   String
  year        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🚀 Rate Limiting

Currently: **No rate limiting**

Planned:

- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## 📞 Support

For issues or questions:

1. Check error response message
2. Verify request format matches documentation
3. Check server logs for detailed errors
4. Ensure database connection is working

---

## 🔗 Related Documentation

- [Deployment Guide](../../DEPLOYMENT.md)
- [Database Setup](../../DATABASE_SETUP.md)
- [Environment Setup](../../ENVIRONMENT_SETUP.md)

---

**Last Updated:** 2024-01-01  
**API Version:** 1.0.0
