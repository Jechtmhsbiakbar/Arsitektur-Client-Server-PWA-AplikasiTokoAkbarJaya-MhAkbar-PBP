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

// ── Ambil data dari $_POST (bukan JSON, karena pakai FormData) ──
// Saat menggunakan FormData di JavaScript, data dikirim sebagai
// multipart/form-data, bukan application/json.
// Jadi kita baca dari $_POST dan $_FILES, bukan php://input.

$data = $_POST; // Berisi: token, nama_barang, harga

requireValidToken($koneksi, $data);

// ── Validasi input teks ─────────────────────────────────────
if (!isset($data["nama_barang"]) || !isset($data["harga"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Field nama_barang dan harga wajib diisi"]);
    exit;
}

$nama_barang = mysqli_real_escape_string($koneksi, trim($data["nama_barang"]));
$harga       = (int) $data["harga"];

if ($nama_barang === '' || $harga < 1) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nama tidak boleh kosong dan harga harus lebih dari 0"]);
    exit;
}

// ── Proses Upload Gambar ────────────────────────────────────
$nama_file_gambar = null; // Default: null (tidak ada gambar)

// Cek apakah ada file gambar yang dikirim
if (isset($_FILES["gambar"]) && $_FILES["gambar"]["error"] === UPLOAD_ERR_OK) {

    // Ambil info file
    $file_tmp  = $_FILES["gambar"]["tmp_name"]; // Path sementara di server
    $file_name = $_FILES["gambar"]["name"];      // Nama asli file
    $file_size = $_FILES["gambar"]["size"];      // Ukuran file (bytes)
    $file_type = $_FILES["gambar"]["type"];      // MIME type, misal: image/jpeg

    // Validasi: hanya izinkan tipe gambar
    $allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!in_array($file_type, $allowed_types)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Tipe file tidak valid. Hanya JPG, PNG, GIF, atau WEBP yang diizinkan."]);
        exit;
    }

    // Validasi: batasi ukuran maksimal 2MB
    $max_size = 2 * 1024 * 1024; // 2 MB dalam bytes
    if ($file_size > $max_size) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Ukuran file terlalu besar. Maksimal 2MB."]);
        exit;
    }

    // Buat nama file unik supaya tidak bentrok dengan file lain
    // Format: timestamp_namaasli.ext → misal: 1718123456_beras.jpg
    $ekstensi        = pathinfo($file_name, PATHINFO_EXTENSION); // ambil ekstensi: jpg, png, dsb
    $nama_file_unik  = time() . "_" . preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file_name, PATHINFO_FILENAME)) . "." . $ekstensi;

    // Tentukan folder tujuan upload
    // __DIR__ = folder tempat file ini berada (api-toko/)
    $folder_upload = __DIR__ . "/uploads/";

    // Buat folder jika belum ada
    if (!is_dir($folder_upload)) {
        mkdir($folder_upload, 0755, true);
    }

    $path_tujuan = $folder_upload . $nama_file_unik;

    // Pindahkan file dari folder sementara ke folder uploads
    if (move_uploaded_file($file_tmp, $path_tujuan)) {
        $nama_file_gambar = $nama_file_unik; // Simpan nama file ke database
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal memindahkan file gambar ke folder uploads."]);
        exit;
    }
}

// ── Insert ke Database ──────────────────────────────────────
// Jika ada gambar, simpan nama filenya. Jika tidak ada, simpan NULL.
if ($nama_file_gambar !== null) {
    $nama_file_escaped = mysqli_real_escape_string($koneksi, $nama_file_gambar);
    $query = "INSERT INTO barang (nama_barang, harga, gambar) VALUES ('$nama_barang', $harga, '$nama_file_escaped')";
} else {
    $query = "INSERT INTO barang (nama_barang, harga, gambar) VALUES ('$nama_barang', $harga, NULL)";
}

$hasil = mysqli_query($koneksi, $query);

if ($hasil) {
    $new_id = (int) mysqli_insert_id($koneksi);
    http_response_code(201);
    echo json_encode([
        "status"  => "success",
        "message" => "Barang berhasil ditambahkan",
        "data"    => [
            "id"          => $new_id,
            "nama_barang" => $nama_barang,
            "harga"       => $harga,
            "gambar"      => $nama_file_gambar // bisa null jika tidak ada gambar
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . mysqli_error($koneksi)]);
}
?>