<?php
header('Content-Type: application/json; charset=utf-8');

// koneksi untuk localhost xampp
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_toko";

// Koneksi untuk hosting infinityfree
// $host = "sql104.infinityfree.com";
// $user = "if0_41724973";
// $pass = "WxMJqItMYH";
// $db   = "if0_41724973_db_toko";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die(json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal: " . mysqli_connect_error()
    ]));
}
?>