// ============================================================
// � TOKEN GUARD - PROTEKSI HALAMAN UTAMA
// ============================================================
const myToken = localStorage.getItem('token_toko');

if (!myToken) {
    alert('❌ Anda harus login terlebih dahulu!');
    window.location.href = 'login.html';
}

console.log('✅ Token ditemukan, user authorized');
// ============================================================
// 🌐 DETERMINE BASE URL (LOCALHOST vs HOSTING)
// ============================================================
let baseUrl;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Localhost
    baseUrl = 'http://localhost/toko-PBP-01';
} else {
    // Hosting
    baseUrl = 'https://tokoakbar.infinityfree.me';
}

console.log('🌐 Base URL:', baseUrl);
// ============================================================
// 🛒 DATA FETCHING & STATE MANAGEMENT
// ============================================================
let allBarangData = []; // Store semua data untuk search
let editMode = false; // Tracking apakah mode edit atau tambah
let editingBarangId = null; // Menyimpan ID data yang sedang diedit

// Helper: header standar tanpa Authorization
// (InfinityFree memblokir Authorization header di shared hosting)
function getHeaders() {
    return { 'Content-Type': 'application/json' };
}

// Helper: sisipkan token ke dalam object data sebelum dikirim ke server
function withToken(data) {
    return Object.assign({ token: myToken }, data);
}

function updateStats() {
  const totalBarang = allBarangData.length;
  const totalHarga = allBarangData.reduce((sum, item) => sum + parseInt(item.harga), 0);
  
  console.log("📊 Update Stats - Total Barang:", totalBarang, "Total Harga:", totalHarga);
  console.log("📊 allBarangData:", allBarangData);
  
  const totalBarangEl = document.getElementById('total-barang');
  const totalHargaEl = document.getElementById('total-harga');
  
  if (totalBarangEl) {
    totalBarangEl.textContent = totalBarang;
  } else {
    console.error("❌ Element #total-barang tidak ditemukan");
  }
  
  if (totalHargaEl) {
    totalHargaEl.textContent = `Rp ${totalHarga.toLocaleString("id-ID")}`;
  } else {
    console.error("❌ Element #total-harga tidak ditemukan");
  }
}

function renderTable(dataToRender) {
  const tbody          = document.getElementById("isi-tabel");
  const mobileCardList = document.getElementById("mobile-card-list");
  let baris       = "";
  let mobileCards = "";
 
  if (dataToRender.length === 0) {
    baris       = `<tr><td colspan="5" class="text-center text-muted py-4">Tidak ada barang ditemukan</td></tr>`;
    mobileCards = `<div style="padding:60px 24px;text-align:center;"><div style="font-size:.88rem;color:var(--text-sub);">Tidak ada barang ditemukan</div></div>`;
  } else {
    dataToRender.forEach((barang, index) => {
      const nomor = index + 1;
 
      // ── Buat HTML thumbnail gambar ──────────────────────────
      let gambarHTML;
      if (barang.gambar) {
        const urlGambar = `${baseUrl}/api-toko/uploads/${barang.gambar}`;
        gambarHTML = `<img
          src="${urlGambar}"
          alt="${barang.nama_barang}"
          style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:2px solid #e0e7ff;display:block;"
          onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div style=&quot;width:52px;height:52px;background:#f3f4f6;border-radius:8px;border:2px dashed #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.3rem;&quot;>📦</div>')">`;
      } else {
        gambarHTML = `<div style="width:52px;height:52px;background:#f3f4f6;border-radius:8px;border:2px dashed #d1d5db;display:flex;align-items:center;justify-content:center;font-size:1.3rem;">📦</div>`;
      }
 
      // ── Desktop row (5 kolom: No, Foto, Nama, Harga, Aksi) ──
      baris += `
        <tr>
          <td class="ps-4 fw-bold text-muted">${nomor}</td>
          <td style="vertical-align:middle;padding:8px 12px;">${gambarHTML}</td>
          <td class="fw-semibold">${barang.nama_barang}</td>
          <td class="price-tag">Rp ${parseInt(barang.harga).toLocaleString("id-ID")}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editBarang(${barang.id})">✏️ Edit</button>
            <button class="btn btn-sm btn-danger"  onclick="deleteBarang(${barang.id})">🗑️ Hapus</button>
          </td>
        </tr>`;
 
      // ── Mobile card ─────────────────────────────────────────
      mobileCards += `
        <div class="mobile-card">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
            ${gambarHTML}
            <div style="flex:1;">
              <div style="font-size:.72rem;color:var(--text-sub);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">No. ${nomor}</div>
              <div style="font-size:.95rem;font-weight:700;color:var(--text-main);">${barang.nama_barang}</div>
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <div style="background:#ede9fe;color:var(--primary);border-radius:20px;padding:4px 12px;font-weight:700;font-size:.82rem;display:inline-block;">
              Rp ${parseInt(barang.harga).toLocaleString("id-ID")}
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm btn-warning" onclick="editBarang(${barang.id})" style="flex:1;">✏️ Edit</button>
            <button class="btn btn-sm btn-danger"  onclick="deleteBarang(${barang.id})" style="flex:1;">🗑️ Hapus</button>
          </div>
        </div>`;
    });
  }
 
  tbody.innerHTML = baris;
  if (mobileCardList) mobileCardList.innerHTML = mobileCards;
}
 

function loadDataBarang() {
  console.log("🔄 Loading data barang...");
  
  fetch(`${baseUrl}/api-toko/get_barang.php`, {
    headers: getHeaders()
  })
    .then((response) => {
      console.log("✅ Response status:", response.status);
      
      // Jika 401, berarti token invalid/expired
      if (response.status === 401) {
        console.error("❌ Token invalid atau expired. Redirect ke login.");
        localStorage.removeItem('token_toko');
        window.location.href = 'login.html';
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseObject) => {
      if (!responseObject) return; // Exit jika sudah redirect ke login
      
      console.log("📦 Response Object:", responseObject);
      
      if (!responseObject.data) {
        throw new Error("Data tidak ditemukan dalam response");
      }

      allBarangData = responseObject.data; // Simpan data original
      console.log("✅ Data berhasil disimpan. Total:", allBarangData.length);
      
      renderTable(allBarangData);
      updateStats(); // Panggil updateStats setelah data tersimpan
    })
    .catch((error) => {
      console.error("❌ Gagal memuat data:", error);
      const tbody = document.getElementById("isi-tabel");
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Gagal memuat data: ${error.message}</td></tr>`;
    });
}

// ============================================================
// 🗑️ DELETE LOGIC
// ============================================================
function deleteBarang(id) {
  // Konfirmasi sebelum delete
  const konfirmasi = confirm("Yakin ingin menghapus data ini?");
  
  if (!konfirmasi) {
    console.log("❌ Delete dibatalkan oleh user");
    return;
  }
  
  console.log("🗑️ Menghapus barang dengan ID:", id);
  
  // Fetch API untuk DELETE
  fetch(`${baseUrl}/api-toko/delete_barang.php`, {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify(withToken({ id: id }))
  })
  .then((response) => {
    console.log("✅ Delete response status:", response.status);
    
    // Jika 401, token invalid
    if (response.status === 401) {
      console.error("❌ Token invalid atau expired. Redirect ke login.");
      localStorage.removeItem('token_toko');
      window.location.href = 'login.html';
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((result) => {
    console.log("✅ Delete result:", result);
    
    if (result.status === "success") {
      showAlert("success", "✅ Berhasil!", "Data barang telah dihapus");
      
      // AUTO-REFRESH DATA DARI SERVER
      console.log("🔄 Auto-refresh data dari server...");
      setTimeout(() => {
        loadDataBarang();
      }, 1000);
    } else {
      showAlert("❌ Gagal!", result.message, "error");
    }
  })
  .catch((error) => {
    console.error("❌ Error deleting data:", error);
    showAlert("❌ Gagal!", "Terjadi kesalahan saat menghapus data", "error");
  });
}

// ============================================================
// ✏️ EDIT LOGIC (LOAD DATA KE FORM)
// ============================================================
function editBarang(id) {
  console.log("✏️ Mengedit barang dengan ID:", id);
  
  // Cari data barang berdasarkan ID
  const barang = allBarangData.find(item => item.id == id);
  
  if (!barang) {
    console.error("❌ Barang tidak ditemukan");
    showAlert("❌ Error!", "Data barang tidak ditemukan", "error");
    return;
  }
  
  console.log("📦 Data yang diedit:", barang);
  
  // Set mode edit
  editMode = true;
  editingBarangId = id;
  
  // Masukkan data ke form
  document.getElementById("nama-barang").value = barang.nama_barang;
  document.getElementById("harga-barang").value = barang.harga;
  
  // Ubah label modal
  const modalHeader = document.querySelector(".modal-header-tambah h3");
  if (modalHeader) {
    modalHeader.textContent = "✏️ Edit Barang";
  }
  
  // Ubah text button
  const submitBtn = document.querySelector(".btn-submit-tambah");
  if (submitBtn) {
    submitBtn.textContent = "Perbarui Barang";
  }
  
  // Buka modal
  openModalTambah();
}

// ============================================================
// 💾 CLEAR FORM & RESET MODE
// ============================================================
function clearFormAndResetMode() {
  console.log("🧹 Clearing form dan reset mode...");
  
  // Clear input form
  document.getElementById("nama-barang").value = "";
  document.getElementById("harga-barang").value = "";
  
  // Reset mode ke tambah
  editMode = false;
  editingBarangId = null;
  
  // Reset label dan button
  const modalHeader = document.querySelector(".modal-header-tambah h3");
  if (modalHeader) {
    modalHeader.textContent = "➕ Tambah Barang Baru";
  }
  
  const submitBtn = document.querySelector(".btn-submit-tambah");
  if (submitBtn) {
    submitBtn.textContent = "Simpan Barang";
  }
}

// ============================================================
// 💾 SUBMIT FORM — TAMBAH ATAU EDIT
// ============================================================
function submitTambahBarang(event) {
  event.preventDefault();
 
  const namaBarang  = document.getElementById("nama-barang").value.trim();
  const hargaBarang = parseInt(document.getElementById("harga-barang").value);
 
  if (!namaBarang || !hargaBarang || hargaBarang < 1) {
    showAlert("warning", "⚠️ Perhatian!", "Nama barang dan harga wajib diisi dengan benar.");
    return;
  }
 
  // Ambil input gambar (dipakai di kedua mode)
  const inputGambar = document.getElementById("input-gambar");
 
  if (editMode && editingBarangId !== null) {
    // ── MODE EDIT ──────────────────────────────────────────────
    console.log("✏️ Submitting edit untuk ID:", editingBarangId);
 
    const fd = new FormData();
    fd.append("token",       myToken);
    fd.append("id",          editingBarangId);
    fd.append("nama_barang", namaBarang);
    fd.append("harga",       hargaBarang);
 
    if (inputGambar && inputGambar.files.length > 0) {
      fd.append("gambar", inputGambar.files[0]);
      console.log("📷 Gambar baru:", inputGambar.files[0].name);
    }
 
    // method POST bukan PUT — PHP tidak bisa baca $_FILES dari PUT
    fetch(`${baseUrl}/api-toko/update_barang.php`, {
      method: "POST",
      body: fd           // JANGAN tambahkan headers Content-Type
    })
    .then(response => {
      if (response.status === 401) {
        // Jangan langsung redirect — cek dulu response body-nya
        return response.json().then(err => {
          console.error("❌ 401 dari update:", err);
          // Hanya redirect jika benar-benar token invalid (bukan error lain)
          if (err.pesan && err.pesan.includes("Token")) {
            localStorage.removeItem('token_toko');
            window.location.href = 'login.html';
          } else {
            showAlert("error", "❌ Gagal!", err.pesan || err.message || "Akses ditolak.");
          }
          return null;
        });
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(result => {
      if (!result) return;
      console.log("✅ Update result:", result);
      if (result.status === "success") {
        closeModalTambah();
        showAlert("success", "✅ Berhasil!", "Data barang berhasil diperbarui.");
        if (inputGambar) {
          inputGambar.value = "";
          const prev = document.getElementById('preview-gambar');
          if (prev) prev.style.display = 'none';
        }
        setTimeout(() => loadDataBarang(), 800);
      } else {
        showAlert("error", "❌ Gagal!", result.message || "Gagal memperbarui barang.");
      }
    })
    .catch(error => {
      console.error("❌ Error update:", error);
      showAlert("error", "❌ Gagal!", "Terjadi kesalahan saat memperbarui data.");
    });
 
  } else {
    // ── MODE TAMBAH ────────────────────────────────────────────
    console.log("➕ Submitting tambah barang baru");
 
    const fd = new FormData();
    fd.append("token",       myToken);
    fd.append("nama_barang", namaBarang);
    fd.append("harga",       hargaBarang);
 
    if (inputGambar && inputGambar.files.length > 0) {
      fd.append("gambar", inputGambar.files[0]);
      console.log("📷 Gambar:", inputGambar.files[0].name);
    }
 
    fetch(`${baseUrl}/api-toko/tambah_barang.php`, {
      method: "POST",
      body: fd           // JANGAN tambahkan headers Content-Type
    })
    .then(response => {
      if (response.status === 401) {
        return response.json().then(err => {
          console.error("❌ 401 dari tambah:", err);
          if (err.pesan && err.pesan.includes("Token")) {
            localStorage.removeItem('token_toko');
            window.location.href = 'login.html';
          } else {
            showAlert("error", "❌ Gagal!", err.pesan || err.message || "Akses ditolak.");
          }
          return null;
        });
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(result => {
      if (!result) return;
      console.log("✅ Tambah result:", result);
      if (result.status === "success") {
        closeModalTambah();
        showAlert("success", "✅ Berhasil!", "Barang baru berhasil ditambahkan.");
        if (inputGambar) {
          inputGambar.value = "";
          const prev = document.getElementById('preview-gambar');
          if (prev) prev.style.display = 'none';
        }
        setTimeout(() => loadDataBarang(), 800);
      } else {
        showAlert("error", "❌ Gagal!", result.message || "Gagal menambahkan barang.");
      }
    })
    .catch(error => {
      console.error("❌ Error tambah:", error);
      showAlert("error", "❌ Gagal!", "Terjadi kesalahan saat menambahkan data.");
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOM Content Loaded");
  const loadingStatus = document.getElementById('loading-status');
  
  loadDataBarang();
  
  // Sembunyikan loading spinner setelah data dimuat
  setTimeout(() => {
    if (loadingStatus) loadingStatus.classList.add('d-none');
  }, 1000);
  
  // Setup search functionality
  const searchInput = document.getElementById('search-barang');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      if (searchTerm.trim() === '') {
        // Jika search kosong, tampilkan semua data
        renderTable(allBarangData);
      } else {
        // Filter data berdasarkan search term
        const filtered = allBarangData.filter(barang => 
          barang.nama_barang.toLowerCase().includes(searchTerm)
        );
        renderTable(filtered);
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
    // Listener preview gambar — jalankan setelah DOM siap
    const inputGambar = document.getElementById('input-gambar');
    if (inputGambar) {
        inputGambar.addEventListener('change', function () {
            const file = this.files[0]; // Ambil file pertama yang dipilih
            const previewDiv = document.getElementById('preview-gambar');
            const imgPreview = document.getElementById('img-preview');
 
            if (file) {
                // Buat URL sementara dari file lokal untuk ditampilkan di browser
                const objectURL = URL.createObjectURL(file);
                imgPreview.src = objectURL;
                previewDiv.style.display = 'block'; // Tampilkan div preview
            } else {
                previewDiv.style.display = 'none'; // Sembunyikan jika tidak ada file
            }
        });
    }
});

// ============================================================
// 🛠️ SERVICE WORKER REGISTRATION & UPDATE DETECTION
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((reg) => {
        console.log("✅ SW Terdaftar:", reg.scope);
        
        // 🆕 LISTEN KE MESSAGE DARI SW TENTANG UPDATE
        navigator.serviceWorker.addEventListener('message', (event) => {
          const data = event.data;
          
          if (data.type === 'SW_UPDATED') {
            console.log('🆕 Update dari SW detected!', data);
            
            // Update localStorage dengan info update terbaru
            localStorage.setItem('sw-version', data.version);
            localStorage.setItem('cache-name', data.cacheVersion);
            localStorage.setItem('last-update', new Date().toLocaleTimeString('id-ID'));
            localStorage.setItem('latest-version', data.version);
            
            // Update UI di testing panel
            updateDebugInfo();
            updateUpdateStatus();
            
            // Tampilkan notifikasi update
            showUpdateNotification();
            
            // AUTO-RELOAD SETELAH 3 DETIK (agar user lihat notifikasi dulu)
            setTimeout(() => {
              console.log('🔄 Auto-reloading dengan versi terbaru...');
              window.location.reload();
            }, 3000);
          }
        });
        
        // CHECK UPDATE SETIAP 5 MENIT (jadi tidak hanya tunggu SW)
        setInterval(() => {
          console.log("🔄 Checking for SW updates...");
          reg.update();
        }, 5 * 60 * 1000);
        
        // DETECT KETIKA ADA UPDATE TERSEDIA (via updatefound event)
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Update tersedia - tampilkan notifikasi ke user
              console.log("🆕 Update tersedia!");
              
              // Juga trigger update info
              localStorage.setItem('latest-version', 'v' + Math.floor(Math.random() * 100));
              updateUpdateStatus();
              showUpdateNotification();
            }
          });
        });
      })
      .catch((err) => console.error("❌ SW Gagal:", err));
  });
}

// ============================================================
// 📢 SHOW UPDATE NOTIFICATION
// ============================================================
function showUpdateNotification() {
  // Cek apakah sudah ada notification
  if (document.getElementById('update-notification')) return;
  
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 9999;
    animation: slideInRight 0.4s ease-out;
    max-width: 350px;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <span style="font-size: 20px;">✨</span>
      <span>Fitur baru tersedia!</span>
    </div>
    <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 12px;">
      Aplikasi Anda telah diperbarui dengan fitur dan perbaikan terbaru.
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="location.reload()" style="
        flex: 1;
        background: white;
        color: #059669;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 13px;
      ">Muat Ulang</button>
      <button onclick="document.getElementById('update-notification').remove()" style="
        flex: 1;
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 13px;
      ">Nanti</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove setelah 30 detik jika user tidak klik
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      document.getElementById('update-notification').remove();
    }
  }, 30000);
}

// CSS Animation untuk slideInRight
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(400px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// ============================================================
// � CLEAR CACHE & RELOAD
// ============================================================
async function clearCacheAndReload() {
  console.log("🔄 Memulai complete cache clear dan reload ke state awal...");
  
  try {
    // 1️⃣ CLEAR ALL SERVICE WORKER CACHES
    console.log("🗑️ Step 1: Clearing all service worker caches...");
    const cacheNames = await caches.keys();
    const cacheDeletePromises = cacheNames.map(cacheName => {
      console.log(`   🗑️ Deleting cache: ${cacheName}`);
      return caches.delete(cacheName);
    });
    await Promise.all(cacheDeletePromises);
    console.log("✅ All caches deleted");
    
    // 2️⃣ CLEAR localStorage
    console.log("🗑️ Step 2: Clearing localStorage...");
    localStorage.clear();
    console.log("✅ LocalStorage cleared");
    
    // 3️⃣ CLEAR sessionStorage
    console.log("🗑️ Step 3: Clearing sessionStorage...");
    sessionStorage.clear();
    console.log("✅ SessionStorage cleared");
    
    // 4️⃣ CLEAR IndexedDB (jika ada database)
    console.log("🗑️ Step 4: Clearing IndexedDB databases...");
    const dbs = await indexedDB.databases();
    for (let db of dbs) {
      console.log(`   🗑️ Deleting IndexedDB: ${db.name}`);
      indexedDB.deleteDatabase(db.name);
    }
    console.log("✅ All IndexedDB databases deleted");
    
    // 5️⃣ CLEAR COOKIES
    console.log("🗑️ Step 5: Clearing all cookies...");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log("✅ All cookies cleared");
    
    // 6️⃣ UNREGISTER ALL SERVICE WORKERS
    console.log("🗑️ Step 6: Unregistering all service workers...");
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(reg => {
        console.log(`   🗑️ Unregistering SW: ${reg.scope}`);
        reg.unregister();
      });
    }
    console.log("✅ All service workers unregistered");
    
    // 7️⃣ RESET STATE VARIABLES KE DEFAULT
    console.log("🗑️ Step 7: Resetting application state variables...");
    allBarangData = [];
    editMode = false;
    editingBarangId = null;
    console.log("✅ State variables reset");
    
    // 8️⃣ CLEAR FORM INPUTS
    console.log("🗑️ Step 8: Clearing form inputs...");
    const searchInput = document.getElementById('search-barang');
    if (searchInput) searchInput.value = '';
    
    const namaInput = document.getElementById('nama-barang');
    if (namaInput) namaInput.value = '';
    
    const hargaInput = document.getElementById('harga-barang');
    if (hargaInput) hargaInput.value = '';
    
    const tbody = document.getElementById('isi-tabel');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Loading...</td></tr>';
    
    console.log("✅ Form inputs cleared");
    
    console.log("✅✅✅ SEMUA STORAGE BERHASIL DIHAPUS! Reload halaman...");
    
    // 9️⃣ RELOAD HALAMAN DENGAN CACHE BUSTING
    const timestamp = new Date().getTime();
    window.location.href = window.location.href.split('?')[0] + '?timestamp=' + timestamp;
    
  } catch (error) {
    console.error("❌ Error during cache clear:", error);
    alert("Terjadi error saat membersihkan cache. Silakan coba refresh manual (Ctrl+F5)");
    window.location.reload(true);
  }
}

// ============================================================
// �📲 LOGIKA PWA (OVERLAY & BANNER)
// ============================================================
let deferredPrompt;
const overlay = document.getElementById("pwa-overlay");
const banner = document.getElementById("pwa-banner");

// Fungsi cek status instalasi
function checkInstallation() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone) {
    console.log("🚀 Standalone Mode: Menyembunyikan semua prompt.");
    hideAllPrompts();
    return true;
  }
  return false;
}

// Tangkap event install
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Tampilkan overlay jika belum terinstall
  if (!checkInstallation()) {
    overlay.style.display = "flex";
  }
});

// Fungsi saat klik "Instal Sekarang"
function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("✅ User menginstall");
      hideAllPrompts();
    }
    deferredPrompt = null;
  });
}

// Fungsi saat klik "Nanti Saja" (Tutup Overlay, Munculkan Banner)
// TETAP MENAMPILKAN BANNER SAAT LOGIN
function hideOverlay() {
  if (overlay) overlay.style.display = "none";
  if (banner && !checkInstallation()) {
    banner.style.display = "block"; // SELALU tampilkan banner kecil
    console.log("📲 PWA Banner ditampilkan (tetap muncul saat login)");
  }
}

function hideAllPrompts() {
  if (overlay) overlay.style.display = "none";
  if (banner) banner.style.display = "none";
}

window.addEventListener("appinstalled", () => {
  hideAllPrompts();
});

window.addEventListener('load', checkInstallation);

// ============================================================
// 🚪 LOGOUT FUNCTION
// ============================================================
function logout() {
  const konfirmasi = confirm('Yakin ingin logout? Anda akan diarahkan ke halaman login.');
  
  if (konfirmasi) {
    console.log('🚪 Logging out...');
    
    // Clear token dari localStorage
    localStorage.removeItem('token_toko');
    
    // Optional: Clear app state
    allBarangData = [];
    editMode = false;
    editingBarangId = null;
    
    // Redirect ke login page
    window.location.href = 'login.html';
  }
}

// ============================================================
// 🧪 TESTING & DEBUG FUNCTIONS
// ============================================================

let testingPanelExpanded = true;

// Toggle testing section dengan shortcut Ctrl+Shift+T atau klik header
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'T') {
    e.preventDefault();
    toggleTestingPanel();
  }
});

function toggleTestingPanel() {
  const content = document.getElementById('testing-content');
  const header = document.getElementById('testing-header');
  const expandIcon = document.getElementById('expand-icon');
  
  testingPanelExpanded = !testingPanelExpanded;
  
  if (testingPanelExpanded) {
    // Expand
    content.style.maxHeight = '2000px';
    content.style.padding = '16px';
    header.style.borderRadius = '12px 12px 0 0';
    expandIcon.style.transform = 'rotate(0deg)';
    updateDebugInfo();
    updateUpdateStatus();
  } else {
    // Collapse
    content.style.maxHeight = '0px';
    content.style.padding = '0px';
    header.style.borderRadius = '12px';
    expandIcon.style.transform = 'rotate(180deg)';
  }
}

function addConsoleLog(message, type = 'log') {
  const console_el = document.getElementById('debug-console');
  if (!console_el) return; // Prevent error if element not found
  
  const timestamp = new Date().toLocaleTimeString();
  const icons = { 
    log: '📝', 
    success: '✅', 
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const line = document.createElement('div');
  line.style.color = {
    'success': '#10b981',
    'error': '#ef4444',
    'warning': '#f59e0b',
    'info': '#3b82f6',
    'log': '#10b981'
  }[type] || '#10b981';
  
  line.textContent = `${icons[type] || '📝'} [${timestamp}] ${message}`;
  console_el.appendChild(line);
  console_el.scrollTop = console_el.scrollHeight;
  
  console.log(`[${type.toUpperCase()}]`, message);
}

function updateDebugInfo() {
  // Update SW Version
  const swVerEl = document.getElementById('sw-version');
  if (swVerEl) swVerEl.textContent = localStorage.getItem('sw-version') || 'Unknown';
  
  // Update Cache Name
  const cacheNameEl = document.getElementById('cache-name');
  if (cacheNameEl) cacheNameEl.textContent = localStorage.getItem('cache-name') || 'toko-pwa-v3';
  
  // Update Token status
  const tokenStatusEl = document.getElementById('token-status');
  if (tokenStatusEl) {
    const token = localStorage.getItem('token_toko');
    tokenStatusEl.textContent = token ? '✅ Valid' : '❌ None';
  }
  
  // Update last update time
  const lastUpdateEl = document.getElementById('last-update');
  if (lastUpdateEl) {
    const lastUpdate = localStorage.getItem('last-update-time');
    lastUpdateEl.textContent = lastUpdate || 'Never';
  }
  
  addConsoleLog('Debug info updated', 'info');
}

function testUpdateNotification() {
  addConsoleLog('Testing update notification...', 'info');
  
  // Langsung trigger update notification tanpa perlu ubah SW
  showUpdateNotification();
  
  addConsoleLog('Update notification triggered!', 'success');
  
  // Save timestamp
  const now = new Date().toLocaleTimeString();
  localStorage.setItem('last-update-time', now);
  updateDebugInfo();
}

function testClearCache() {
  addConsoleLog('Testing clear cache function...', 'warning');
  
  const confirmed = confirm('⚠️ Ini akan menghapus semua cache dan storage. Yakin?');
  if (confirmed) {
    addConsoleLog('Starting cache clear...', 'warning');
    clearCacheAndReload();
  } else {
    addConsoleLog('Clear cache cancelled', 'log');
  }
}

function setTestVersion() {
  const versionInput = document.getElementById('version-input');
  if (!versionInput) {
    addConsoleLog('version-input element not found', 'error');
    return;
  }
  
  const newVersion = versionInput.value.trim();
  
  if (!newVersion) {
    addConsoleLog('Please enter a version (e.g., v4.0)', 'error');
    return;
  }
  
  addConsoleLog(`Setting test version to: ${newVersion}`, 'info');
  
  // Save ke localStorage untuk testing
  localStorage.setItem('test-version', newVersion);
  localStorage.setItem('sw-version', newVersion);
  
  addConsoleLog(`✅ Version set to ${newVersion}. Restart app to apply.`, 'success');
  
  versionInput.value = '';
  updateDebugInfo();
}

function checkSWStatus() {
  addConsoleLog('Checking Service Worker status...', 'info');
  
  if (!navigator.serviceWorker) {
    addConsoleLog('❌ Service Worker not supported', 'error');
    return;
  }
  
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length === 0) {
      addConsoleLog('No Service Workers registered', 'warning');
    } else {
      registrations.forEach((reg, idx) => {
        addConsoleLog(`SW ${idx + 1}: ${reg.scope}`, 'success');
        if (reg.installing) addConsoleLog('  - Installing: Yes', 'info');
        if (reg.waiting) addConsoleLog('  - Waiting: Yes', 'info');
        if (reg.active) addConsoleLog('  - Active: Yes', 'success');
      });
    }
  }).catch(err => {
    addConsoleLog(`Error: ${err.message}`, 'error');
  });
}

function showCaches() {
  addConsoleLog('Checking caches...', 'info');
  
  if (!caches) {
    addConsoleLog('❌ Cache API not supported', 'error');
    return;
  }
  
  caches.keys().then(cacheNames => {
    if (cacheNames.length === 0) {
      addConsoleLog('No caches found', 'warning');
    } else {
      addConsoleLog(`Found ${cacheNames.length} cache(s):`, 'info');
      cacheNames.forEach(cacheName => {
        addConsoleLog(`  📦 ${cacheName}`, 'success');
        
        // Get cache size
        caches.open(cacheName).then(cache => {
          cache.keys().then(keys => {
            addConsoleLog(`     ↳ ${keys.length} files`, 'log');
          });
        });
      });
    }
  }).catch(err => {
    addConsoleLog(`Error: ${err.message}`, 'error');
  });
}

// ============================================================
// 📡 UPDATE STATUS CHECKING
// ============================================================

function updateUpdateStatus() {
  const currentVersion = localStorage.getItem('sw-version') || 'v3.0';
  const latestVersion = localStorage.getItem('latest-version') || 'v3.0';
  
  const currentEl = document.getElementById('current-version');
  const latestEl = document.getElementById('latest-version');
  const statusTextEl = document.getElementById('update-status-text');
  const headerStatusEl = document.getElementById('header-status-text');
  const statusIcon = document.getElementById('status-icon');
  const expandIcon = document.getElementById('expand-icon');
  
  if (currentEl) currentEl.textContent = currentVersion;
  if (latestEl) latestEl.textContent = latestVersion;
  
  const isUpToDate = currentVersion === latestVersion;
  
  if (isUpToDate) {
    if (statusTextEl) {
      statusTextEl.textContent = '✅ Terbaru';
      statusTextEl.style.color = '#10b981';
    }
    if (statusIcon) statusIcon.textContent = '✅';
    if (headerStatusEl) headerStatusEl.textContent = 'Up to date';
  } else {
    if (statusTextEl) {
      statusTextEl.textContent = '🔄 Update Tersedia!';
      statusTextEl.style.color = '#f59e0b';
    }
    if (statusIcon) statusIcon.textContent = '🔄';
    if (headerStatusEl) headerStatusEl.textContent = 'Update available!';
  }
}

function checkForUpdates() {
  addConsoleLog('Checking for updates...', 'info');
  
  const lastCheckEl = document.getElementById('last-check-time');
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID');
  
  if (lastCheckEl) lastCheckEl.textContent = timeStr;
  localStorage.setItem('last-check-time', timeStr);
  
  // Check if there's a test version set
  const testVersion = localStorage.getItem('test-version');
  if (testVersion && testVersion !== (localStorage.getItem('sw-version') || 'v3.0')) {
    addConsoleLog(`✨ Update detected! ${testVersion} is available.`, 'success');
    localStorage.setItem('latest-version', testVersion);
    updateUpdateStatus();
    
    // Auto-show notification
    setTimeout(() => {
      showUpdateNotification();
    }, 500);
  } else {
    addConsoleLog('✅ Already on latest version', 'success');
    updateUpdateStatus();
  }
}

// Initialize SW version tracking
if (navigator.serviceWorker) {
  navigator.serviceWorker.ready.then(reg => {
    localStorage.setItem('sw-version', 'v3.0');
    localStorage.setItem('cache-name', 'toko-pwa-v3');
    console.log('✅ SW tracking initialized');
  });
}

// Initialize testing panel on page load
window.addEventListener('load', () => {
  try {
    addConsoleLog('Testing panel initialized', 'success');
    updateDebugInfo();
    updateUpdateStatus();
  } catch (e) {
    console.error('Error initializing testing panel:', e);
  }
});