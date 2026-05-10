// ============================================================
// 🛒 DATA FETCHING & STATE MANAGEMENT
// ============================================================
let allBarangData = []; // Store semua data untuk search
let editMode = false; // Tracking apakah mode edit atau tambah
let editingBarangId = null; // Menyimpan ID data yang sedang diedit

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
  const tbody = document.getElementById("isi-tabel");
  let baris = "";

  if (dataToRender.length === 0) {
    baris = `<tr><td colspan="5" class="text-center text-muted py-4">Tidak ada barang ditemukan</td></tr>`;
  } else {
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
  }
  tbody.innerHTML = baris;
}

function loadDataBarang() {
  console.log("🔄 Loading data barang...");
  
  fetch("api-toko/get_barang.php")
    .then((response) => {
      console.log("✅ Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseObject) => {
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
  fetch("api-toko/delete_barang.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: id })
  })
  .then((response) => {
    console.log("✅ Delete response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((result) => {
    console.log("✅ Delete result:", result);
    
    if (result.status === "success") {
      showAlert("✅ Berhasil!", "Data barang telah dihapus", "success");
      
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

// ============================================================
// 🛠️ SERVICE WORKER REGISTRATION
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then((reg) => console.log("✅ SW Terdaftar:", reg.scope))
      .catch((err) => console.error("❌ SW Gagal:", err));
  });
}

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
function hideOverlay() {
  if (overlay) overlay.style.display = "none";
  if (banner && !checkInstallation()) {
    banner.style.display = "block"; // Munculkan tombol kecil di bawah
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