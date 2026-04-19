# Arsitektur Client-Server: Katalog Inventaris Barang
**Tugas Mata Kuliah: Pemrograman Berbasis Platform (PBP)**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/MhAkbar/Arsitektur-Client-Server-MhAkbar-PBP/pulls)

## 👤 Identitas Mahasiswa
* **Nama:** Muhammad Hasbih Akbar
* **NIM:** 231220075
* **Kelas:** 31
* **Program Studi:** Teknik Informatika
* **Kampus:** Universitas Muhammadiyah Pontianak
* **Dosen Pengampu:** Sucipto, M.Kom

---

## 📌 Deskripsi Proyek
Proyek ini mendemonstrasikan penerapan **Arsitektur Client-Server** sederhana. Aplikasi ini berfungsi untuk menampilkan data inventaris barang secara dinamis dari database MySQL ke antarmuka web tanpa melalui proses *hardcoding* di sisi HTML. 

Komunikasi data dilakukan secara *asynchronous* menggunakan **Fetch API** untuk mengambil data berformat **JSON** yang disediakan oleh endpoint PHP.

### Fitur Utama:
- **UI Interaktif:** Desain modern menggunakan Bootstrap 5 dengan efek *Glassmorphism*.
- **Animasi Tilt:** Kartu identitas yang bergerak mengikuti kursor (interaktif).
- **Dynamic Data:** Sinkronisasi otomatis antara database MySQL dengan tampilan tabel.
- **Loading State:** Indikator visual saat data sedang dimuat dari server.

---

## 🛠️ Teknologi yang Digunakan
- **Frontend:** HTML5, CSS3 (Custom Styles), JavaScript (ES6+ Fetch API), Bootstrap 5.
- **Backend:** PHP (Native).
- **Database:** MySQL.
- **Tools:** XAMPP, VS Code, Git.

---

## 📂 Struktur Folder
```text
Arsitektur-Client-Server-MhAkbar-PBP/
├── api-toko/               # Server-Side (Backend)
│   ├── koneksi.php         # Konfigurasi koneksi database
│   └── get_barang.php      # Endpoint API (Output JSON)
├── app-toko/               # Client-Side (Frontend)
    ├── index.html          # Antarmuka Utama
    └── app.js              # Logika Fetch API & DOM Manipulation
