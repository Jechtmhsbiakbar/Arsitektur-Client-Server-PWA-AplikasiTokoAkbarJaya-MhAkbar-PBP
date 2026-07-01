// ============================================================
// app-toko/cetak.js
// Logic untuk halaman cetak.html:
// 1. Ambil token dari localStorage (SISTEM LOGIN LAMA, tidak diubah)
// 2. Fetch data laporan dari api-toko/cetak_laporan.php
// 3. Format Rupiah pakai Intl.NumberFormat
// 4. Render tabel secara dinamis
// 5. Tampilkan tanggal cetak otomatis
// 6. window.print() otomatis setelah render selesai
// 7. window.onafterprint -> tutup tab otomatis
// ============================================================

// ── 1. AMBIL TOKEN DARI LOCALSTORAGE ────────────────────────
// Key "token_toko" HARUS SAMA dengan yang dipakai app.js,
// supaya halaman cetak tetap terhubung dengan sesi login yang sudah ada.
const tokenCetak = localStorage.getItem('token_toko');

// Jika tidak ada token, jangan lanjut fetch — tampilkan pesan & jangan print.
if (!tokenCetak) {
    document.getElementById('tabel-body').innerHTML =
        `<tr><td colspan="3" class="text-center py-6 text-red-600 border border-black">
            Sesi login tidak ditemukan. Silakan login ulang lalu coba cetak lagi.
        </td></tr>`;
    // Hentikan eksekusi lebih lanjut
    throw new Error('Token tidak ditemukan di localStorage.');
}

// ── FORMATTER RUPIAH (Intl.NumberFormat) ────────────────────
// style: 'currency' + currency: 'IDR' otomatis menambahkan
// prefix "Rp" dan pemisah ribuan sesuai locale Indonesia.
const formatRupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0   // Rupiah tidak pakai desimal
});

// ── 2. TAMPILKAN TANGGAL CETAK OTOMATIS ─────────────────────
function renderTanggalCetak() {
    const now = new Date();
    const opsi = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const teksTanggal = now.toLocaleDateString('id-ID', opsi);
    document.getElementById('tanggal-cetak').textContent = `Tanggal Cetak: ${teksTanggal}`;
}

// ── 3. RENDER TABEL BARANG KE DALAM DOM ─────────────────────
function renderTabel(dataBarang) {
    const tbody = document.getElementById('tabel-body');

    if (!dataBarang || dataBarang.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-gray-400 border border-black">
            Tidak ada data barang.
        </td></tr>`;
        return;
    }

    let baris = '';
    dataBarang.forEach((barang, index) => {
        baris += `
            <tr>
                <td class="border border-black py-1.5 px-3">${index + 1}</td>
                <td class="border border-black py-1.5 px-3">${barang.nama_barang}</td>
                <td class="border border-black py-1.5 px-3 text-right">${formatRupiah.format(barang.harga)}</td>
            </tr>`;
    });

    tbody.innerHTML = baris;
}

// ── 4. AMBIL DATA DARI API CETAK (dengan header X-Auth-Token) ─
async function muatLaporan() {
    try {
        // Path RELATIF: cetak.html & cetak.js ada di app-toko/,
        // endpoint ada satu tingkat di atas di api-toko/.
        // Ini bekerja sama baiknya di localhost XAMPP maupun
        // di InfinityFree, karena tidak menyebut domain/host sama sekali.
        const response = await fetch('../api-toko/cetak_laporan.php', {
            method: 'GET',
            headers: {
                'X-Auth-Token': tokenCetak
            }
        });

        // Kalau token invalid, auth_helper.php lama akan balas 401
        // dengan body JSON { status: "error", pesan: "..." }
        const json = await response.json();

        if (!response.ok || json.status !== 'success') {
            document.getElementById('tabel-body').innerHTML =
                `<tr><td colspan="3" class="text-center py-6 text-red-600 border border-black">
                    Gagal memuat data: ${json.pesan || json.message || 'Akses ditolak'}
                </td></tr>`;
            return; // JANGAN panggil print jika gagal
        }

        // ── Render seluruh bagian dokumen ──
        renderTabel(json.data);
        document.getElementById('jumlah-item').textContent = `${json.jumlah_item} item`;
        document.getElementById('total-aset').textContent  = formatRupiah.format(json.total_harga);
        renderTanggalCetak();

        // ── 5. AUTO PRINT SETELAH LAYOUT SELESAI DIRENDER ──
        // Diberi jeda (setTimeout) supaya browser sempat repaint
        // tabel & elemen baru sebelum dialog print muncul.
        // Tanpa jeda, kadang dialog print terbuka saat tabel masih kosong.
        setTimeout(() => {
            window.print();
        }, 400);

    } catch (error) {
        console.error('❌ Gagal memuat laporan:', error);
        document.getElementById('tabel-body').innerHTML =
            `<tr><td colspan="3" class="text-center py-6 text-red-600 border border-black">
                Terjadi kesalahan koneksi ke server.
            </td></tr>`;
    }
}

// ── 6. TUTUP TAB OTOMATIS SETELAH PROSES PRINT SELESAI ──────
// onafterprint terpanggil baik user klik "Print" ATAUPUN "Cancel"
// pada dialog print, jadi tab akan tertutup di kedua kasus.
window.onafterprint = function () {
    window.close();
};

// ── JALANKAN SAAT HALAMAN SIAP ───────────────────────────────
document.addEventListener('DOMContentLoaded', muatLaporan);