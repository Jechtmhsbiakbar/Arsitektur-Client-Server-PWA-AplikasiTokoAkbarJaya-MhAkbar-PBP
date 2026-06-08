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

$data = json_decode(file_get_contents("php://input"), true);

requireValidToken($koneksi, $data);

// ── Validasi input ──────────────────────────────────────────
if (!isset($data["id"]) || !isset($data["nama_barang"]) || !isset($data["harga"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Field tidak lengkap"]);
    exit;
}

$id          = (int) $data["id"];
$nama_barang = mysqli_real_escape_string($koneksi, trim($data["nama_barang"]));
$harga       = (int) $data["harga"];

if ($id < 1 || $nama_barang === '' || $harga < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID, nama, dan harga harus valid"]);
    exit;
}

// ── Update ──────────────────────────────────────────────────
$hasil = mysqli_query($koneksi, "UPDATE barang SET nama_barang='$nama_barang', harga=$harga WHERE id=$id");

if ($hasil) {
    http_response_code(200);
    echo json_encode([
        "status"  => "success",
        "message" => "Barang berhasil diperbarui",
        "data"    => ["id" => $id, "nama_barang" => $nama_barang, "harga" => $harga]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal: " . mysqli_error($koneksi)]);
}
?>