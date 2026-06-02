<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'];
    $photo_id = $_GET['photo_id'] ?? 0;

    $stmt = $conn->prepare("SELECT collections.id, collections.name FROM collections JOIN collection_photos ON collections.id = collection_photos.collection_id WHERE collection_photos.photo_id = ? AND collections.user_id = ?");
    $stmt->bind_param("ii", $photo_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $collections = mysqli_fetch_all($result, MYSQLI_ASSOC);

    $conn->close();

    echo json_encode($collections);
?>
