<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'] ?? 0;
    $collection_id = $_GET['collection_id'] ?? 0;

    $stmt = $conn->prepare("SELECT name FROM collections WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $collection_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $collection = $result->fetch_assoc();

    if (!$collection) {
        $conn->close();
        echo json_encode(["name" => "", "photos" => []]);
        exit;
    }

    $stmt2 = $conn->prepare("SELECT photos.*, cities.name AS city_name, users.username AS photographer, users.profilbild AS photographer_avatar, (SELECT GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') FROM photo_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.photo_id = photos.id) AS tags, EXISTS(SELECT 1 FROM likes WHERE likes.photo_id = photos.id AND likes.user_id = ?) AS is_liked FROM photos JOIN collection_photos ON photos.id = collection_photos.photo_id LEFT JOIN cities ON photos.city_id = cities.id LEFT JOIN users ON photos.user_id = users.id WHERE collection_photos.collection_id = ?");
    $stmt2->bind_param("ii", $user_id, $collection_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $photos = mysqli_fetch_all($result2, MYSQLI_ASSOC);

    $conn->close();

    echo json_encode(["name" => $collection['name'], "photos" => $photos]);
?>
