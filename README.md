# 🏪 Arsitektur Client-Server: Katalog Inventaris Barang
**Tugas Mata Kuliah: Pemrograman Berbasis Platform (PBP)**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP/pulls)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

---

## 🌐 Akses Aplikasi Live
**Cek aplikasi secara langsung di sini:**  
👉 **[https://aplikasitokoakbarjaya.infinityfreeapp.com/](https://aplikasitokoakbarjaya.infinityfreeapp.com/)**

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
Proyek ini mendemonstrasikan penerapan **Arsitektur Client-Server** sederhana dalam konteks aplikasi web modern. Aplikasi ini berfungsi untuk menampilkan data inventaris barang secara dinamis dari database MySQL ke antarmuka web tanpa melalui proses *hardcoding* di sisi HTML. 

Komunikasi data dilakukan secara *asynchronous* menggunakan **Fetch API** untuk mengambil data berformat **JSON** yang disediakan oleh endpoint PHP, memastikan pengalaman pengguna yang responsif dan real-time.

### ✨ Fitur Utama:
- **UI Interaktif:** Desain modern menggunakan Bootstrap 5 dengan efek *Glassmorphism* dan animasi smooth.
- **Animasi Tilt:** Kartu identitas yang bergerak mengikuti gerakan kursor untuk interaksi yang menarik.
- **Dynamic Data Loading:** Sinkronisasi otomatis antara database MySQL dengan tampilan tabel secara real-time.
- **Loading State:** Indikator visual yang jelas saat data sedang dimuat dari server.
- **PWA Support:** Dukungan Progressive Web App untuk akses offline dan pengalaman seperti native app.
- **API RESTful:** Endpoint JSON yang clean dan terstruktur untuk komunikasi client-server.
- **Responsive Design:** Desain yang beradaptasi dengan semua ukuran perangkat (mobile, tablet, desktop).

---

## 🛠️ Teknologi yang Digunakan
| Layer | Teknologi |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Custom Styles), JavaScript ES6+ (Fetch API), Bootstrap 5 |
| **Backend** | PHP (Native, procedural) |
| **Database** | MySQL |
| **Server** | XAMPP (Apache + MySQL) |
| **Tools** | VS Code, Git, Postman (optional) |
| **Progressive Web App** | Service Worker, Manifest.json |

---

## 📂 Struktur Folder
```text
toko-PBP-01/
├── 📄 README.md                    # Dokumentasi proyek
│
├── 📁 api-toko/                    # Server-Side (Backend API)
│   ├── koneksi.php                 # Konfigurasi koneksi database MySQL
│   └── get_barang.php              # Endpoint API - Mengembalikan data JSON
│
└── 📁 app-toko/                    # Client-Side (Frontend PWA)
    ├── 📄 index.html               # Antarmuka utama aplikasi
    ├── 📄 app.js                   # Logika Fetch API & DOM Manipulation
    ├── 📄 manifest.json            # Konfigurasi PWA manifest
    ├── 📄 sw.js                    # Service Worker untuk offline support
    └── 📁 icons/                   # Icon assets untuk PWA
        ├── icon-192x192.png        # Icon 192px
        └── icon-512x512.png        # Icon 512px
```

---

## ✅ Persyaratan Sistem (Prerequisites)

### Software yang Harus Diinstall:
- **XAMPP** (versi 7.4 atau lebih tinggi) - [Download](https://www.apachefriends.org/)
  - Includes Apache Web Server
  - Includes MySQL Database Server
  - Includes PHP Runtime
- **Text Editor/IDE:** VS Code, Sublime Text, atau sejenisnya
- **Browser Modern:** Chrome, Firefox, Safari, atau Edge (untuk PWA support)
- **Git** (optional, untuk version control) - [Download](https://git-scm.com/)

### Versi yang Direkomendasikan:
- PHP: 7.4 atau 8.0+
- MySQL: 5.7 atau 8.0+
- Node.js: Tidak diperlukan (backend murni PHP)

---

## 🚀 Panduan Instalasi & Setup

### 1️⃣ Persiapan Database

**Buat database dan tabel:**
```sql
-- Membuat database
CREATE DATABASE db_toko;
USE db_toko;

-- Membuat tabel barang
CREATE TABLE barang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_barang VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert data sampel
INSERT INTO barang (nama_barang, harga, stok) VALUES
('Laptop Dell XPS 13', 12000000, 5),
('Monitor LG 24 inch', 2500000, 8),
('Keyboard Mechanical', 1500000, 15),
('Mouse Logitech', 500000, 20),
('Headset Gaming', 1200000, 10);
```

### 2️⃣ Clone atau Download Proyek

```bash
# Jika menggunakan Git
git clone <repository-url>
cd toko-PBP-01

# Atau manual: download dan extract ke folder project
```

### 3️⃣ Letakkan Proyek di XAMPP

Pindahkan folder `toko-PBP-01` ke:
```
C:\xampp\htdocs\toko-PBP-01\
```
(Pada Windows dengan XAMPP default installation)

### 4️⃣ Konfigurasi Koneksi Database

Edit file `api-toko/koneksi.php`:
```php
<?php
$host = "localhost";      // Sesuaikan jika berbeda
$user = "root";           // Username MySQL (default: root)
$pass = "";               // Password MySQL (default: kosong)
$db   = "db_toko";        // Nama database yang sudah dibuat
?>
```

### 5️⃣ Jalankan Apache dan MySQL

**Buka XAMPP Control Panel:**
- ✅ Klik tombol **Start** di samping **Apache**
- ✅ Klik tombol **Start** di samping **MySQL**

Status indicator berubah hijau = berhasil

---

## 🎯 Cara Menggunakan Aplikasi

### Mengakses Frontend (Client)
1. **Buka browser** dan arahkan ke:
   ```
   http://localhost/toko-PBP-01/app-toko/index.html
   ```

2. **Data akan langsung dimuat** secara otomatis dari database melalui Fetch API

3. **Fitur yang tersedia:**
   - 📊 Lihat daftar semua barang dalam tabel
   - 🎨 Hover pada kartu identitas untuk melihat animasi tilt
   - 💾 Aplikasi bisa diinstall sebagai PWA (click tombol install di browser)
   - 📱 Akses offline tersedia melalui Service Worker

### Testing API Endpoint (Backend)
1. **Buka browser atau Postman:**
   ```
   http://localhost/toko-PBP-01/api-toko/get_barang.php
   ```

2. **Respons yang diharapkan (JSON):**
   ```json
   {
     "status": "success",
     "message": "Berhasil mengambil data",
     "jumlah": 5,
     "data": [
       {
         "id": 1,
         "nama_barang": "Laptop Dell XPS 13",
         "harga": "12000000",
         "deskripsi": null,
         "created_at": "2024-01-15 10:30:00",
         "updated_at": "2024-01-15 10:30:00"
       },
       ...
     ]
   }
   ```

---

## 🔌 Dokumentasi API

### Endpoint: GET `/api-toko/get_barang.php`

**Deskripsi:** Mengambil semua data barang dari database dalam format JSON

**Method:** `GET`

**URL:** 
```
http://localhost/toko-PBP-01/api-toko/get_barang.php
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Berhasil mengambil data",
  "jumlah": 5,
  "data": [
    {
      "id": 1,
      "nama_barang": "Product Name",
      "harga": "1000000",
      "deskripsi": "Product description",
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    }
  ]
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Query gagal: [error description]"
}
```

**Headers:**
```
Content-Type: application/json
```

**Client-Side Usage:**
```javascript
fetch("api-toko/get_barang.php")
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      console.log("Data barang:", data.data);
      console.log("Jumlah barang:", data.jumlah);
    }
  })
  .catch(error => console.error("Error:", error));
```

---

## 🗄️ Skema Database

### Tabel: `barang`
| Kolom | Tipe Data | Keterangan |
|-------|-----------|-----------|
| `id` | INT (Primary Key, Auto Increment) | ID unik untuk setiap barang |
| `nama_barang` | VARCHAR(100) | Nama produk (wajib diisi) |
| `harga` | INT | Harga barang dalam Rupiah |
| `deskripsi` | TEXT | Deskripsi detail barang |
| `created_at` | TIMESTAMP | Waktu pembuatan record |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

## 🔒 Alur Komunikasi Client-Server

```
┌─────────────────────────────────────────────────────────┐
│                   USER BROWSER (CLIENT)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  index.html                                      │   │
│  │  - Tampilkan tabel barang kosong (loading state) │   │
│  │  - Jalankan app.js saat halaman load             │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ 1. FETCH REQUEST
                       │ GET /api-toko/get_barang.php
                       ↓
         ┌─────────────────────────────────┐
         │   WEB SERVER (APACHE)            │
         │   ├─ Process request             │
         │   └─ Route ke PHP handler        │
         └─────────────────┬───────────────┘
                           │ 2. EXECUTE PHP
                           ↓
       ┌───────────────────────────────────┐
       │   PHP Backend (get_barang.php)     │
       │   ├─ Connect ke database           │
       │   ├─ Query: SELECT * FROM barang   │
       │   ├─ Format JSON response          │
       │   └─ Return JSON                   │
       └───────────────────┬────────────────┘
                           │ 3. RESPONSE JSON
                           ↓
         ┌─────────────────────────────────┐
         │   MySQL Database (db_toko)       │
         │   ├─ Tabel: barang               │
         │   ├─ Rows: 5 products            │
         │   └─ Return query results        │
         └──────────────────────────────────┘
```

---

## 🌐 Fitur PWA (Progressive Web App)

Aplikasi mendukung teknologi PWA modern:

### Fitur yang Diaktifkan:
- ✅ **Installable:** Bisa diinstall seperti aplikasi native
- ✅ **Offline Support:** Akses data menggunakan Service Worker caching
- ✅ **Responsive:** Bekerja sempurna di mobile, tablet, desktop
- ✅ **App-like Experience:** Full-screen mode dengan custom theme color

### File Terkait:
- `manifest.json` - Metadata aplikasi PWA
- `sw.js` - Service Worker untuk caching & offline support
- `icons/` - Icon assets untuk berbagai ukuran

### Cara Install PWA:
1. Buka aplikasi di browser
2. Klik ikon **Install** atau **Add to Home Screen** (tergantung browser)
3. Aplikasi dapat diakses dari home screen seperti aplikasi native

---

## 🐛 Troubleshooting

### ❌ Error: "Koneksi database gagal"
**Solusi:**
- Pastikan MySQL sudah berjalan di XAMPP Control Panel
- Verifikasi credentials di `api-toko/koneksi.php`
- Pastikan database `db_toko` sudah dibuat

### ❌ Error: "Query gagal"
**Solusi:**
- Verifikasi tabel `barang` sudah dibuat dengan schema yang benar
- Pastikan ada minimal satu record di tabel
- Cek syntax SQL di database query

### ❌ Tabel tidak muncul / Data tidak tampil
**Solusi:**
- Buka console browser (F12) untuk melihat error message
- Check Network tab untuk melihat respons dari API
- Verifikasi path ke `get_barang.php` sudah benar

### ❌ Service Worker tidak terdaftar
**Solusi:**
- Pastikan browser mendukung PWA (Chrome, Firefox, Edge)
- Buka di `http://` bukan `file://` (beberapa fitur PWA butuh HTTPS/localhost)
- Clear browser cache dan reload

### ❌ Animasi tilt tidak bekerja
**Solusi:**
- Pastikan JavaScript tidak ter-block di browser settings
- Periksa console untuk error messages
- Coba di browser lain untuk verifikasi kompatibilitas

---

## 📊 Contoh Data yang Ditampilkan

Setelah setup berhasil, tabel akan menampilkan data seperti:

| No | Nama Barang | Harga | Aksi |
|----|-----------|-------|------|
| 1 | Laptop Dell XPS 13 | Rp 12.000.000 | Detail |
| 2 | Monitor LG 24 inch | Rp 2.500.000 | Detail |
| 3 | Keyboard Mechanical | Rp 1.500.000 | Detail |
| 4 | Mouse Logitech | Rp 500.000 | Detail |
| 5 | Headset Gaming | Rp 1.200.000 | Detail |

---

## 🔄 Flow Interaksi Aplikasi

1. **User membuka aplikasi** → index.html diload dengan loading state
2. **app.js dijalankan** → Fetch request dikirim ke API
3. **API menerima request** → get_barang.php dieksekusi
4. **Database query** → Data diambil dari tabel barang
5. **JSON response** → Server mengirim data dalam format JSON
6. **Client render DOM** → Tabel diisi dengan data dari response
7. **User interaksi** → Hover animasi, bisa install sebagai PWA

---

## 📝 Catatan Penting

- Aplikasi ini dibuat dengan **PHP Native** tanpa framework untuk mendemonstrasikan konsep dasar Client-Server
- Database credentials: Default XAMPP (user: `root`, pass: kosong)
- Semua komunikasi dioptimalkan untuk responsivitas dan user experience
- PWA support tersedia untuk pengalaman app-like modern
- Code sudah commented untuk pembelajaran dan maintenance

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan akademik dalam mata kuliah **Pemrograman Berbasis Platform (PBP)**. 
Bebas dimodifikasi dan didistribusikan untuk tujuan pembelajaran.

---

## 🙏 Ucapan Terima Kasih
- **Dosen Pengampu:** Sucipto, M.Kom
- **Universitas Muhammadiyah Pontianak**
- **Bootstrap 5** - Untuk framework CSS
- **Google Fonts** - Untuk font Inter

---

## 📧 Kontak & Support
Jika ada pertanyaan atau issue:
- 📌 Buat issue di repository GitHub
- 💬 Hubungi mahasiswa pengembang
- 📚 Konsultasi dengan dosen pengampu

---

**Last Updated:** April 2026 | **Status:** Maintained ✅