<?php

session_start();
require_once "mysql.php";

$user_id = $_SESSION['user_id'];
$city_id = $_POST['city_id'] ?? 0;
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$tags = $_POST['tags'] ?? [];

if (empty($title) || empty($city_id) || !isset($_FILES['photo'])) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$file = $_FILES['photo'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($ext, $allowed)) {
    echo json_encode(["status" => "error", "message" => "Invalid file type"]);
    exit;
}

$filename = uniqid('photo_') . '.' . $ext;
$uploadPath = '../images/' . $filename;

$exifData = null;
if (function_exists('exif_read_data') && in_array($ext, ['jpg', 'jpeg'])) {
    $exif = @exif_read_data($file['tmp_name']);
    if ($exif) {
        $exifData = json_encode([
            'camera' => $exif['Make'] ?? '' . ' ' . ($exif['Model'] ?? ''),
            'focal_length' => $exif['FocalLength'] ?? '',
            'aperture' => $exif['COMPUTED']['ApertureFNumber'] ?? '',
            'shutter_speed' => $exif['ExposureTime'] ?? '',
            'iso' => $exif['ISOSpeedRatings'] ?? '',
            'mode' => '',
            'white_balance' => $exif['WhiteBalance'] ?? ''
        ]);
    }
}

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {

    $stmt = $conn->prepare("INSERT INTO photos (user_id, city_id, title, description, image_path, exif_data) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissss", $user_id, $city_id, $title, $description, $filename, $exifData);
    $stmt->execute();

    $photo_id = $conn->insert_id;

    if (!empty($tags)) {
        foreach ($tags as $tag_id) {
            $stmt2 = $conn->prepare("INSERT INTO photo_tags (photo_id, tag_id) VALUES (?, ?)");
            $stmt2->bind_param("ii", $photo_id, $tag_id);
            $stmt2->execute();
        }
    }

    $conn->close();
    echo json_encode(["status" => "success", "photo_id" => $photo_id]);

} else {
    echo json_encode(["status" => "error", "message" => "Upload failed"]);
}

?>