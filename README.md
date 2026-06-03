# 🏪 Toko Akbar Jaya — Katalog Inventaris Barang
**Tugas Final Mata Kuliah: Pemrograman Berbasis Platform (PBP)**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP/pulls)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen.svg)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-InfinityFree-orange.svg)]()

---

## 🌐 Akses Aplikasi Live

| Tugas | URL | Status |
|-------|-----|--------|
| **Tugas 2** | [https://aplikasitokoakbarjaya.infinityfreeapp.com/](https://aplikasitokoakbarjaya.infinityfreeapp.com/) | ✅ Online |
| **Tugas 3 (Final)** | [https://tokoakbar.infinityfree.me/](https://tokoakbar.infinityfree.me/) | ✅ Online |

> 🎯 **Tugas Final:** [https://tokoakbar.infinityfree.me/](https://tokoakbar.infinityfree.me/)

---

## 👤 Identitas Mahasiswa

| Data | Informasi |
|------|-----------|
| **Nama** | Muhammad Hasbih Akbar |
| **NIM** | 231220075 |
| **Kelas** | 31 |
| **Program Studi** | Teknik Informatika |
| **Kampus** | Universitas Muhammadiyah Pontianak |
| **Dosen Pengampu** | Sucipto, M.Kom |

---

## 📌 Deskripsi Proyek

Proyek ini adalah aplikasi web **Full-Stack** yang mendemonstrasikan penerapan arsitektur Client-Server modern dalam bentuk aplikasi inventaris barang toko. Dibangun menggunakan **PHP Native**, **MySQL**, **Vanilla JavaScript**, dan **REST API**, serta dikembangkan menjadi **Progressive Web App (PWA)** yang dapat diinstall di perangkat Android.

Perjalanan pengembangan proyek ini mencakup:
1. Memahami konsep arsitektur platform
2. Membangun REST API murni dengan PHP
3. Mengintegrasikan API dengan Vanilla JS menggunakan Fetch API
4. Mengubah aplikasi menjadi PWA dengan fitur offline
5. **Merilis aplikasi secara publik ke internet (Free Shared Hosting)**

---

## ✨ Fitur Aplikasi

| Fitur | Keterangan |
|-------|-----------|
| ➕ **Create** | Tambah data barang baru via modal form |
| 📋 **Read** | Tampilkan semua data barang dari database secara real-time |
| ✏️ **Update** | Edit data barang yang sudah ada |
| 🗑️ **Delete** | Hapus data barang dengan konfirmasi |
| 🔍 **Search** | Filter barang berdasarkan nama secara client-side |
| 📲 **PWA Install** | Bisa diinstall di homescreen Android seperti aplikasi native |
| 📡 **Offline Mode** | Akses halaman utama tetap bisa saat koneksi terputus (Service Worker) |
| 📱 **Responsive** | Tampilan desktop (tabel) dan mobile (card) yang berbeda |

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ (Vanilla JS), Bootstrap 5 |
| **Backend** | PHP Native (Procedural) |
| **Database** | MySQL |
| **API** | REST API (JSON) |
| **PWA** | Service Worker, Web App Manifest |
| **Server Lokal** | XAMPP (Apache + MySQL) |
| **Hosting** | InfinityFree (Free Shared Hosting) |
| **Tools** | VS Code, FileZilla FTP, Git |

---

## 📂 Struktur Folder Proyek

```text
toko-PBP-01/
├── 📄 index.html               # Antarmuka utama aplikasi (SPA)
├── 📄 app.js                   # Semua logika JS: Fetch API, CRUD, PWA
├── 📄 manifest.json            # Konfigurasi PWA manifest
├── 📄 sw.js                    # Service Worker (caching & offline)
├── 📄 README.md                # Dokumentasi proyek
│
├── 📁 icons/                   # Aset icon untuk PWA
│   ├── icon-192x192.png        # Icon 192px (wajib untuk PWA)
│   └── icon-512x512.png        # Icon 512px (wajib untuk PWA)
│
└── 📁 api-toko/                # Backend REST API (PHP)
    ├── koneksi.php             # Konfigurasi koneksi database + CORS header
    ├── get_barang.php          # GET  — Ambil semua data barang
    ├── tambah_barang.php       # POST — Tambah barang baru
    ├── update_barang.php       # PUT  — Update data barang
    └── delete_barang.php       # DELETE — Hapus data barang
```

---

## 🔌 Dokumentasi REST API

Base URL (Hosting): `https://tokoakbar.infinityfree.me/api-toko/`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `get_barang.php` | Ambil semua data barang |
| `POST` | `tambah_barang.php` | Tambah barang baru |
| `PUT` | `update_barang.php` | Update data barang |
| `DELETE` | `delete_barang.php` | Hapus data barang |

### Contoh Response GET:
```json
{
  "status": "success",
  "message": "Berhasil mengambil data",
  "jumlah": 3,
  "data": [
    { "id": 1, "nama_barang": "Beras Premium 5kg", "harga": 75000 },
    { "id": 2, "nama_barang": "Minyak Goreng 2L", "harga": 32000 }
  ]
}
```

---

## 🗄️ Skema Database

### Tabel: `barang`

```sql
CREATE TABLE `barang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_barang` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | INT, Auto Increment | Primary key unik |
| `nama_barang` | VARCHAR(255) | Nama barang (wajib diisi) |
| `harga` | INT | Harga dalam Rupiah |

---

## 🚀 Cara Instalasi Lokal (Localhost)

### Prasyarat:
- XAMPP (Apache + MySQL aktif)
- Browser modern (Chrome/Firefox/Edge)

### Langkah-langkah:

**1. Clone atau download proyek:**
```bash
git clone https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP
cd toko-PBP-01
```

**2. Letakkan di folder XAMPP:**
```
C:\xampp\htdocs\toko-PBP-01\
```

**3. Buat database di phpMyAdmin:**
```sql
CREATE DATABASE db_toko;
USE db_toko;

CREATE TABLE `barang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_barang` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**4. Konfigurasi `api-toko/koneksi.php` untuk localhost:**
```php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_toko";
```

**5. Akses aplikasi:**
```
http://localhost/toko-PBP-01/index.html
```

---

## ☁️ Deployment ke Free Shared Hosting (Tugas Final)

Berikut perubahan yang dilakukan untuk proses deployment ke InfinityFree:

### 1. Menambahkan CORS Header di `api-toko/koneksi.php`

Diperlukan agar `fetch()` dari browser tidak diblokir saat request ke server hosting.

```php
// SEBELUM:
header('Content-Type: application/json; charset=utf-8');

// SESUDAH:
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
```

### 2. Memperbaiki Bug `showAlert()` di `app.js`

Urutan argumen pada fungsi `deleteBarang()` sebelumnya terbalik.

```javascript
// SEBELUM (bug — urutan argumen salah):
showAlert("✅ Berhasil!", "Data barang telah dihapus", "success");

// SESUDAH (benar — sesuai definisi fungsi showAlert(type, title, message)):
showAlert("success", "✅ Berhasil!", "Data barang telah dihapus");
```

### 3. Menyamakan `theme_color` di `manifest.json`

Warna tema tidak konsisten antara manifest dan meta tag HTML.

```json
// SEBELUM:
"theme_color": "#8b5cf6"

// SESUDAH (konsisten dengan meta tag di index.html):
"theme_color": "#4338ca",
"background_color": "#f1f0fb"
```

### 4. Menambahkan Cache Bootstrap ke Service Worker (`sw.js`)

Agar tampilan Bootstrap tetap rapi saat mode offline.

```javascript
// SEBELUM — hanya cache file lokal
const urlsToCache = [
  './', './index.html', './app.js', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png'
];

// SESUDAH — tambahkan Bootstrap CDN
const urlsToCache = [
  './', './index.html', './app.js', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];
```

### 5. Update Seluruh URL `fetch()` di `app.js` ke URL Absolut

Sesuai instruksi tugas final — seluruh URL fetch diperbarui menggunakan domain hosting.

```javascript
// SEBELUM (path relatif untuk localhost):
fetch("api-toko/get_barang.php")
fetch("api-toko/tambah_barang.php", { method: "POST", ... })
fetch("api-toko/update_barang.php", { method: "PUT", ... })
fetch("api-toko/delete_barang.php", { method: "DELETE", ... })

// SESUDAH (URL absolut sesuai domain hosting):
fetch("https://tokoakbar.infinityfree.me/api-toko/get_barang.php")
fetch("https://tokoakbar.infinityfree.me/api-toko/tambah_barang.php", { method: "POST", ... })
fetch("https://tokoakbar.infinityfree.me/api-toko/update_barang.php", { method: "PUT", ... })
fetch("https://tokoakbar.infinityfree.me/api-toko/delete_barang.php", { method: "DELETE", ... })
```

### 6. Struktur Upload ke Hosting via FileZilla

```
htdocs/  (root direktori hosting)
├── index.html
├── app.js
├── manifest.json
├── sw.js
├── icons/
│   ├── icon-192x192.png
│   └── icon-512x512.png
└── api-toko/
    ├── koneksi.php
    ├── get_barang.php
    ├── tambah_barang.php
    ├── update_barang.php
    └── delete_barang.php
```

### 7. Konfigurasi Database di Hosting

```php
// api-toko/koneksi.php — konfigurasi untuk InfinityFree:
$host = "sqlXXX.infinityfree.com";   // MySQL host dari panel
$user = "if0_XXXXXXX";               // Username database
$pass = "passwordAnda";              // Password database
$db   = "if0_XXXXXXX_db_toko";       // Nama database
```

---

## 📱 Cara Install sebagai PWA di Android

1. Buka **Chrome** di HP Android
2. Akses **[https://tokoakbar.infinityfree.me/](https://tokoakbar.infinityfree.me/)**
3. Tunggu beberapa detik — akan muncul overlay **"Install Toko Akbar Jaya"**
4. Klik **"INSTAL SEKARANG"**
5. Aplikasi tersimpan di homescreen dan bisa dibuka tanpa browser
6. Tampil dalam mode **standalone** (tanpa address bar) seperti aplikasi native

> Jika overlay tidak muncul otomatis, klik tombol **"📲 Install Toko Akbar Jaya"** di bagian bawah halaman.

---

## 🐛 Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| Data tidak tampil | Koneksi database gagal | Cek kredensial di `koneksi.php` |
| CRUD tidak berfungsi di hosting | CORS header belum ada | Pastikan header CORS sudah ditambahkan di `koneksi.php` |
| PWA tidak bisa diinstall | Tidak ada HTTPS atau manifest error | InfinityFree sudah menyediakan HTTPS gratis |
| Tampilan rusak saat offline | Bootstrap tidak ter-cache | Pastikan URL Bootstrap ada di `urlsToCache` di `sw.js` |
| Service Worker tidak aktif | Cache versi lama | Buka DevTools → Application → SW → klik "Update" |

---

## 🔄 Alur Komunikasi Client-Server

```
[Browser/Android PWA]
        │
        │ fetch("https://tokoakbar.infinityfree.me/api-toko/get_barang.php")
        ↓
[InfinityFree Web Server — Apache]
        │
        │ Eksekusi PHP
        ↓
[get_barang.php]
        │
        │ SELECT * FROM barang
        ↓
[MySQL Database — db_toko]
        │
        │ Return rows
        ↓
[PHP → JSON encode]
        │
        │ {"status":"success","data":[...]}
        ↓
[Browser render tabel / mobile card]
```

---

## 📊 Hasil Pengujian

| Skenario | Hasil |
|----------|-------|
| Tambah barang baru | ✅ Berhasil |
| Edit data barang | ✅ Berhasil |
| Hapus data barang | ✅ Berhasil |
| Search/filter barang | ✅ Berhasil |
| Akses API langsung via browser | ✅ JSON tampil |
| Install PWA di Android | ✅ Berhasil |
| Buka dari homescreen (standalone) | ✅ Berhasil |
| Tampilan responsive di mobile | ✅ Berhasil |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik dalam mata kuliah **Pemrograman Berbasis Platform (PBP)**.  
Bebas dimodifikasi dan didistribusikan untuk tujuan pembelajaran.

---

## 🙏 Ucapan Terima Kasih

- **Dosen Pengampu:** Sucipto, M.Kom — Universitas Muhammadiyah Pontianak
- **Bootstrap 5** — Framework CSS
- **Google Fonts** — Font Outfit & Playfair Display
- **InfinityFree** — Free Shared Hosting

---

**Last Updated:** Juni 2026 | **Status:** ✅ Final — Deployed & Live