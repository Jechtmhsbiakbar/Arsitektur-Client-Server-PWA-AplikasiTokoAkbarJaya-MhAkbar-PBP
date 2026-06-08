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

// ── Ambil & validasi input ──────────────────────────────────
$json_data = file_get_contents("php://input");
$data      = json_decode($json_data, true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "pesan"  => "Username dan Password harus diisi"
    ]);
    exit;
}

$username = mysqli_real_escape_string($koneksi, $data['username']);
$password = mysqli_real_escape_string($koneksi, $data['password']);

// ── Cek user ────────────────────────────────────────────────
$query  = "SELECT * FROM users WHERE username='$username' AND password='$password' LIMIT 1";
$result = mysqli_query($koneksi, $query);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "pesan"  => "Query error: " . mysqli_error($koneksi)
    ]);
    exit;
}

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);

    // Generate token acak
    $token   = md5(uniqid(rand(), true));
    $user_id = (int) $user['id'];

    // Simpan token ke database
    $update_query  = "UPDATE users SET token='$token' WHERE id=$user_id";
    $update_result = mysqli_query($koneksi, $update_query);

    if (!$update_result) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "pesan"  => "Gagal update token: " . mysqli_error($koneksi)
        ]);
        exit;
    }

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "pesan"  => "Login Berhasil",
        "token"  => $token
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "pesan"  => "Username atau Password Salah!"
    ]);
}
?>