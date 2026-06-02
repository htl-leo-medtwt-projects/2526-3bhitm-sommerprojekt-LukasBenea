<?php
    session_start();
    require_once "mysql.php";

    header('Content-Type: application/json');

    $user_id = $_SESSION['user_id'] ?? 0;

    if ($user_id === 0) {
        echo json_encode(["status" => "error", "message" => "Not logged in"]);
        exit;
    }

    $city_id = $_POST['city_id'] ?? 0;
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $tags = $_POST['tags'] ?? [];
    $newTag = $_POST['new_tag'] ?? '';

    if (empty($title) || empty($city_id) || !isset($_FILES['photo'])) {
        echo json_encode(["status" => "error", "message" => "Missing data"]);
        exit;
    }

    $file = $_FILES['photo'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["status" => "error", "message" => "File error: " . $file['error']]);
        exit;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp'];

    if (!in_array($ext, $allowed)) {
        echo json_encode(["status" => "error", "message" => "Invalid file type"]);
        exit;
    }

    $filename = uniqid('photo_') . '.' . $ext;
    $uploadDir = realpath(__DIR__ . '/../images') . '/';
    $uploadPath = $uploadDir . $filename;

    if (!is_writable($uploadDir)) {
        echo json_encode(["status" => "error", "message" => "Directory not writable"]);
        exit;
    }

    $exifData = null;
    if (function_exists('exif_read_data') && in_array($ext, ['jpg', 'jpeg'])) {
        $exif = @exif_read_data($file['tmp_name']);
        if ($exif) {
            $camera = trim(($exif['Make'] ?? '') . ' ' . ($exif['Model'] ?? ''));
            $exifData = json_encode([
                'camera' => $camera ?: '',
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

        if (!empty($newTag)) {
            $stmtTag = $conn->prepare("INSERT IGNORE INTO tags (name) VALUES (?)");
            $stmtTag->bind_param("s", $newTag);
            $stmtTag->execute();
            $new_tag_id = $conn->insert_id;

            if ($new_tag_id > 0) {
                $tags[] = $new_tag_id;
            } else {
                $stmtFind = $conn->prepare("SELECT id FROM tags WHERE name = ?");
                $stmtFind->bind_param("s", $newTag);
                $stmtFind->execute();
                $tagRow = $stmtFind->get_result()->fetch_assoc();
                if ($tagRow) {
                    $tags[] = $tagRow['id'];
                }
            }
        }

        foreach ($tags as $tag_id) {
            $tag_id = intval($tag_id);
            if ($tag_id > 0) {
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
