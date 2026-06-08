<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight request dari browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "koneksi.php";
/** @var mysqli $koneksi */

// =================== BAGIAN PENGUNCI API ===================
// Menangkap Header Authorization yang dikirim Javascript
$headers = apache_request_headers();
$token_dikirim = isset($headers['Authorization']) ? $headers['Authorization'] : '';

// Cek apakah token dikirim, dan apakah token tersebut ada di tabel users
$cek_token = mysqli_query($koneksi, "SELECT * FROM users WHERE token='$token_dikirim'");

if(mysqli_num_rows($cek_token) === 0 || $token_dikirim === '') {
    // JIKA TOKEN PALSU / KOSONG, HENTIKAN PROGRAM DISINI! (die)
    http_response_code(401);
    die(json_encode(["status" => "error", "pesan" => "Akses Ditolak! Token Invalid."]));
}
// ===========================================================

// Ambil data dari Fetch API (method DELETE)
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Validasi input
if (!isset($data["id"])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "ID tidak ditemukan"
    ]);
    exit;
}

$id = (int)$data["id"];

// Query delete
$query = "DELETE FROM barang WHERE id = $id";
$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Barang berhasil dihapus",
        "id" => $id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal menghapus barang: " . mysqli_error($koneksi)
    ]);
}
?>
