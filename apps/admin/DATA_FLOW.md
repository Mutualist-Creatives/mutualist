# Portfolio Data Flow

## Images Data Type Handling

### Database Schema (Prisma)

```prisma
model Portfolio {
  images String[] // Array of strings
}
```

### API Types (lib/api.ts)

```typescript
export interface Portfolio {
  images: string[]; // Array of strings
}
```

### Form State (portfolio-form.tsx)

```typescript
const [formData, setFormData] = useState({
  images: portfolio?.images?.join("\n") || "", // Array → String (for textarea)
});
```

### Data Flow

#### 1. Loading (Edit Mode)

```
API Response → Array
  ↓
portfolio.images = ["url1", "url2", "url3"]
  ↓
join("\n") → String
  ↓
formData.images = "url1\nurl2\nurl3"
  ↓
Textarea displays line by line
```

#### 2. Preview (Real-time)

```
Textarea value (String)
  ↓
split("\n") → Array
  ↓
filter(trim) → Remove empty lines
  ↓
previewImages = ["url1", "url2", "url3"]
  ↓
Preview components receive array
```

#### 3. Submit (Save)

```
formData.images (String)
  ↓
split("\n") → Array
  ↓
filter(trim) → Remove empty lines
  ↓
data.images = ["url1", "url2", "url3"]
  ↓
JSON.stringify → API Request
  ↓
Database stores as String[]
```

## Key Points

✅ **Database**: Stores as `String[]` (array)
✅ **API**: Expects and returns `string[]` (array)
✅ **Form State**: Uses `string` (newline-separated) for textarea
✅ **Conversion**: Automatic conversion between string ↔ array

## Example

### Input (Textarea)

```
https://example.com/image1.jpg
https://example.com/image2.jpg
https://example.com/image3.jpg
```

### Stored in Database

```json
{
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```

### API Response

```json
{
  "id": "abc123",
  "title": "My Portfolio",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```

## Validation

### URL Validation

```typescript
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Preview Validation

```typescript
const previewImages = formData.images.split("\n").filter((img) => img.trim());

const hasValidPreview =
  formData.title.trim() !== "" &&
  previewImages.length > 0 &&
  isValidUrl(previewImages[0]);
```

## Components Using Images Array

1. **portfolio-form.tsx**: Converts array ↔ string
2. **portfolio-preview-card.tsx**: Receives array, uses first image
3. **portfolio-preview-modal.tsx**: Receives array, shows carousel
4. **portfolio-search.tsx**: Receives array from API
5. **page.tsx** (dashboard): Receives array from API
