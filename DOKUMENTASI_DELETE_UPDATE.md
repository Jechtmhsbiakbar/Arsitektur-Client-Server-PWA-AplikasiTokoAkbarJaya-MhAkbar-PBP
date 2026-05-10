# 📚 Dokumentasi Fitur Delete & Update

Dokumen ini menjelaskan alur logika lengkap untuk fitur Delete dan Update yang telah diimplementasikan.

---

## 🎯 Ringkasan Fitur

### ✅ Fitur yang Sudah Ada:
- **Create (POST)**: Tambah barang baru
- **Read (GET)**: Tampilkan semua barang

### 🆕 Fitur Baru:
- **Update/Edit (PUT)**: Edit data barang yang sudah ada
- **Delete (DELETE)**: Hapus data barang

---

## 📊 Alur Logika DELETE

```
USER KLIK TOMBOL "HAPUS"
       ↓
KONFIRMASI DENGAN confirm()
       ↓
  "Yakin ingin menghapus?" ──→ BATAL → Keluar
       ↓ OK
FETCH API DELETE
  - Endpoint: api-toko/delete_barang.php
  - Method: DELETE
  - Body: { id: barang_id }
       ↓
SERVER PROSES DELETE
  - Query: DELETE FROM barang WHERE id = ?
  - Return: JSON { status, message }
       ↓
CLIENT TERIMA RESPONSE
       ↓
  STATUS = "success"? ──→ Hapus dari array
       ↓ Yes             (allBarangData)
  Tampilkan Alert       ↓
       ↓            Re-render tabel
  Re-render tabel    Update stats
  Update stats
```

### Kode Delete yang Dijalankan:

```javascript
function deleteBarang(id) {
  // 1. KONFIRMASI USER
  const konfirmasi = confirm("Yakin ingin menghapus data ini?");
  if (!konfirmasi) return;
  
  // 2. KIRIM FETCH API DELETE KE SERVER
  fetch("api-toko/delete_barang.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id })
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === "success") {
      // 3. HAPUS DARI ARRAY LOCAL
      allBarangData = allBarangData.filter(item => item.id !== id);
      
      // 4. RE-RENDER TABEL & UPDATE STATS
      renderTable(allBarangData);
      updateStats();
      
      // 5. TAMPILKAN ALERT SUKSES
      showAlert("✅ Berhasil!", "Data barang telah dihapus", "success");
    }
  });
}
```

### Endpoint PHP untuk Delete:

**File:** `api-toko/delete_barang.php`

```php
<?php
include "koneksi.php";

// Ambil data dari body (JSON)
$data = json_decode(file_get_contents("php://input"), true);
$id = (int)$data["id"];

// Query delete
$query = "DELETE FROM barang WHERE id = $id";
$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
  echo json_encode([
    "status" => "success",
    "message" => "Barang berhasil dihapus",
    "id" => $id
  ]);
} else {
  echo json_encode([
    "status" => "error",
    "message" => "Gagal menghapus: " . mysqli_error($koneksi)
  ]);
}
?>
```

---

## 📝 Alur Logika UPDATE/EDIT

```
USER KLIK TOMBOL "EDIT"
       ↓
CARI DATA DI ARRAY
  allBarangData.find(item => item.id == id)
       ↓
SET MODE EDIT
  - editMode = true
  - editingBarangId = id
       ↓
LOAD DATA KE FORM
  - document.getElementById("nama-barang").value = data.nama_barang
  - document.getElementById("harga-barang").value = data.harga
       ↓
UBAH LABEL & BUTTON
  - Modal header: "✏️ Edit Barang"
  - Submit button: "Perbarui Barang"
       ↓
BUKA MODAL FORM
       ↓
USER ISI FORM & KLIK "PERBARUI BARANG"
       ↓
FETCH API PUT/PATCH
  - Endpoint: api-toko/update_barang.php
  - Method: PUT
  - Body: { id, nama_barang, harga }
       ↓
SERVER PROSES UPDATE
  - Query: UPDATE barang SET ... WHERE id = ?
  - Return: JSON { status, data }
       ↓
CLIENT TERIMA RESPONSE
       ↓
  STATUS = "success"? ──→ Update array
       ↓ Yes           (cari index, replace data)
  Tampilkan Alert       ↓
       ↓            Re-render tabel
  Re-render tabel   Clear form
  Clear form        Reset mode
  Reset mode         ↓
                   Tutup modal
```

### Kode Edit/Update yang Dijalankan:

```javascript
// ===== STEP 1: LOAD DATA KE FORM (saat klik Edit) =====
function editBarang(id) {
  // Cari data barang di array
  const barang = allBarangData.find(item => item.id == id);
  
  // Set state untuk tracking mode edit
  editMode = true;
  editingBarangId = id;
  
  // Masukkan data ke input form
  document.getElementById("nama-barang").value = barang.nama_barang;
  document.getElementById("harga-barang").value = barang.harga;
  
  // Ubah label dan button
  document.querySelector(".modal-header-tambah h3").textContent = "✏️ Edit Barang";
  document.querySelector(".btn-submit-tambah").textContent = "Perbarui Barang";
  
  // Buka modal
  openModalTambah();
}

// ===== STEP 2: SUBMIT FORM (HANDLE TAMBAH vs UPDATE) =====
async function submitTambahBarang(event) {
  event.preventDefault();

  const namaBarang = document.getElementById("nama-barang").value;
  const hargaBarang = parseInt(document.getElementById("harga-barang").value);

  // MODE UPDATE
  if (editMode && editingBarangId) {
    const response = await fetch("api-toko/update_barang.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingBarangId,
        nama_barang: namaBarang,
        harga: hargaBarang
      })
    });

    const result = await response.json();

    if (result.status === "success") {
      // Update data di array
      const indexToUpdate = allBarangData.findIndex(
        item => item.id == editingBarangId
      );
      if (indexToUpdate !== -1) {
        allBarangData[indexToUpdate] = result.data;
      }

      // Re-render dan close modal
      renderTable(allBarangData);
      updateStats();
      closeModalTambah(); // akan memanggil clearFormAndResetMode()
    }
  }
  
  // MODE TAMBAH (sama seperti sebelumnya)
  else {
    const response = await fetch("api-toko/tambah_barang.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_barang: namaBarang,
        harga: hargaBarang
      })
    });

    const result = await response.json();

    if (result.status === "success") {
      allBarangData.push(result.data);
      renderTable(allBarangData);
      updateStats();
      closeModalTambah();
    }
  }
}

// ===== STEP 3: CLEAR FORM & RESET MODE =====
function clearFormAndResetMode() {
  // Clear input
  document.getElementById("nama-barang").value = "";
  document.getElementById("harga-barang").value = "";

  // Reset mode ke TAMBAH
  editMode = false;
  editingBarangId = null;

  // Reset label dan button
  document.querySelector(".modal-header-tambah h3").textContent = "➕ Tambah Barang Baru";
  document.querySelector(".btn-submit-tambah").textContent = "Simpan Barang";
}
```

### Endpoint PHP untuk Update:

**File:** `api-toko/update_barang.php`

```php
<?php
include "koneksi.php";

// Ambil data dari body (JSON)
$data = json_decode(file_get_contents("php://input"), true);

$id = (int)$data["id"];
$nama_barang = mysqli_real_escape_string($koneksi, $data["nama_barang"]);
$harga = (int)$data["harga"];

// Query update
$query = "UPDATE barang SET nama_barang = '$nama_barang', harga = $harga WHERE id = $id";
$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
  echo json_encode([
    "status" => "success",
    "message" => "Barang berhasil diperbarui",
    "data" => [
      "id" => $id,
      "nama_barang" => $nama_barang,
      "harga" => $harga
    ]
  ]);
} else {
  echo json_encode([
    "status" => "error",
    "message" => "Gagal memperbarui: " . mysqli_error($koneksi)
  ]);
}
?>
```

---

## 🔑 Konsep Penting

### 1. State Variables untuk Tracking Mode

```javascript
let editMode = false;        // true = edit, false = tambah
let editingBarangId = null;  // ID data yang sedang diedit
```

**Fungsi:**
- `editMode`: Membedakan apakah user sedang menambah atau edit data
- `editingBarangId`: Menyimpan ID data saat ini untuk dikirim ke server saat update

### 2. Array Manipulation (Tidak perlu reload halaman)

**Delete dari array:**
```javascript
allBarangData = allBarangData.filter(item => item.id !== id);
```

**Update di array:**
```javascript
const index = allBarangData.findIndex(item => item.id == editingBarangId);
allBarangData[index] = result.data;
```

**Tambah ke array:**
```javascript
allBarangData.push(result.data);
```

### 3. DOM Manipulation untuk UI

**Ubah text button:**
```javascript
document.querySelector(".btn-submit-tambah").textContent = "Perbarui Barang";
```

**Ubah nilai input:**
```javascript
document.getElementById("nama-barang").value = barang.nama_barang;
```

### 4. Render Ulang Tabel (TanpaReload)

```javascript
// Hanya render ulang dengan data baru di array
renderTable(allBarangData);

// Update juga statistik
updateStats();
```

---

## 📍 Tombol Aksi di Tabel

Tombol Edit dan Delete ditambahkan dinamis saat render:

```javascript
function renderTable(dataToRender) {
  const tbody = document.getElementById("isi-tabel");
  let baris = "";

  dataToRender.forEach((barang) => {
    baris += `
      <tr>
          <td class="ps-4 fw-bold text-muted">${barang.id}</td>
          <td class="fw-semibold">${barang.nama_barang}</td>
          <td class="price-tag">Rp ${parseInt(barang.harga).toLocaleString("id-ID")}</td>
          <td>
              <button class="btn btn-sm btn-warning" onclick="editBarang(${barang.id})">✏️ Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteBarang(${barang.id})">🗑️ Hapus</button>
          </td>
      </tr>`;
  });
  
  tbody.innerHTML = baris;
}
```

**Penjelasan:**
- Tombol Edit → panggil `editBarang(id)`
- Tombol Hapus → panggil `deleteBarang(id)`

---

## 🔄 Flow Lengkap Update

### Scenario: User Edit Barang

1. **Klik Tombol Edit**
   ```
   Tombol Edit di row → onclick="editBarang(123)"
   ```

2. **Function editBarang() Dipanggil**
   ```javascript
   editMode = true;
   editingBarangId = 123;
   document.getElementById("nama-barang").value = "Laptop";
   document.getElementById("harga-barang").value = 12000000;
   openModalTambah();
   ```

3. **User Lihat Modal Dengan Data Terisi**
   ```
   Modal Header: ✏️ Edit Barang
   Input Nama: Laptop
   Input Harga: 12000000
   Button: Perbarui Barang
   ```

4. **User Ubah Data & Klik "Perbarui Barang"**
   ```
   Input Nama: Laptop ROG Gaming
   Input Harga: 15000000
   Klik Submit
   ```

5. **submitTambahBarang() Dipanggil**
   ```javascript
   if (editMode && editingBarangId) {
     fetch("api-toko/update_barang.php", {
       method: "PUT",
       body: { id: 123, nama_barang: "Laptop ROG Gaming", harga: 15000000 }
     })
   }
   ```

6. **Server Update Database**
   ```sql
   UPDATE barang 
   SET nama_barang = 'Laptop ROG Gaming', harga = 15000000 
   WHERE id = 123
   ```

7. **Client Update Array & Render Ulang**
   ```javascript
   allBarangData[indexToUpdate] = result.data;
   renderTable(allBarangData);
   updateStats();
   ```

8. **Form & UI Reset (closeModalTambah)**
   ```javascript
   document.getElementById("form-tambah").reset();
   clearFormAndResetMode();
   
   // Hasil akhir:
   editMode = false;
   editingBarangId = null;
   Modal Header kembali: ➕ Tambah Barang Baru
   Button kembali: Simpan Barang
   ```

---

## ✅ Checklist Testing

- [ ] Klik tombol **Hapus** → Konfirmasi muncul
- [ ] Klik **OK** di konfirmasi → Data hilang dari tabel
- [ ] Tabel **refresh otomatis** tanpa reload halaman
- [ ] Klik tombol **Edit** → Form terisi dengan data
- [ ] Label berubah menjadi **"✏️ Edit Barang"**
- [ ] Button berubah menjadi **"Perbarui Barang"**
- [ ] Edit data dan klik **"Perbarui Barang"** → Data terupdate
- [ ] Tabel menampilkan data yang sudah diubah
- [ ] Setelah close modal → Form kosong dan label kembali normal
- [ ] Cek **Console** untuk debugging logs

---

## 🐛 Debugging Tips

**Buka Developer Tools (F12) → Console**

Anda akan melihat logs:
```
✏️ Mengedit barang dengan ID: 123
📦 Data yang diedit: {id: 123, nama_barang: "Laptop", harga: 12000000}
📝 Mode UPDATE - ID: 123
✅ Update berhasil: {...}
```

Jika ada error:
```
❌ Error deleting data: ...
```

---

## 📝 Catatan Penting

1. **Penyimpanan ID Sementara:** Menggunakan variabel `editingBarangId` di memory
2. **Pembedaan Mode:** Menggunakan variabel `editMode` (boolean)
3. **Fetch Method:** Gunakan `PUT` untuk update (standard REST API)
4. **Array Manipulation:** Lebih cepat daripada reload halaman
5. **Konfirmasi Delete:** Gunakan `confirm()` built-in JavaScript
6. **Server Response:** Return data lengkap untuk update di client

---

**Sukses! Fitur Delete dan Update sudah siap digunakan.** ✨
