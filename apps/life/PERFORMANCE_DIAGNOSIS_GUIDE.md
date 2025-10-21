# 🔍 Performance Diagnosis Guide

## Logging Added

Comprehensive performance logging telah ditambahkan untuk identify bottlenecks.

## 📊 What to Look For

### **Open Browser Console (F12) and Drag Canvas**

You'll see logs like this:

```
📊 PERFORMANCE METRICS (last 1 second):
   - InfiniteCanvas renders: 60
   - Visible items: 42
   - Estimated FPS: 58
   - Avg frame time: 17.24ms
   - Target: 60 FPS (16.67ms per frame)

⚠️ Slow calculation: 8.45ms for 42 items
⚠️ Slow position update: 18.32ms (should be <16ms for 60fps)
🎴 PortfolioCard 1 rendered 100 times
```

---

## 🎯 How to Interpret Results

### **1. InfiniteCanvas Renders/Sec**

**What it means:** How many times the main component re-renders

**Good:**

- ✅ 0-5 renders/sec (idle)
- ✅ 30-60 renders/sec (during drag)

**Bad:**

- ❌ 100+ renders/sec (too many re-renders)
- ❌ 200+ renders/sec (critical issue)

**If bad:**

- Problem: React state updates too frequently
- Solution: Direct DOM manipulation (bypass React state)

---

### **2. Visible Items Count**

**What it means:** How many cards are rendered

**Good:**

- ✅ 10-50 items (normal viewport)
- ✅ 50-100 items (large screen)

**Bad:**

- ❌ 100+ items (viewport buffer too large)
- ❌ 200+ items (calculation error)

**If bad:**

- Problem: Too many items rendered
- Solution: Reduce VIEWPORT_BUFFER or fix calculation

---

### **3. Estimated FPS**

**What it means:** Frames per second

**Good:**

- ✅ 55-60 FPS (perfect)
- ✅ 45-55 FPS (acceptable)

**Bad:**

- ❌ 30-45 FPS (noticeable lag)
- ❌ <30 FPS (very laggy)

**If bad:**

- Problem: Rendering bottleneck
- Solution: See other metrics to identify cause

---

### **4. Avg Frame Time**

**What it means:** Time to render one frame

**Good:**

- ✅ <16.67ms (60 FPS)
- ✅ 16-20ms (50+ FPS)

**Bad:**

- ❌ 20-30ms (30-50 FPS)
- ❌ >30ms (<30 FPS)

**If bad:**

- Problem: Slow rendering
- Solution: Optimize rendering (see below)

---

### **5. Slow Calculation Warning**

**What it means:** visibleItems calculation is slow

**Good:**

- ✅ <5ms (fast)
- ✅ 5-10ms (acceptable)

**Bad:**

- ❌ 10-20ms (slow)
- ❌ >20ms (very slow)

**If bad:**

- Problem: Calculation bottleneck
- Solution: Optimize algorithm or reduce items

---

### **6. Slow Position Update Warning**

**What it means:** setPosition() is slow

**Good:**

- ✅ <16ms (60 FPS)

**Bad:**

- ❌ 16-30ms (30-60 FPS)
- ❌ >30ms (<30 FPS)

**If bad:**

- Problem: React re-render is slow
- Solution: Direct DOM manipulation

---

### **7. PortfolioCard Render Count**

**What it means:** How many times each card re-renders

**Good:**

- ✅ 1-10 renders total (React.memo working)
- ✅ Only renders when props change

**Bad:**

- ❌ 100+ renders (React.memo not working)
- ❌ 1000+ renders (critical issue)

**If bad:**

- Problem: Props changing every render
- Solution: Stable object references

---

## 🔍 Diagnosis Scenarios

### **Scenario 1: High Renders, Low FPS**

```
InfiniteCanvas renders: 120/sec
FPS: 30
Frame time: 33ms
```

**Diagnosis:** Too many React re-renders

**Solution:**

1. Direct DOM manipulation
2. Bypass React state for position

---

### **Scenario 2: Low Renders, Low FPS**

```
InfiniteCanvas renders: 60/sec
FPS: 30
Frame time: 33ms
Slow calculation: 25ms
```

**Diagnosis:** Calculation bottleneck

**Solution:**

1. Optimize visibleItems calculation
2. Reduce viewport buffer
3. Use Web Workers

---

### **Scenario 3: Cards Re-rendering Too Much**

```
InfiniteCanvas renders: 60/sec
PortfolioCard rendered: 3000 times
FPS: 20
```

**Diagnosis:** React.memo not working

**Solution:**

1. Stable object references
2. Better memoization
3. Replace Next.js Image with native img

---

### **Scenario 4: Slow Position Updates**

```
InfiniteCanvas renders: 60/sec
Slow position update: 25ms
FPS: 40
```

**Diagnosis:** setPosition() triggers expensive re-render

**Solution:**

1. Direct DOM manipulation
2. Update state less frequently

---

## 🎯 Action Plan Based on Results

### **If FPS < 30:**

**Priority 1:** Direct DOM manipulation

- Bypass React state for position
- Update DOM directly during drag

**Priority 2:** Simplify cards

- Replace Next.js Image with native img
- Remove unnecessary components

**Priority 3:** Reduce items

- Decrease VIEWPORT_BUFFER
- Optimize calculation

---

### **If FPS 30-45:**

**Priority 1:** Optimize re-renders

- Stable object references
- Better memoization

**Priority 2:** Optimize images

- Native img instead of Next.js Image
- Reduce image quality

---

### **If FPS 45-55:**

**Priority 1:** Minor optimizations

- Fine-tune RAF throttling
- Optimize CSS

---

### **If FPS 55-60:**

**Status:** ✅ Performance is good!

- No action needed
- Remove logging for production

---

## 📝 How to Use This Guide

### **Step 1: Open Console**

```
Press F12 → Console tab
```

### **Step 2: Clear Console**

```
Click 🚫 icon or Ctrl+L
```

### **Step 3: Drag Canvas**

```
Drag canvas around for 5-10 seconds
```

### **Step 4: Read Logs**

```
Look at the metrics logged every second
```

### **Step 5: Identify Issues**

```
Compare your numbers with "Good" vs "Bad" above
```

### **Step 6: Apply Solutions**

```
Follow the recommended solutions
```

---

## 🔧 Quick Fixes Reference

### **Fix 1: Direct DOM Manipulation**

```typescript
// Bypass React state
const positionRef = useRef({ x: 0, y: 0 });
containerRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
```

### **Fix 2: Native Image**

```typescript
// Replace Next.js Image
<img src={url} loading="lazy" />
```

### **Fix 3: Reduce Buffer**

```typescript
// In constants.ts
VIEWPORT_BUFFER: 200 → 100
```

### **Fix 4: Stable References**

```typescript
// Memoize items properly
const itemsMap = useMemo(() => new Map(...), [portfolios]);
```

---

## 📊 Expected Results After Fixes

### **Before:**

```
InfiniteCanvas renders: 120/sec
FPS: 30
Frame time: 33ms
PortfolioCard renders: 3000 times
```

### **After Fix 1 (Direct DOM):**

```
InfiniteCanvas renders: 5/sec
FPS: 60
Frame time: 16ms
PortfolioCard renders: 50 times
```

### **After Fix 2 (Native img):**

```
InfiniteCanvas renders: 60/sec
FPS: 55
Frame time: 18ms
PortfolioCard renders: 600 times
```

---

## 🎉 Success Criteria

**Performance is good when:**

- ✅ FPS: 55-60
- ✅ Frame time: <18ms
- ✅ InfiniteCanvas renders: <70/sec during drag
- ✅ PortfolioCard renders: <100 times total
- ✅ No slow calculation warnings
- ✅ No slow update warnings

**When achieved:**

- Remove logging code
- Deploy to production
- Celebrate! 🎊

---

**Created:** October 15, 2025  
**Purpose:** Diagnose performance issues  
**Next Step:** Run app, check console, identify bottleneck
