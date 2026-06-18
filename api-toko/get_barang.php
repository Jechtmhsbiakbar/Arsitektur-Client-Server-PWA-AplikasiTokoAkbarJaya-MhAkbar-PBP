<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "koneksi.php";

/** @var mysqli $koneksi */
// get_barang.php tidak butuh auth (hanya baca data publik toko).
// Jika ingin diproteksi juga, uncomment dua baris di bawah:
// require_once "auth_helper.php";
// requireValidToken($koneksi, $_GET);

// ============================================================
// 🔍 PARAMETER PENCARIAN & PAGINATION
// ============================================================
$per_page = 5; // Jumlah data per halaman (sesuai modul)
$page = isset($_GET['page']) && is_numeric($_GET['page']) && $_GET['page'] > 0
    ? (int) $_GET['page']
    : 1;
$cari = isset($_GET['cari']) ? trim($_GET['cari']) : '';

// ============================================================
// 📊 HITUNG TOTAL DATA (untuk pagination)
// ============================================================
if ($cari !== '') {
    // Pakai prepared statement biar aman dari SQL Injection
    $stmt_count = mysqli_prepare($koneksi, "SELECT COUNT(*) as total FROM barang WHERE nama_barang LIKE ?");
    $like = "%$cari%";
    mysqli_stmt_bind_param($stmt_count, "s", $like);
    mysqli_stmt_execute($stmt_count);
    $res_count = mysqli_stmt_get_result($stmt_count);
    $total_data = (int) mysqli_fetch_assoc($res_count)['total'];
    mysqli_stmt_close($stmt_count);
} else {
    $res_count = mysqli_query($koneksi, "SELECT COUNT(*) as total FROM barang");
    $total_data = (int) mysqli_fetch_assoc($res_count)['total'];
}

// Hitung total halaman (minimal 1 halaman)
$total_halaman = $total_data > 0 ? (int) ceil($total_data / $per_page) : 1;
// ============================================================
// 💰 HITUNG TOTAL NILAI SEMUA BARANG
// ============================================================

if ($cari !== '') {

    $stmt_total = mysqli_prepare(
        $koneksi,
        "SELECT COALESCE(SUM(harga),0) AS total_harga
         FROM barang
         WHERE nama_barang LIKE ?"
    );

    mysqli_stmt_bind_param($stmt_total, "s", $like);
    mysqli_stmt_execute($stmt_total);

    $hasil_total = mysqli_stmt_get_result($stmt_total);
    $total_harga = (int) mysqli_fetch_assoc($hasil_total)['total_harga'];

    mysqli_stmt_close($stmt_total);

} else {

    $hasil_total = mysqli_query(
        $koneksi,
        "SELECT COALESCE(SUM(harga),0) AS total_harga FROM barang"
    );

    $total_harga = (int) mysqli_fetch_assoc($hasil_total)['total_harga'];
}
// Kalau user minta halaman yang gak ada, paksa ke halaman terakhir
if ($page > $total_halaman)
    $page = $total_halaman;

$offset = ($page - 1) * $per_page;

// ============================================================
// 📦 AMBIL DATA DENGAN LIMIT & OFFSET
// ============================================================
if ($cari !== '') {
    $stmt = mysqli_prepare(
        $koneksi,
        "SELECT id, nama_barang, harga, gambar 
         FROM barang 
         WHERE nama_barang LIKE ? 
         ORDER BY id ASC 
         LIMIT ? OFFSET ?"
    );
    $like = "%$cari%";
    mysqli_stmt_bind_param($stmt, "sii", $like, $per_page, $offset);
    mysqli_stmt_execute($stmt);
    $hasil = mysqli_stmt_get_result($stmt);
} else {
    $query = "SELECT id, nama_barang, harga, gambar 
              FROM barang 
              ORDER BY id ASC 
              LIMIT $per_page OFFSET $offset";
    $hasil = mysqli_query($koneksi, $query);
}

if (!$hasil) {
    http_response_code(500);
    die(json_encode([
        "status" => "error",
        "message" => "Query gagal: " . mysqli_error($koneksi)
    ]));
}

$data_barang = [];
while ($baris = mysqli_fetch_assoc($hasil)) {
    $data_barang[] = $baris;
}

// ============================================================
// 📤 RETURN JSON SESUAI SPESIFIKASI TUGAS
// ============================================================
echo json_encode([
    "status"           => "success",
    "message"          => "Berhasil mengambil data",
    "data"             => $data_barang,
    "total_halaman"    => $total_halaman,
    "halaman_saat_ini" => $page,
    "total_data"       => $total_data,
    "total_harga"      => $total_harga,
    "per_page"         => $per_page
]);
?>