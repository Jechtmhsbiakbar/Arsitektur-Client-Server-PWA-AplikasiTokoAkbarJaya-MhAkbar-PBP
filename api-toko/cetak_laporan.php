<?php
// ============================================================
// api-toko/cetak_laporan.php
// Endpoint khusus untuk fitur "Ekspor PDF / Cetak Laporan"
// - Mengambil SELURUH data barang (tanpa LIMIT/pagination)
// - Diurutkan ASC berdasarkan nama_barang
// - Menghitung total harga aset & jumlah item
// - WAJIB token valid (memakai ulang auth_helper.php lama,
//   TIDAK membuat sistem token baru)
// Kompatibel: XAMPP localhost & InfinityFree hosting
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
// X-Auth-Token wajib diizinkan di sini karena halaman cetak
// mengirim token lewat custom header, bukan body JSON.
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token');

// Preflight request dari browser (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "koneksi.php";
/** @var mysqli $koneksi */
require_once "auth_helper.php";

// ── AMBIL TOKEN DARI HEADER X-Auth-Token ────────────────────
// Endpoint ini dipanggil dengan GET (fetch biasa dari cetak.js),
// jadi tidak ada JSON body seperti endpoint login/delete lama.
// PHP menerima header "X-Auth-Token" sebagai $_SERVER['HTTP_X_AUTH_TOKEN'].
$token = isset($_SERVER['HTTP_X_AUTH_TOKEN'])
    ? trim($_SERVER['HTTP_X_AUTH_TOKEN'])
    : '';

// ── VALIDASI TOKEN MEMAKAI MIDDLEWARE LAMA ──────────────────
// requireValidToken() aslinya dirancang membaca token dari
// array $data (biasanya hasil json_decode body). Di sini kita
// TIDAK mengubah fungsi tersebut — kita hanya "membungkus"
// token dari header ke dalam array agar bisa dipakai ulang.
// Jika token kosong atau tidak valid, fungsi ini otomatis
// menghentikan eksekusi (die) dengan pesan JSON yang sesuai.
requireValidToken($koneksi, ['token' => $token]);

// ── AMBIL SELURUH DATA BARANG (TANPA LIMIT) ─────────────────
// Diurutkan ASC berdasarkan nama_barang sesuai permintaan tugas.
$query = "SELECT id, nama_barang, harga, gambar
          FROM barang
          ORDER BY nama_barang ASC";

$hasil = mysqli_query($koneksi, $query);

if (!$hasil) {
    http_response_code(500);
    die(json_encode([
        "status"  => "error",
        "message" => "Query gagal: " . mysqli_error($koneksi)
    ]));
}

// ── HITUNG TOTAL ASET & JUMLAH ITEM SEKALIGUS SAAT LOOPING ──
$data_barang = [];
$total_harga = 0;
$jumlah_item = 0;

while ($baris = mysqli_fetch_assoc($hasil)) {
    $baris['harga'] = (int) $baris['harga']; // pastikan numeric, bukan string
    $total_harga   += $baris['harga'];
    $jumlah_item++;
    $data_barang[]  = $baris;
}

// ── RESPONSE JSON UNTUK cetak.js ─────────────────────────────
echo json_encode([
    "status"       => "success",
    "message"      => "Data laporan berhasil diambil",
    "data"         => $data_barang,
    "jumlah_item"  => $jumlah_item,
    "total_harga"  => $total_harga
]);
?>