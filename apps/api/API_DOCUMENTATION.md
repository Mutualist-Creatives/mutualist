# API Documentation

## Base URL

```
http://localhost:3002/api
```

## Endpoints

### Portfolio Endpoints

#### 1. Get All Portfolios

```http
GET /api/portfolios
```

**Response:** `200 OK`

```json
[
  {
    "id": "cmgj4e3gt0001a890433t35cc",
    "title": "Project Alpha",
    "createdBy": "Creative Studio",
    "year": "2023",
    "category": "Branding",
    "description": "A complete branding overhaul for a leading tech company.",
    "images": ["/assets/portofolios/1.png"],
    "createdAt": "2025-10-09T07:52:40.974Z",
    "updatedAt": "2025-10-09T07:52:40.974Z"
  }
]
```

---

#### 2. Get Categories

```http
GET /api/portfolios/categories
```

**Response:** `200 OK`

```json
["Branding", "Web Design", "Mobile App", "Illustration", "UI/UX", "Photography"]
```

---

#### 3. Get Single Portfolio

```http
GET /api/portfolios/:id
```

**Response:** `200 OK`

```json
{
  "id": "cmgj4e3gt0001a890433t35cc",
  "title": "Project Alpha",
  "createdBy": "Creative Studio",
  "year": "2023",
  "category": "Branding",
  "description": "A complete branding overhaul for a leading tech company.",
  "images": ["/assets/portofolios/1.png"],
  "createdAt": "2025-10-09T07:52:40.974Z",
  "updatedAt": "2025-10-09T07:52:40.974Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Portfolio with ID {id} not found",
  "error": "Not Found"
}
```

---

#### 4. Create Portfolio

```http
POST /api/portfolios
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Test Project",
  "createdBy": "Test User",
  "year": "2024",
  "category": "Testing",
  "description": "This is a test project",
  "images": ["https://example.com/test.jpg"]
}
```

**Validation Rules:**

- `title`: Required, string
- `createdBy`: Required, string
- `year`: Required, string
- `category`: Required, string
- `description`: Required, string
- `images`: Required, array of strings

**Response:** `201 Created`

```json
{
  "id": "cmgj4hr4s0000a844m5c0pk6p",
  "title": "Test Project",
  "createdBy": "Test User",
  "year": "2024",
  "category": "Testing",
  "description": "This is a test project",
  "images": ["https://example.com/test.jpg"],
  "createdAt": "2025-10-09T08:00:00.000Z",
  "updatedAt": "2025-10-09T08:00:00.000Z"
}
```

**Error Response:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": ["title should not be empty", "title must be a string"],
  "error": "Bad Request"
}
```

---

#### 5. Update Portfolio

```http
PUT /api/portfolios/:id
Content-Type: application/json
```

**Request Body:** (All fields optional)

```json
{
  "title": "Updated Test Project",
  "description": "Updated description"
}
```

**Response:** `200 OK`

```json
{
  "id": "cmgj4hr4s0000a844m5c0pk6p",
  "title": "Updated Test Project",
  "createdBy": "Test User",
  "year": "2024",
  "category": "Testing",
  "description": "Updated description",
  "images": ["https://example.com/test.jpg"],
  "createdAt": "2025-10-09T08:00:00.000Z",
  "updatedAt": "2025-10-09T08:05:00.000Z"
}
```

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Portfolio with ID {id} not found",
  "error": "Not Found"
}
```

---

#### 6. Delete Portfolio

```http
DELETE /api/portfolios/:id
```

**Response:** `204 No Content`

**Error Response:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Portfolio with ID {id} not found",
  "error": "Not Found"
}
```

---

## Testing

Run the automated test suite:

```bash
node test-api.js
```

Or use the HTTP file with REST Client extension:

```
test-api.http
```

---

## Configuration

### Environment Variables

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3002
```

### CORS

Configured to allow:

- `http://localhost:3000` (Frontend)
- `http://localhost:3002` (API)

### Validation

- Automatic validation using `class-validator`
- Whitelist enabled (strips unknown properties)
- Transform enabled (auto type conversion)
- Forbidden non-whitelisted properties

---

## Database

### Schema

```prisma
model Portfolio {
  id          String   @id @default(cuid())
  title       String
  createdBy   String
  year        String
  category    String
  description String   @db.Text
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Seed Data

Run seed to populate initial data:

```bash
bunx prisma db seed
```

---

## Status Codes

- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
