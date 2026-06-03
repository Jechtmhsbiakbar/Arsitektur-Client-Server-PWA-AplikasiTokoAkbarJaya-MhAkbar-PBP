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
// koneksi untuk localhost xampp
// $host = "localhost";
// $user = "root";
// $pass = "";
// $db   = "db_toko";

// Koneksi untuk hosting infinityfree 
$host = "sql101.infinityfree.com";
$user = "if0_41799381";
$pass = "2B9LgM34ErW";
$db   = "if0_41799381_db_toko";

// Koneksi ke database
$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die(json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal: " . mysqli_connect_error()
    ]));
}
?>