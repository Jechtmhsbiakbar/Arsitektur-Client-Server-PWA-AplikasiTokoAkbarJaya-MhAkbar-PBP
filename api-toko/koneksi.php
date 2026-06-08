<?php
// ============================================================
// koneksi.php — Hanya koneksi database, TANPA header HTTP.
// Header HTTP diatur masing-masing di file endpoint.
// ============================================================

// Koneksi untuk localhost XAMPP
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_toko";

// Koneksi untuk hosting InfinityFree (uncomment jika deploy)
// $host = "sql101.infinityfree.com";
// $user = "if0_41799381";
// $pass = "2B9LgM34ErW";
// $db   = "if0_41799381_db_toko";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    http_response_code(500);
    die(json_encode([
        "status"  => "error",
        "message" => "Koneksi database gagal: " . mysqli_connect_error()
    ]));
}
?>