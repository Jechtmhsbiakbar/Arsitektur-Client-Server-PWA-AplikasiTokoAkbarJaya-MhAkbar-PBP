<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request dari browser
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include "koneksi.php";
/** @var mysqli $koneksi */

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// Validasi input
if(!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "pesan" => "Username dan Password harus diisi"
    ]);
    exit;
}

$username = mysqli_real_escape_string($koneksi, $data['username']);
$password = mysqli_real_escape_string($koneksi, $data['password']);

// Cek user di database
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($koneksi, $query);

// Error handling untuk query
if (!$result) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "pesan" => "Query error: " . mysqli_error($koneksi)
    ]);
    exit;
}

// Jika user ditemukan
if(mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    
    // 1. GENERATE TOKEN ACAK (Kombinasi waktu & angka random)
    $token = md5(uniqid(rand(), true));
    $user_id = $user['id'];

    // 2. Simpan token ini ke database user tersebut
    $update_query = "UPDATE users SET token='$token' WHERE id='$user_id'";
    $update_result = mysqli_query($koneksi, $update_query);
    
    if(!$update_result) {
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "pesan" => "Gagal update token: " . mysqli_error($koneksi)
        ]);
        exit;
    }

    // 3. Kembalikan token ke Frontend PWA
    http_response_code(200);
    echo json_encode([
        "status" => "success", 
        "pesan" => "Login Berhasil", 
        "token" => $token
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error", 
        "pesan" => "Username atau Password Salah!"
    ]);
}
?>