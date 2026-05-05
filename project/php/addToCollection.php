<?php

session_start();
require_once "mysql.php";

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? 'add';

if ($action === 'delete') {

    $collection_id = $_POST['collection_id'];

    $stmt = $conn->prepare("DELETE FROM collection_photos WHERE collection_id = ?");
    $stmt->bind_param("i", $collection_id);
    $stmt->execute();

    $stmt2 = $conn->prepare("DELETE FROM collections WHERE id = ? AND user_id = ?");
    $stmt2->bind_param("ii", $collection_id, $user_id);
    $stmt2->execute();

    $conn->close();

    echo json_encode(["status" => "deleted"]);

} else {

    $photo_id = $_POST['photo_id'] ?? 0;
    $collection_id = $_POST['collection_id'] ?? 0;

    $stmt = $conn->prepare("SELECT id FROM collection_photos WHERE collection_id = ? AND photo_id = ?");
    $stmt->bind_param("ii", $collection_id, $photo_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->fetch_assoc()) {
        echo json_encode(["status" => "already_added"]);
    } else {
        $stmt2 = $conn->prepare("INSERT INTO collection_photos (collection_id, photo_id) VALUES (?, ?)");
        $stmt2->bind_param("ii", $collection_id, $photo_id);
        $stmt2->execute();
        echo json_encode(["status" => "added"]);
    }

    $conn->close();

}

?>