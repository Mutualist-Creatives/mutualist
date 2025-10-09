# Portfolio Preview Feature

## Overview

Live preview feature yang memungkinkan admin melihat tampilan portfolio sebelum disimpan, dengan design yang mirror dari aplikasi life.

## Features

### 1. Portfolio Preview Card

- Menampilkan preview card dengan ukuran 240x320px
- Hover effect dengan brightness overlay
- "VIEW" button yang muncul saat hover
- Fallback untuk image yang tidak valid

### 2. Full Preview Modal

- Modal fullscreen dengan layout 60/40 (image/content)
- Image carousel dengan animasi GSAP
- Navigation arrows untuk multiple images
- Dark theme content panel (#121212)
- ESC key untuk close modal
- Smooth animations untuk open/close

### 3. Live Updates

- Preview otomatis update saat form berubah
- Validasi real-time untuk images
- Disabled state jika data belum lengkap

## Components

### `portfolio-preview-card.tsx`

Preview card component yang mirror design dari `apps/life/components/portofolio-card.tsx`

### `portfolio-preview-modal.tsx`

Full preview modal yang mirror design dari `apps/life/components/project-modal.tsx`

### `portfolio-form.tsx` (Updated)

Form dengan integrated live preview section

## Usage

### In Form

Preview section muncul di atas form tabs dengan:

- Small card preview (clickable)
- "Full Preview" button
- Auto-disabled jika title atau images kosong

### Preview Modal

- Click pada preview card atau "Full Preview" button
- Navigate images dengan arrow buttons (jika multiple images)
- Close dengan X button atau ESC key

## Dependencies

- **GSAP**: Untuk smooth animations
- **Next.js Image**: Untuk optimized image loading
- **Tailwind CSS**: Untuk styling

## Configuration

### next.config.ts

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
    {
      protocol: "http",
      hostname: "**",
    },
  ],
}
```

## Design Consistency

Preview components menggunakan exact same design dari aplikasi life:

- Same dimensions (240x320px card)
- Same colors (#121212 for dark sections)
- Same animations (GSAP timeline)
- Same layout (60/40 split modal)
- Same typography (font-serif, font-sans)

## Benefits

1. **Better UX**: Admin dapat melihat hasil akhir sebelum save
2. **Error Prevention**: Validasi visual untuk images dan content
3. **Design Consistency**: Memastikan portfolio terlihat baik di aplikasi life
4. **Faster Workflow**: Tidak perlu switch ke aplikasi life untuk cek hasil
