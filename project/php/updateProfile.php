<?php
    session_start();
    require_once "mysql.php";

    header('Content-Type: application/json');

    $user_id = $_SESSION['user_id'] ?? 0;

    if ($user_id === 0) {
        echo json_encode(["status" => "error", "message" => "Not logged in"]);
        exit;
    }

    $bio = $_POST['bio'] ?? '';

    $stmt = $conn->prepare("SELECT profilbild, cover_image FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $current = $stmt->get_result()->fetch_assoc();

    $profilbild = $current['profilbild'];
    $cover_image = $current['cover_image'];

    $allowed = ['jpg', 'jpeg', 'png', 'webp'];
    $maxSize = 5 * 1024 * 1024;
    $uploadDir = realpath(__DIR__ . '/../images') . '/';

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) {
            echo json_encode(["status" => "error", "message" => "Only image files are allowed"]);
            $conn->close();
            exit;
        }
        if ($_FILES['avatar']['size'] > $maxSize) {
            echo json_encode(["status" => "error", "message" => "Avatar exceeds the 5 MB limit"]);
            $conn->close();
            exit;
        }
        if (is_writable($uploadDir)) {
            $avatarName = uniqid('avatar_') . '.' . $ext;
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadDir . $avatarName)) {
                $profilbild = $avatarName;
            }
        }
    }

    if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
        $ext = strtolower(pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) {
            echo json_encode(["status" => "error", "message" => "Only image files are allowed"]);
            $conn->close();
            exit;
        }
        if ($_FILES['cover']['size'] > $maxSize) {
            echo json_encode(["status" => "error", "message" => "Cover exceeds the 5 MB limit"]);
            $conn->close();
            exit;
        }
        if (is_writable($uploadDir)) {
            $coverName = uniqid('cover_') . '.' . $ext;
            if (move_uploaded_file($_FILES['cover']['tmp_name'], $uploadDir . $coverName)) {
                $cover_image = $coverName;
            }
        }
    }

    $stmt2 = $conn->prepare("UPDATE users SET bio = ?, profilbild = ?, cover_image = ? WHERE id = ?");
    $stmt2->bind_param("sssi", $bio, $profilbild, $cover_image, $user_id);
    $stmt2->execute();

    $conn->close();

    echo json_encode([
        "status" => "success",
        "bio" => $bio,
        "profilbild" => $profilbild,
        "cover_image" => $cover_image
    ]);
?>
