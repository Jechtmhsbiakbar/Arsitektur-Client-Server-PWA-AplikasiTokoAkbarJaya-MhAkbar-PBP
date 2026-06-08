<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "koneksi.php";
/** @var mysqli $koneksi */
require_once "auth_helper.php";

// Baca body sekali, pakai untuk auth + data
$data = json_decode(file_get_contents("php://input"), true);

requireValidToken($koneksi, $data);

// ── Validasi input ──────────────────────────────────────────
if (!isset($data["nama_barang"]) || !isset($data["harga"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Field tidak lengkap"]);
    exit;
}

$nama_barang = mysqli_real_escape_string($koneksi, trim($data["nama_barang"]));
$harga       = (int) $data["harga"];

if ($nama_barang === '' || $harga < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nama tidak boleh kosong dan harga harus > 0"]);
    exit;
}

// ── Insert ──────────────────────────────────────────────────
$hasil = mysqli_query($koneksi, "INSERT INTO barang (nama_barang, harga) VALUES ('$nama_barang', $harga)");

if ($hasil) {
    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "Barang berhasil ditambahkan",
        "data"    => ["id" => (int) mysqli_insert_id($koneksi), "nama_barang" => $nama_barang, "harga" => $harga]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal: " . mysqli_error($koneksi)]);
}
?>