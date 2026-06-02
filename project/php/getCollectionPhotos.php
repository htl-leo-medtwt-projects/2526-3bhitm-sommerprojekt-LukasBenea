<?php
    session_start();
    require_once "mysql.php";

    $collection_id = $_GET['collection_id'];

    $stmt = $conn->prepare("SELECT * FROM collections WHERE id = ?");
    $stmt->bind_param("i", $collection_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $collection = $result->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT photos.* FROM photos JOIN collection_photos ON photos.id = collection_photos.photo_id WHERE collection_photos.collection_id = ?");
    $stmt2->bind_param("i", $collection_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $photos = mysqli_fetch_all($result2, MYSQLI_ASSOC);

    $conn->close();

    echo json_encode(["name" => $collection['name'], "photos" => $photos]);
?>
