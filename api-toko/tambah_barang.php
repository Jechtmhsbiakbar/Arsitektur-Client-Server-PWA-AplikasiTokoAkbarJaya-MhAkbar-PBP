<?php
include "koneksi.php";
/** @var mysqli $koneksi */

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Validasi input
if (!isset($data["nama_barang"]) || !isset($data["harga"])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Field tidak lengkap"
    ]);
    exit;
}

$nama_barang = mysqli_real_escape_string($koneksi, $data["nama_barang"]);
$harga = (int)$data["harga"];

// Query insert
$query = "INSERT INTO barang (nama_barang, harga) VALUES ('$nama_barang', $harga)";
$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Barang berhasil ditambahkan",
        "data" => [
            "id" => mysqli_insert_id($koneksi),
            "nama_barang" => $nama_barang,
            "harga" => $harga
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal menambahkan barang: " . mysqli_error($koneksi)
    ]);
}
?>