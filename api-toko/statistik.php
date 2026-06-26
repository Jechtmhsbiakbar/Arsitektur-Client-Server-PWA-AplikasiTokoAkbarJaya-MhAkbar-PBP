<?php
// ============================================================
// api-toko/statistik.php
// Endpoint Dashboard Statistik — Top 5 Barang Termahal
// Kompatibel: Localhost XAMPP & InfinityFree
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "koneksi.php";
/** @var mysqli $koneksi */

// ── Ambil Top 5 Barang Termahal ─────────────────────────────
$query = "SELECT nama_barang, harga FROM barang ORDER BY harga DESC LIMIT 5";
$hasil = mysqli_query($koneksi, $query);

if (!$hasil) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Query gagal: " . mysqli_error($koneksi)
    ]);
    exit;
}

$labels = [];
$values = [];

while ($row = mysqli_fetch_assoc($hasil)) {
    $labels[] = $row['nama_barang'];
    $values[] = (int) $row['harga']; // Cast ke integer, wajib sesuai ketentuan modul
}

// ── Response JSON sesuai spesifikasi tugas ──────────────────
echo json_encode([
    "status"     => "success",
    "chart_data" => [
        "labels" => $labels,
        "values" => $values
    ]
]);
?>