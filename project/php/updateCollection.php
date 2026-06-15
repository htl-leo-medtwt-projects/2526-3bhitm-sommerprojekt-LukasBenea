<?php
    session_start();
    require_once "mysql.php";

    header('Content-Type: application/json');

    $user_id = $_SESSION['user_id'] ?? 0;
    $collection_id = $_POST['collection_id'] ?? 0;
    $name = trim($_POST['name'] ?? '');
    $description = $_POST['description'] ?? '';

    if ($user_id === 0 || $name === '') {
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE collections SET name = ?, description = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ssii", $name, $description, $collection_id, $user_id);
    $stmt->execute();

    $conn->close();

    echo json_encode(["status" => "success", "name" => $name, "description" => $description]);
?>
