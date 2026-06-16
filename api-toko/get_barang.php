<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "koneksi.php";
/** @var mysqli $koneksi */

// get_barang.php tidak butuh auth (hanya baca data publik toko).
// Jika ingin diproteksi juga, uncomment dua baris di bawah:
// require_once "auth_helper.php";
// requireValidToken($koneksi);

$query = "SELECT id, nama_barang, harga, gambar FROM barang ORDER BY id ASC";
$hasil = mysqli_query($koneksi, $query);

if (!$hasil) {
    http_response_code(500);
    die(json_encode([
        "status"  => "error",
        "message" => "Query gagal: " . mysqli_error($koneksi)
    ]));
}

$data_barang = [];
while ($baris = mysqli_fetch_assoc($hasil)) {
    $data_barang[] = $baris;
}

echo json_encode([
    "status"  => "success",
    "message" => "Berhasil mengambil data",
    "jumlah"  => count($data_barang),
    "data"    => $data_barang
]);
?>