// ============================================================
// 🛒 DATA FETCHING
// ============================================================
let allBarangData = []; // Store semua data untuk search

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
    baris = `<tr><td colspan="3" class="text-center text-muted py-4">Tidak ada barang ditemukan</td></tr>`;
  } else {
    dataToRender.forEach((barang) => {
      baris += `
        <tr>
            <td class="ps-4 fw-bold text-muted">${barang.id}</td>
            <td class="fw-semibold">${barang.nama_barang}</td>
            <td class="price-tag">Rp ${parseInt(barang.harga).toLocaleString("id-ID")}</td>
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
      tbody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Gagal memuat data: ${error.message}</td></tr>`;
    });
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
// 📲 LOGIKA PWA (OVERLAY & BANNER)
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