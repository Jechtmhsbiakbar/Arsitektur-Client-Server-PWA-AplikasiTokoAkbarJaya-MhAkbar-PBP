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

// ── Pastikan koneksi database benar-benar ada & valid ───────
// (kalau variabel di koneksi.php namanya bukan $koneksi, ini akan
//  langsung ketahuan lewat pesan error yang jelas, bukan blank page)
if (!isset($koneksi) || !($koneksi instanceof mysqli)) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Variabel koneksi database (\$koneksi) tidak ditemukan. " .
                      "Cek nama variabel mysqli di koneksi.php."
    ]);
    exit;
}

if (mysqli_connect_errno()) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Koneksi database gagal: " . mysqli_connect_error()
    ]);
    exit;
}

// Pastikan encoding UTF-8 supaya nama barang dengan karakter khusus
// tidak membuat json_encode() gagal dan mengembalikan output kosong
mysqli_set_charset($koneksi, "utf8mb4");

// ── Ambil Top 5 Barang Termahal ─────────────────────────────
$query = "SELECT nama_barang, harga FROM barang ORDER BY (harga + 0) DESC LIMIT 5";
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

    // Bersihkan harga dari format non-numerik (mis. "Rp 15.000") sebelum
    // di-cast ke integer, supaya tidak jadi 0 kalau kolom disimpan sebagai string berformat
    $hargaBersih = preg_replace('/[^0-9]/', '', (string) $row['harga']);
    $values[] = $hargaBersih === '' ? 0 : (int) $hargaBersih;
}

// ── Response JSON sesuai spesifikasi tugas ──────────────────
$json = json_encode([
    "status"     => "success",
    "chart_data" => [
        "labels" => $labels,
        "values" => $values
    ]
], JSON_UNESCAPED_UNICODE);

// Kalau json_encode gagal (mis. karena encoding aneh), jangan kirim body kosong
if ($json === false) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Gagal encode JSON: " . json_last_error_msg()
    ]);
    exit;
}

echo $json;
?>