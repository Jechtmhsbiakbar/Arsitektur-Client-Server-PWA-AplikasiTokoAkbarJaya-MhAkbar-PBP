<?php
include "koneksi.php";
/** @var mysqli $koneksi */

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Validasi input
if (!isset($data["id"]) || !isset($data["nama_barang"]) || !isset($data["harga"])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Field tidak lengkap"
    ]);
    exit;
}

$id = (int)$data["id"];
$nama_barang = mysqli_real_escape_string($koneksi, $data["nama_barang"]);
$harga = (int)$data["harga"];

// Query update
$query = "UPDATE barang SET nama_barang = '$nama_barang', harga = $harga WHERE id = $id";
$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Barang berhasil diperbarui",
        "data" => [
            "id" => $id,
            "nama_barang" => $nama_barang,
            "harga" => $harga
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal memperbarui barang: " . mysqli_error($koneksi)
    ]);
}
?>
