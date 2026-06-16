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

// ── PENTING: Sekarang baca dari $_POST bukan php://input ──
// Karena JavaScript mengirim FormData (bukan JSON),
// supaya bisa sekalian membawa file gambar lewat $_FILES.
$data = $_POST;

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

// ── Proses Upload Gambar (jika ada file baru yang dikirim) ──
$nama_file_gambar = null; // null = tidak ada gambar baru

if (isset($_FILES["gambar"]) && $_FILES["gambar"]["error"] === UPLOAD_ERR_OK) {

    $file_tmp  = $_FILES["gambar"]["tmp_name"];
    $file_name = $_FILES["gambar"]["name"];
    $file_size = $_FILES["gambar"]["size"];
    $file_type = $_FILES["gambar"]["type"];

    // Validasi tipe file
    $allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!in_array($file_type, $allowed_types)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Tipe file tidak valid. Hanya JPG, PNG, GIF, atau WEBP."]);
        exit;
    }

    // Validasi ukuran maksimal 2MB
    $max_size = 2 * 1024 * 1024;
    if ($file_size > $max_size) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Ukuran file terlalu besar. Maksimal 2MB."]);
        exit;
    }

    // Buat nama file unik
    $ekstensi       = pathinfo($file_name, PATHINFO_EXTENSION);
    $nama_file_unik = time() . "_" . preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file_name, PATHINFO_FILENAME)) . "." . $ekstensi;

    $folder_upload = __DIR__ . "/uploads/";

    if (!is_dir($folder_upload)) {
        mkdir($folder_upload, 0755, true);
    }

    $path_tujuan = $folder_upload . $nama_file_unik;

    if (move_uploaded_file($file_tmp, $path_tujuan)) {
        $nama_file_gambar = $nama_file_unik;
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal memindahkan file ke folder uploads."]);
        exit;
    }
}

// ── Query UPDATE ────────────────────────────────────────────
// Jika ada gambar baru → update nama+harga+gambar
// Jika tidak ada gambar baru → update nama+harga saja (gambar lama tetap)
if ($nama_file_gambar !== null) {
    $nama_file_escaped = mysqli_real_escape_string($koneksi, $nama_file_gambar);
    $query = "UPDATE barang SET nama_barang='$nama_barang', harga=$harga, gambar='$nama_file_escaped' WHERE id=$id";
} else {
    $query = "UPDATE barang SET nama_barang='$nama_barang', harga=$harga WHERE id=$id";
}

$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
    // Ambil data terbaru dari database (termasuk gambar lama jika tidak diganti)
    $row = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT id, nama_barang, harga, gambar FROM barang WHERE id=$id"));

    http_response_code(200);
    echo json_encode([
        "status"  => "success",
        "message" => "Barang berhasil diperbarui",
        "data"    => $row
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal: " . mysqli_error($koneksi)]);
}
?>