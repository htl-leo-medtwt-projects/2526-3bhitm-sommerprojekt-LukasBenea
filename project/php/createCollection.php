<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'];
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';

    $stmt = $conn->prepare("INSERT INTO collections (user_id, name, description) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $name, $description);
    $stmt->execute();

    $collection_id = $conn->insert_id;

    $conn->close();

    echo json_encode(["status" => "success", "collection_id" => $collection_id, "name" => $name]);
?>
