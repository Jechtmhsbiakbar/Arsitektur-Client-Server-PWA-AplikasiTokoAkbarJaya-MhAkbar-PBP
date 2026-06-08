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
if (!isset($data["id"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
    exit;
}

$id = (int) $data["id"];

if ($id < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
    exit;
}

// ── Delete ──────────────────────────────────────────────────
$hasil = mysqli_query($koneksi, "DELETE FROM barang WHERE id=$id");

if ($hasil) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Barang berhasil dihapus", "id" => $id]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal: " . mysqli_error($koneksi)]);
}
?>