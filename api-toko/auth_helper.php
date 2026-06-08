<?php
// ============================================================
// auth_helper.php — Validasi token dari request body JSON.
// Cara ini bekerja di semua hosting termasuk InfinityFree
// karena tidak bergantung pada HTTP Authorization header
// yang sering diblokir shared hosting.
// ============================================================

/**
 * Ambil dan validasi token dari body JSON request.
 * Panggil SEBELUM membaca $data di endpoint manapun.
 *
 * @param mysqli $koneksi
 * @param array  $data    Array hasil json_decode dari php://input
 */
function requireValidToken(mysqli $koneksi, array $data): void {
    $token = isset($data['token']) ? trim($data['token']) : '';

    if ($token === '') {
        http_response_code(401);
        die(json_encode([
            "status" => "error",
            "pesan"  => "Akses Ditolak! Token tidak ditemukan."
        ]));
    }

    $stmt = mysqli_prepare($koneksi, "SELECT id FROM users WHERE token = ? LIMIT 1");
    mysqli_stmt_bind_param($stmt, "s", $token);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) === 0) {
        mysqli_stmt_close($stmt);
        http_response_code(401);
        die(json_encode([
            "status" => "error",
            "pesan"  => "Akses Ditolak! Token invalid."
        ]));
    }

    mysqli_stmt_close($stmt);
}
?>