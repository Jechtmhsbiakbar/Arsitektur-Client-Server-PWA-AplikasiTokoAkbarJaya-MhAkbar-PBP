fetch("../api-toko/get_barang.php")
  .then((response) => response.json())
  .then((responseObject) => {
    const dataBarang = responseObject.data;

    const tbody = document.getElementById("isi-tabel");
    let baris = "";

    dataBarang.forEach((barang, index) => {
      baris += `
        <tr>
            <td class="ps-4 fw-bold text-muted">${index + 1}</td>
            <td class="fw-semibold">${barang.nama_barang}</td>
            <td class="price-tag">Rp ${parseInt(barang.harga).toLocaleString("id-ID")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary btn-action">Detail</button>
            </td>
        </tr>`;
    });

    tbody.innerHTML = baris;
  })
  .catch((error) => {
    console.error("Gagal memuat data:", error);
  });

// ============================================================
// ✅ PWA: Registrasi Service Worker
// ============================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("✅ Service Worker Berhasil Didaftarkan!", registration.scope);
      })
      .catch((err) => {
        console.error("❌ Service Worker Gagal:", err);
      });
  });
}

// ============================================================
// ✅ PWA: Tangkap event Install Prompt (tombol install)
// ============================================================
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Tahan dulu prompt bawaan browser
  e.preventDefault();
  deferredPrompt = e;

  // Tampilkan banner install custom
  const banner = document.getElementById("pwa-banner");
  if (banner) {
    banner.style.display = "block";
  }

  console.log("📲 App siap diinstall sebagai PWA!");
});

// Fungsi dipanggil saat tombol banner diklik
function installPWA() {
  if (!deferredPrompt) return;

  // Tampilkan dialog install bawaan browser
  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("✅ Pengguna menyetujui instalasi PWA");
    } else {
      console.log("❌ Pengguna menolak instalasi PWA");
    }
    deferredPrompt = null;

    // Sembunyikan banner setelah prompt
    const banner = document.getElementById("pwa-banner");
    if (banner) banner.style.display = "none";
  });
}

// Saat app sudah terinstall
window.addEventListener("appinstalled", () => {
  console.log("🎉 Aplikasi Toko berhasil diinstall!");
  const banner = document.getElementById("pwa-banner");
  if (banner) banner.style.display = "none";
});