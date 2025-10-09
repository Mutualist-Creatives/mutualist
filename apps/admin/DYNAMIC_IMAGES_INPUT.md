# Dynamic Images Input Feature

## Overview

Images input sekarang menggunakan dynamic fields dengan kemampuan tambah dan hapus untuk setiap URL secara individual.

## Features

### 1. Dynamic Fields

- Setiap image URL memiliki input field sendiri
- Minimal 1 field (tidak bisa dihapus semua)
- Bisa menambah field baru dengan tombol "Add Image"
- Bisa menghapus field individual dengan tombol trash

### 2. User Experience

- **Add Button**: Menambah field baru di bawah
- **Delete Button**: Menghapus field tertentu (disabled jika hanya 1 field)
- **Required**: Field pertama wajib diisi
- **Placeholder**: Setiap field menampilkan "Image URL 1", "Image URL 2", dst

### 3. Validation

- Field pertama (index 0) adalah required
- Field lainnya optional
- Empty fields otomatis difilter saat submit
- URL validation untuk preview

## UI Components

### Add Image Button

```tsx
<Button type="button" variant="outline" size="sm" onClick={addImageField}>
  <Plus className="h-4 w-4" />
  Add Image
</Button>
```

### Image Input Field

```tsx
<Input
  value={image}
  onChange={(e) => updateImageField(index, e.target.value)}
  placeholder={`Image URL ${index + 1}`}
  required={index === 0}
/>
```

### Delete Button

```tsx
<Button
  type="button"
  variant="outline"
  size="icon"
  onClick={() => removeImageField(index)}
  disabled={images.length === 1}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

## State Management

### Images State

```typescript
const [images, setImages] = useState<string[]>(
  portfolio?.images && portfolio.images.length > 0 ? portfolio.images : [""]
);
```

### Handlers

#### Add Image Field

```typescript
const addImageField = () => {
  setImages([...images, ""]);
};
```

#### Remove Image Field

```typescript
const removeImageField = (index: number) => {
  if (images.length > 1) {
    setImages(images.filter((_, i) => i !== index));
  }
};
```

#### Update Image Field

```typescript
const updateImageField = (index: number, value: string) => {
  const newImages = [...images];
  newImages[index] = value;
  setImages(newImages);
};
```

## Data Flow

### Loading (Edit Mode)

```
API Response
  ↓
portfolio.images = ["url1", "url2", "url3"]
  ↓
setImages(portfolio.images)
  ↓
Render 3 input fields with values
```

### Adding New Field

```
User clicks "Add Image"
  ↓
addImageField()
  ↓
setImages([...images, ""])
  ↓
New empty field appears
```

### Removing Field

```
User clicks trash icon
  ↓
removeImageField(index)
  ↓
setImages(images.filter((_, i) => i !== index))
  ↓
Field removed from list
```

### Submit

```
Form submit
  ↓
images.filter((img) => img.trim())
  ↓
Remove empty fields
  ↓
Send to API as array
```

## Example Usage

### Initial State (New Portfolio)

```
┌─────────────────────────────────────────┐
│ Images *                    [Add Image] │
├─────────────────────────────────────────┤
│ [Image URL 1                    ] [🗑️] │
└─────────────────────────────────────────┘
```

### After Adding 2 More Images

```
┌─────────────────────────────────────────┐
│ Images *                    [Add Image] │
├─────────────────────────────────────────┤
│ [https://example.com/1.jpg  ] [🗑️]    │
│ [https://example.com/2.jpg  ] [🗑️]    │
│ [https://example.com/3.jpg  ] [🗑️]    │
└─────────────────────────────────────────┘
```

### Edit Mode (Loading Existing Data)

```
Portfolio has 3 images
  ↓
3 fields rendered with values
  ↓
User can add more or remove existing
```

## Benefits

✅ **Better UX**: Lebih intuitif daripada textarea
✅ **Visual Clarity**: Setiap URL terpisah jelas
✅ **Easy Management**: Tambah/hapus per item
✅ **Validation**: Required hanya untuk field pertama
✅ **Flexible**: Bisa menambah unlimited images
✅ **Clean Data**: Empty fields otomatis difilter

## Comparison

### Before (Textarea)

```
Images *
┌─────────────────────────────────────┐
│ https://example.com/1.jpg           │
│ https://example.com/2.jpg           │
│ https://example.com/3.jpg           │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### After (Dynamic Fields)

```
Images *                    [Add Image]
┌─────────────────────────────────────┐
│ [https://example.com/1.jpg  ] [🗑️] │
│ [https://example.com/2.jpg  ] [🗑️] │
│ [https://example.com/3.jpg  ] [🗑️] │
└─────────────────────────────────────┘
```

## Technical Notes

- Uses array state management
- Each field has unique key (index)
- Delete button disabled when only 1 field remains
- Empty strings filtered before submit
- Compatible with existing API structure
- Preview updates in real-time
