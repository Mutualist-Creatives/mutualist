# 🌐 Network Access Guide

## Access Apps from Other Devices (Phone, Tablet, Other Computer)

**Date:** October 15, 2025  
**Status:** Complete Setup Guide

---

## 🎯 Overview

This guide shows you how to access your apps from other devices on the same network (WiFi).

**Use Cases:**

- Test on mobile phone
- Show demo to client on their device
- Access from another computer
- Test responsive design on real devices

---

## 📋 Prerequisites

### **1. Same Network**

All devices must be on the same WiFi network.

### **2. Firewall**

Windows Firewall might block connections. We'll configure this.

### **3. Running Apps**

All apps (API, Life, Admin) must be running.

---

## 🚀 Quick Start (3 Steps)

### **Step 1: Find Your IP Address**

#### **Windows:**

```bash
ipconfig
```

Look for "IPv4 Address" under your WiFi adapter:

```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

#### **Mac/Linux:**

```bash
ifconfig
```

Look for "inet" under your WiFi interface:

```
en0: flags=8863<UP,BROADCAST,SMART,RUNNING>
    inet 192.168.1.100
```

**Your IP:** `192.168.1.100` (example)

---

### **Step 2: Update Environment Variables**

#### **API (.env)**

```bash
# apps/api/.env
PORT=3002
HOST=0.0.0.0
NODE_ENV=development
```

#### **Life App (.env.local)**

```bash
# apps/life/.env.local
NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api
```

#### **Admin App (.env.local)**

```bash
# apps/admin/.env.local
NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api
NEXTAUTH_URL=http://192.168.1.100:3001
```

**Replace `192.168.1.100` with YOUR IP address!**

---

### **Step 3: Start All Apps**

#### **Terminal 1 - API Server:**

```bash
cd apps/api
bun run dev
```

You should see:

```
🚀 API running on:
   - Local:   http://localhost:3002/api
   - Network: http://192.168.1.100:3002/api
   - Mode:    Development
```

#### **Terminal 2 - Life App:**

```bash
cd apps/life
bun run dev
```

#### **Terminal 3 - Admin App:**

```bash
cd apps/admin
bun run dev
```

---

## 📱 Access from Other Devices

### **Life App (Portfolio):**

```
http://192.168.1.100:3000
```

### **Admin App:**

```
http://192.168.1.100:3001
```

### **API:**

```
http://192.168.1.100:3002/api
```

**Replace `192.168.1.100` with YOUR IP!**

---

## 🔥 Windows Firewall Configuration

If you can't access from other devices, configure Windows Firewall:

### **Option 1: Allow Node.js (Recommended)**

1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Click **"Change settings"**
4. Click **"Allow another app..."**
5. Browse to: `C:\Program Files\nodejs\node.exe`
6. Check both **Private** and **Public**
7. Click **OK**

### **Option 2: Allow Ports**

1. Open **Windows Defender Firewall**
2. Click **"Advanced settings"**
3. Click **"Inbound Rules"** → **"New Rule..."**
4. Select **"Port"** → Next
5. Select **"TCP"** → Specific ports: `3000,3001,3002`
6. Select **"Allow the connection"**
7. Check all profiles (Domain, Private, Public)
8. Name: "Mutualist Dev Servers"
9. Click **Finish**

### **Option 3: Temporary Disable (Testing Only)**

```bash
# Disable (Admin PowerShell)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Enable back (IMPORTANT!)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

⚠️ **Remember to enable firewall back!**

---

## 🧪 Testing

### **1. Test API Connection**

From your phone browser:

```
http://192.168.1.100:3002/api/portfolios
```

Should see JSON response with portfolios.

### **2. Test Life App**

From your phone browser:

```
http://192.168.1.100:3000
```

Should see portfolio cards.

### **3. Test Admin App**

From your phone browser:

```
http://192.168.1.100:3001
```

Should see admin login.

---

## 🔧 Troubleshooting

### **Problem: Can't connect from other device**

#### **Check 1: Same Network**

```bash
# On your computer
ipconfig

# On your phone
Settings → WiFi → Check network name
```

Must be the same WiFi network!

#### **Check 2: Firewall**

```bash
# Test if port is open
# On another computer on same network:
telnet 192.168.1.100 3002
```

If fails, configure firewall (see above).

#### **Check 3: API Running**

```bash
# On your computer, test locally:
curl http://localhost:3002/api/portfolios
```

Should return JSON.

#### **Check 4: Correct IP**

```bash
# Verify your IP hasn't changed
ipconfig
```

Update .env files if IP changed.

---

### **Problem: API works but apps don't fetch data**

#### **Check Environment Variables**

```bash
# apps/life/.env.local
NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api
```

Must use network IP, not localhost!

#### **Restart Apps**

```bash
# Stop all apps (Ctrl+C)
# Start again
cd apps/api && bun run dev
cd apps/life && bun run dev
cd apps/admin && bun run dev
```

---

### **Problem: CORS Error**

If you see CORS error in browser console:

#### **Check API CORS Configuration**

File: `apps/api/src/main.ts`

Should have:

```typescript
app.enableCors({
  origin: true, // Allow all origins in development
  credentials: true,
});
```

#### **Restart API**

```bash
cd apps/api
bun run dev
```

---

### **Problem: IP Address Changes**

Your IP might change when you reconnect to WiFi.

#### **Solution 1: Check IP Regularly**

```bash
ipconfig
```

Update .env files if changed.

#### **Solution 2: Set Static IP**

1. Open **Network Settings**
2. Click **WiFi** → **Properties**
3. Click **Edit** under IP assignment
4. Select **Manual**
5. Set IP: `192.168.1.100` (example)
6. Set Subnet: `255.255.255.0`
7. Set Gateway: `192.168.1.1` (your router)
8. Set DNS: `8.8.8.8`
9. Click **Save**

---

## 📝 Environment Files Summary

### **API (.env)**

```bash
# Database
DATABASE_URL="postgresql://..."

# Server
PORT=3002
HOST=0.0.0.0
NODE_ENV=development

# Supabase
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

### **Life App (.env.local)**

```bash
# Use network IP for network access
NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api

# Or use localhost for local only
# NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

### **Admin App (.env.local)**

```bash
# Use network IP for network access
NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api
NEXTAUTH_URL=http://192.168.1.100:3001

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Auth
NEXTAUTH_SECRET=...
```

---

## 🎯 Best Practices

### **Development Workflow:**

1. **Local Development** (default)

   ```bash
   # Use localhost in .env files
   NEXT_PUBLIC_API_URL=http://localhost:3002/api
   ```

2. **Network Testing** (when needed)

   ```bash
   # Use network IP in .env files
   NEXT_PUBLIC_API_URL=http://192.168.1.100:3002/api
   ```

3. **Production** (deployment)
   ```bash
   # Use production domain
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
   ```

---

## 🔐 Security Notes

### **Development Mode:**

- ✅ CORS allows all origins
- ✅ Firewall allows connections
- ✅ No authentication required

### **Production Mode:**

- ⚠️ Restrict CORS to specific domains
- ⚠️ Enable authentication
- ⚠️ Use HTTPS
- ⚠️ Configure proper firewall rules

---

## 📱 Mobile Testing Tips

### **1. Use Chrome DevTools**

```
chrome://inspect
```

Connect phone via USB for debugging.

### **2. Test Responsive Design**

- Portrait mode
- Landscape mode
- Different screen sizes
- Touch interactions

### **3. Test Performance**

- Slow 3G simulation
- Offline mode
- Battery saver mode

---

## 🎉 Success Checklist

- [ ] Found your IP address
- [ ] Updated all .env files
- [ ] Configured Windows Firewall
- [ ] Started all apps
- [ ] Tested API from phone
- [ ] Tested Life app from phone
- [ ] Tested Admin app from phone
- [ ] All features working

---

## 📞 Quick Reference

### **Find IP:**

```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

### **Test API:**

```bash
curl http://YOUR_IP:3002/api/portfolios
```

### **Access URLs:**

```
Life:  http://YOUR_IP:3000
Admin: http://YOUR_IP:3001
API:   http://YOUR_IP:3002/api
```

### **Restart Apps:**

```bash
# Stop all (Ctrl+C in each terminal)
# Start again
cd apps/api && bun run dev
cd apps/life && bun run dev
cd apps/admin && bun run dev
```

---

**Last Updated:** October 15, 2025  
**Status:** ✅ Complete Guide  
**Tested:** Windows 11, Android, iOS

**Happy network testing!** 🌐
