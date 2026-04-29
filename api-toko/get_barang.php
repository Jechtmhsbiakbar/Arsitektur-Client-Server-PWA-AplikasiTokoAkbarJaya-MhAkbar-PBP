<?php
require "koneksi.php";
/** @var mysqli $koneksi */

// Query ambil data
$query = "SELECT id, nama_barang, harga FROM barang";
$hasil = mysqli_query($koneksi, $query);

// Cek query
if (!$hasil) {
    die(json_encode([
        "status" => "error",
        "message" => "Query gagal: " . mysqli_error($koneksi)
    ]));
}

// Tampung data
$data_barang = [];

while ($baris = mysqli_fetch_assoc($hasil)) {
    $data_barang[] = $baris;
}

// Response
echo json_encode([
    "status" => "success",
    "message" => "Berhasil mengambil data",
    "jumlah" => count($data_barang),
    "data" => $data_barang
], JSON_PRETTY_PRINT);
?>