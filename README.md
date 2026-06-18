# 🏪 Toko Akbar Jaya — Katalog Inventaris Barang
**Tugas Final Mata Kuliah: Pemrograman Berbasis Platform (PBP)**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP/pulls)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen.svg)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet.svg)]()
[![Hosting](https://img.shields.io/badge/Hosting-InfinityFree-orange.svg)]()
[![HTTPS](https://img.shields.io/badge/HTTPS-SSL%20Active-green.svg)]()

---

## 🌐 Akses Aplikasi Live

| Tugas | URL | Status |
|-------|-----|--------|
| 🎯 **Tugas Final:** | [https://tokoakbar.infinityfree.me/](https://tokoakbar.infinityfree.me/) | ✅ Online |

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

Perjalanan PjBL (Project Based Learning) ini mencakup:
1. Memahami konsep arsitektur platform & Client-Server
2. Membangun REST API murni dengan PHP
3. Mengintegrasikan API dengan Vanilla JS menggunakan Fetch API
4. Mengubah aplikasi menjadi PWA dengan fitur offline (Service Worker)
5. **Merilis aplikasi secara publik ke internet via Free Shared Hosting** *(Modul 8)*

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
| 📡 **Offline Mode** | Halaman utama tetap bisa diakses saat koneksi terputus (Service Worker cache) |
| 📱 **Responsive** | Tampilan desktop (tabel) dan mobile (card) yang berbeda secara otomatis |

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ (Vanilla JS), Bootstrap 5 |
| **Backend** | PHP Native (Procedural) |
| **Database** | MySQL |
| **API** | REST API (JSON) — GET, POST, PUT, DELETE |
| **PWA** | Service Worker, Web App Manifest |
| **Server Lokal** | XAMPP (Apache + MySQL) |
| **Hosting** | InfinityFree (Free Shared Hosting + Free SSL) |
| **Tools** | VS Code, FileZilla FTP, Git, phpMyAdmin |

---

## 📂 Struktur Folder Proyek

```text
htdocs/
├── 📄 .htaccess                 # Konfigurasi rewrite/proteksi hosting
│
├── 📁 api-toko/                 # Backend REST API (PHP)
│   ├── 📄 koneksi.php           # Konfigurasi koneksi database MySQL
│   ├── 📄 get_barang.php        # GET    — Ambil data barang + search + pagination
│   ├── 📄 tambah_barang.php     # POST   — Tambah barang baru
│   ├── 📄 edit_barang.php       # PUT    — Edit data barang
│   ├── 📄 login.php             # GET    — Ambil data users
│   └── 📄 hapus_barang.php      # DELETE — Hapus data barang
|   └── 📁 uploads/              # Directory Upload image dari users
│
└── 📁 app-toko/                 # Frontend PWA
    ├── 📄 index.html            # Halaman utama aplikasi
    ├── 📄 login.html            # Halaman login
    ├── 📄 app.js                # Logika Fetch API, CRUD, Search, Pagination, PWA
    ├── 📄 sw.js                 # Service Worker untuk mode offline
    ├── 📄 manifest.json         # Konfigurasi Progressive Web App
    │
    └── 📁 icons/                # Icon aplikasi PWA
        ├── 🖼️ icon-192x192.png  # Icon 192x192
        └── 🖼️ icon-512x512.png  # Icon 512x512
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
    { "id": 2, "nama_barang": "Minyak Goreng 2L",  "harga": 32000 }
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
- Browser modern (Chrome / Firefox / Edge)

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

**3. Buat database di phpMyAdmin (`http://localhost/phpmyadmin`):**
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

## ☁️ Proses Deployment ke Free Shared Hosting
### (Mengikuti Modul Praktikum 8 — Sucipto, M.Kom)

Berikut dokumentasi lengkap proses deployment sesuai urutan modul pertemuan 8.

---

### Langkah 1 — Export Database dari Localhost

Sebelum upload ke hosting, database lokal harus diekspor terlebih dahulu.

1. Buka XAMPP, pastikan MySQL menyala
2. Akses `http://localhost/phpmyadmin`
3. Pilih database `db_toko` di panel kiri
4. Klik tab **Export** → format **SQL** → klik tombol **Go**
5. File `db_toko.sql` ter-download ke komputer

---

### Langkah 2 — Buat & Import Database di Hosting

1. Login ke panel **InfinityFree** → menu **MySQL Databases**
2. Buat database baru (nama otomatis seperti `if0_XXXXXXX_db_toko`)
3. Klik **Admin** untuk buka phpMyAdmin hosting
4. Pilih database baru → klik tab **Import**
5. Upload file `db_toko.sql` yang sudah diexport tadi → klik **Go**

---

### Langkah 3 — Upload File PHP (Backend) ke Folder `api-toko/`

1. Buka **File Manager** di panel InfinityFree → masuk ke `htdocs`
2. Buat folder baru bernama `api-toko`
3. Upload seluruh file PHP ke dalam folder tersebut:
   - `koneksi.php`
   - `get_barang.php`
   - `tambah_barang.php`
   - `update_barang.php`
   - `delete_barang.php`

---

### Langkah 4 — Edit `koneksi.php` — Ganti Kredensial ke Hosting

**Kode Sebelum (localhost):**
```php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_toko";
```

**Kode Sesudah (hosting):**
```php
$host = "sqlXXX.infinityfree.com";  // MySQL Host dari panel
$user = "if0_XXXXXXX";              // Username database
$pass = "passwordAnda";             // Password database
$db   = "if0_XXXXXXX_db_toko";      // Nama database
```

---

### Langkah 5 — Tambahkan CORS Header di `koneksi.php`

Diperlukan agar `fetch()` dari browser tidak diblokir saat request ke server hosting (terutama untuk method PUT dan DELETE).

**Kode Sebelum:**
```php
<?php
header('Content-Type: application/json; charset=utf-8');
```

**Kode Sesudah:**
```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
```

---

### Langkah 6 — Aktifkan Free SSL (HTTPS) di InfinityFree

PWA **wajib** menggunakan HTTPS agar Service Worker dan fitur "Add to Home Screen" bisa berjalan.

1. Di dasbor InfinityFree → menu **Free SSL Certificates**
2. Buat sertifikat baru untuk domain Anda
3. Klik **Install automatically**
4. Tunggu beberapa menit hingga aktif
5. Akses domain dengan `https://` — harus tidak ada peringatan keamanan

---

### Langkah 7 — Update Seluruh URL `fetch()` di `app.js`

Sesuai instruksi modul — semua URL fetch diperbarui dari localhost ke domain hosting.

**Kode Sebelum (path relatif / localhost):**
```javascript
fetch("api-toko/get_barang.php")
fetch("api-toko/tambah_barang.php", { method: "POST", ... })
fetch("api-toko/update_barang.php", { method: "PUT", ... })
fetch("api-toko/delete_barang.php", { method: "DELETE", ... })
```

**Kode Sesudah (URL absolut sesuai domain hosting):**
```javascript
fetch("https://tokoakbar.infinityfree.me/api-toko/get_barang.php")
fetch("https://tokoakbar.infinityfree.me/api-toko/tambah_barang.php", { method: "POST", ... })
fetch("https://tokoakbar.infinityfree.me/api-toko/update_barang.php", { method: "PUT", ... })
fetch("https://tokoakbar.infinityfree.me/api-toko/delete_barang.php", { method: "DELETE", ... })
```

---

### Langkah 8 — Perbaikan Bug `showAlert()` di `app.js`

Ditemukan bug urutan argumen pada fungsi `deleteBarang()`.

**Kode Sebelum (bug):**
```javascript
showAlert("✅ Berhasil!", "Data barang telah dihapus", "success");
```

**Kode Sesudah (benar — sesuai definisi `showAlert(type, title, message)`):**
```javascript
showAlert("success", "✅ Berhasil!", "Data barang telah dihapus");
```

---

### Langkah 9 — Samakan `theme_color` di `manifest.json`

**Kode Sebelum:**
```json
"theme_color": "#8b5cf6"
```

**Kode Sesudah (konsisten dengan `<meta name="theme-color">` di `index.html`):**
```json
"theme_color": "#4338ca",
"background_color": "#f1f0fb"
```

---

### Langkah 10 — Tambahkan Cache Bootstrap ke `sw.js`

Agar tampilan Bootstrap tetap rapi saat mode offline.

**Kode Sebelum:**
```javascript
const urlsToCache = [
  './', './index.html', './app.js', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png'
];
```

**Kode Sesudah:**
```javascript
const urlsToCache = [
  './', './index.html', './app.js', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];
```

---

### Langkah 11 — Upload Frontend ke Root `htdocs/`

Sesuai modul — file frontend diletakkan **langsung di root** `htdocs` (bukan di subfolder), agar domain langsung membuka aplikasi.

```
htdocs/  ← root direktori hosting
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

---

## 📱 Langkah 12 — Test Install PWA di Smartphone

*(Garis finish PjBL — sesuai Modul Pertemuan 8)*

1. Buka **Chrome** di HP Android
2. Akses **[https://tokoakbar.infinityfree.me/](https://tokoakbar.infinityfree.me/)**
3. Tunggu beberapa detik → muncul overlay **"Install Toko Akbar Jaya"**
4. Klik **"INSTAL SEKARANG"** → aplikasi tersimpan di homescreen
5. Tutup browser → buka ikon aplikasi dari homescreen
6. Aplikasi terbuka **tanpa address bar** (mode standalone = seperti aplikasi native)
7. **Test offline:** matikan WiFi/data → buka lagi → halaman masih bisa diakses (Service Worker cache aktif)

> Jika overlay tidak muncul otomatis, klik tombol **"📲 Install Toko Akbar Jaya"** di bagian bawah halaman.

---

## 📊 Hasil Pengujian

| Skenario Uji | Hasil |
|--------------|-------|
| Tambah barang baru | ✅ Berhasil |
| Edit data barang | ✅ Berhasil |
| Hapus data barang | ✅ Berhasil |
| Search / filter barang | ✅ Berhasil |
| Akses API langsung via browser | ✅ JSON tampil |
| HTTPS aktif (SSL) | ✅ Berhasil |
| Install PWA di Android | ✅ Berhasil |
| Buka dari homescreen (standalone) | ✅ Berhasil |
| Tampilan responsive di mobile | ✅ Berhasil |

---

## 🐛 Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| Data tidak tampil | Koneksi database gagal | Cek kredensial di `koneksi.php` |
| CRUD gagal di hosting | CORS header belum ada | Tambahkan header CORS di `koneksi.php` |
| PWA tidak bisa diinstall | HTTPS belum aktif | Aktifkan Free SSL di panel InfinityFree |
| Tampilan rusak saat offline | Bootstrap tidak ter-cache | Tambahkan URL Bootstrap ke `urlsToCache` di `sw.js` |
| Service Worker tidak aktif | Cache versi lama | DevTools → Application → SW → klik "Update" |
| fetch() gagal | URL masih localhost | Pastikan semua URL fetch sudah diganti ke domain hosting |

---

## 🔄 Alur Komunikasi Client-Server

```
[Browser / Android PWA]
        │
        │ fetch("https://tokoakbar.infinityfree.me/api-toko/get_barang.php")
        ↓
[InfinityFree Web Server — Apache + SSL/HTTPS]
        │
        │ Eksekusi PHP
        ↓
[api-toko/get_barang.php]
        │
        │ SELECT * FROM barang
        ↓
[MySQL Database — InfinityFree Cloud]
        │
        │ Return rows
        ↓
[PHP → json_encode()]
        │
        │ {"status":"success","data":[...]}
        ↓
[JavaScript → renderTable() / mobile card]
```

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik dalam mata kuliah **Pemrograman Berbasis Platform (PBP)**.
Bebas dimodifikasi dan didistribusikan untuk tujuan pembelajaran.

---

## 🙏 Ucapan Terima Kasih

- **Dosen Pengampu:** Sucipto, M.Kom — Universitas Muhammadiyah Pontianak
- **Modul Praktikum 8** — Deployment & Hosting API + PWA
- **Bootstrap 5** — Framework CSS
- **Google Fonts** — Font Outfit & Playfair Display
- **InfinityFree** — Free Shared Hosting + Free SSL

---

**Last Updated:** Juni 2026 | **Status:** ✅ Final — Deployed & Live  
**Tugas Final PBP — Selesai! 🎉**
