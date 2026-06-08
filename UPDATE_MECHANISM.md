# 📱 Mekanisme Update Otomatis PWA - Toko Akbar Jaya

## 🎯 Untuk Pengguna yang Sudah Install

Pengguna yang sudah **install PWA** di HP/Device mereka akan mendapatkan update **otomatis tanpa perlu melakukan apa-apa**.

---

## ⚙️ Flow Update Otomatis

```
┌─────────────────────────────────────────────────────────────────┐
│ Anda: Update code di server (ubah HTML, JS, CSS)                │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: INCREMENT CACHE_NAME di sw.js                           │
│                                                                 │
│ Ubah ini:  const CACHE_NAME = 'toko-pwa-v3';                   │
│ Jadi ini:  const CACHE_NAME = 'toko-pwa-v4';                   │
│                                                                 │
│ Ubah ini:  const APP_VERSION = 'v3.0';                         │
│ Jadi ini:  const APP_VERSION = 'v3.1';                         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: PUSH KE SERVER (git push / upload file)                 │
│                                                                 │
│ Setiap file PHP, HTML, CSS, JS akan ter-update di server       │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: PENGGUNA BUKA APP (PWA yang sudah di-install)          │
│                                                                 │
│ Browser secara otomatis cek update setiap:                     │
│  • Saat app dibuka                                              │
│  • Setiap 5 menit saat app running                             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: SERVICE WORKER DETECT UPDATE                            │
│                                                                 │
│ Ketika CACHE_NAME berbeda → Baru Cache Ada Perubahan          │
│  • SW mengunduh file-file terbaru                              │
│  • Bersihkan cache lama                                         │
│  • Kirim notifikasi ke app                                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: NOTIFIKASI MUNCUL KE USER                               │
│                                                                 │
│ Browser tampilkan banner hijau: "✨ Fitur baru tersedia!"      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: AUTO-RELOAD OTOMATIS                                    │
│                                                                 │
│ Setelah 3 detik → Halaman reload dengan versi terbaru         │
│                                                                 │
│ USER SEKARANG PAKAI VERSI TERBARU! ✅                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Cara Mendorong Update ke Pengguna

### **Option 1: Manual Update (Recommended untuk Development)**

**Kapan:** Saat Anda ingin update **segera** (tidak perlu tunggu 5 menit)

**Langkah:**

1. **Edit kode** (HTML, CSS, JS, PHP - sesuai kebutuhan)
   ```
   Contoh: Ubah warna tombol di index.html
   ```

2. **Update sw.js** - Increment versi:
   ```javascript
   // Sebelum:
   const CACHE_NAME = 'toko-pwa-v3';
   const APP_VERSION = 'v3.0';
   
   // Sesudah:
   const CACHE_NAME = 'toko-pwa-v4';
   const APP_VERSION = 'v3.1';
   ```

3. **Push ke server:**
   ```bash
   git add .
   git commit -m "Update: fix tombol warna"
   git push
   ```

4. **Pengguna akan lihat:**
   - ✅ Banner notifikasi dalam 5 menit (atau saat buka app)
   - 🔄 Halaman auto-reload dengan versi terbaru
   - ✅ Semua file terbaru sudah tersimpan di device

---

### **Option 2: Segera Trigger Update (Manual di Testing Panel)**

**Kapan:** Anda ingin test update sekarang juga (tanpa tunggu interval)

**Langkah:**

1. **Buka app** → Buka Testing Panel (Ctrl+Shift+T atau klik header)

2. **Cari section "🔄 Update Version"**

3. **Input versi baru:**
   ```
   Masukkan: v4.0
   Klik: Set
   ```

4. **Klik "Cek Update Sekarang"** di section "📡 Status Update Aplikasi"

5. **Lihat notifikasi muncul** dan halaman auto-reload

---

## 🔄 Mekanisme Update Detail

### **Tanpa Increment CACHE_NAME (TIDAK AKAN UPDATE):**
```javascript
// TIDAK AKAN TRIGGER UPDATE:
const CACHE_NAME = 'toko-pwa-v3';  // ← Tidak berubah
```
❌ Browser pikir semua file sudah cached dan cocok
❌ Tidak ada download file baru
❌ Pengguna tetap punya versi lama

### **Dengan Increment CACHE_NAME (AKAN UPDATE):**
```javascript
// AKAN TRIGGER UPDATE:
const CACHE_NAME = 'toko-pwa-v3';  // ← Lama
const CACHE_NAME = 'toko-pwa-v4';  // ← Baru
```
✅ Browser deteksi cache name berbeda
✅ SW download semua file terbaru
✅ Bersihkan cache v3 lama
✅ Store versi baru di cache v4
✅ Notifikasi pengguna
✅ Auto-reload dengan versi terbaru

---

## 📊 Update Detection Timeline

| Event | Time | Action |
|-------|------|--------|
| User buka app | 0s | SW cek update otomatis |
| Polling interval | 5 menit | Cek update lagi |
| Update detected | T + 5min | Download file baru |
| Activate event | T + 5min + 1s | Clean cache lama + kirim message |
| Message received | T + 5min + 2s | App update UI + notifikasi |
| Auto-reload | T + 5min + 5s | **USER PUNYA VERSI TERBARU** ✅ |

---

## ⚡ Tips Penting

### **1. Jangan Lupa Increment CACHE_NAME**
```javascript
// SALAH (forget increment):
const CACHE_NAME = 'toko-pwa-v3';  // Tetap sama
const APP_VERSION = 'v3.1';        // Version berubah, tapi cache tidak

// BENAR:
const CACHE_NAME = 'toko-pwa-v4';  // ← Increment
const APP_VERSION = 'v3.1';        // Version update
```

### **2. Perubahan yang Bisa Trigger Update**
Increment CACHE_NAME saat ada perubahan:
- ✅ Ubah `index.html`
- ✅ Ubah `app.js`
- ✅ Ubah file CSS
- ✅ Ubah `manifest.json`
- ✅ Ubah `login.html`
- ✅ Ubah logo/icon

### **3. Perubahan yang TIDAK Perlu Increment CACHE_NAME**
- ❌ Ubah PHP API (`login.php`, `tambah_barang.php`, dll)
  - Alasan: API tidak di-cache oleh SW (fetch event di-skip untuk api-toko)

### **4. Testing Update di Testing Panel**
- Gunakan untuk **development/testing saja**
- Di production, increment CACHE_NAME lebih reliable

---

## 🧪 Cara Testing Update Otomatis

### **Test 1: Check Current Version**
1. Buka Testing Panel (Ctrl+Shift+T)
2. Lihat "📡 Status Update Aplikasi"
3. Catat "Versi Saat Ini" dan "Cache Name"

### **Test 2: Trigger Manual Update**
1. Di section "🔄 Update Version" → input `v5.0`
2. Klik "Set"
3. Klik "Cek Update Sekarang"
4. Lihat banner "✨ Fitur baru tersedia!" muncul
5. Halaman auto-reload dalam 3 detik
6. Cek kembali "Versi Saat Ini" → sudah jadi `v5.0` ✅

### **Test 3: Real Update via CACHE_NAME**
1. Edit `sw.js` → increment CACHE_NAME (v4 → v5)
2. Push ke server
3. Refresh app atau tunggu polling (5 menit)
4. Lihat notifikasi dan auto-reload
5. Verify "Versi Saat Ini" berubah ✅

---

## 📲 Dari Perspektif Pengguna (yang sudah install PWA)

**Apa yang pengguna lihat:**

```
1. Buka app → app jalan normal
   
2. Ada banner hijau: "✨ Fitur baru tersedia!"
   
3. Tunggu 3 detik (atau refresh manual)
   
4. Halaman reload otomatis
   
5. APP SEKARANG VERSI TERBARU! ✅
   
(TANPA PERLU MANUAL CLEAR CACHE ATAU INSTALL ULANG!)
```

**Apa yang pengguna TIDAK perlu lakukan:**
- ❌ Manually clear browser cache
- ❌ Uninstall dan install ulang
- ❌ Hapus app dari device
- ❌ Setting apapun

---

## 🎯 Checklist Update untuk Developer

- [ ] Edit/update code (HTML, CSS, JS)
- [ ] Update `sw.js`:
  - [ ] Increment `CACHE_NAME` (v3 → v4)
  - [ ] Update `APP_VERSION` (v3.0 → v3.1)
- [ ] Test update di Testing Panel (optional)
- [ ] Push semua file ke server
- [ ] Verifikasi di browser (buka app dari fresh)
- [ ] Cek console log: "🆕 Update dari SW detected!"
- [ ] Verifikasi notifikasi muncul dan auto-reload bekerja

---

## 🆘 Troubleshooting

### **Masalah: Update tidak terdeteksi**
**Solusi:**
1. Check apakah `CACHE_NAME` sudah di-increment di `sw.js`
2. Force refresh browser: `Ctrl+Shift+R` (hard refresh)
3. Cek console log untuk error
4. Pastikan file sudah push ke server

### **Masalah: Notifikasi tidak muncul**
**Solusi:**
1. Check `showUpdateNotification()` di app.js
2. Buka Developer Tools → Console
3. Cari error message
4. Test trigger manual di Testing Panel

### **Masalah: Auto-reload tidak jalan**
**Solusi:**
1. Check setTimeout di message handler (3 detik)
2. Verifikasi `window.location.reload()` tidak di-block
3. Check Permission/Security setting di browser

---

## 📚 File yang Terlibat dalam Update

| File | Peran |
|------|-------|
| `sw.js` | Mengatur cache versioning + trigger message |
| `app.js` | Listen message dari SW + show notif + auto-reload |
| `index.html` | Testing panel (manual update testing) |
| Semua file lain | Akan otomatis ter-update via cache invalidation |

---

**Terakhir Updated:** 2025/06/09
**Status:** ✅ Production Ready
