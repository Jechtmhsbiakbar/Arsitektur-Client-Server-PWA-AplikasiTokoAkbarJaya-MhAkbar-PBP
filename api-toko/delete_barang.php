<?php
include "koneksi.php";
/** @var mysqli $koneksi */

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
