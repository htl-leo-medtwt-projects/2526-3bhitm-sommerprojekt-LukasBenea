<?php
    session_start();
    require_once "mysql.php";

    header('Content-Type: application/json');

    $user_id = $_SESSION['user_id'] ?? 0;
    $photo_id = $_POST['photo_id'] ?? 0;

    if ($user_id === 0) {
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM photos WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $photo_id, $user_id);
    $stmt->execute();

    if (!$stmt->get_result()->fetch_assoc()) {
        echo json_encode(["status" => "error"]);
        $conn->close();
        exit;
    }

    $stmt2 = $conn->prepare("DELETE FROM likes WHERE photo_id = ?");
    $stmt2->bind_param("i", $photo_id);
    $stmt2->execute();

    $stmt3 = $conn->prepare("DELETE FROM photo_tags WHERE photo_id = ?");
    $stmt3->bind_param("i", $photo_id);
    $stmt3->execute();

    $stmt4 = $conn->prepare("DELETE FROM collection_photos WHERE photo_id = ?");
    $stmt4->bind_param("i", $photo_id);
    $stmt4->execute();

    $stmt5 = $conn->prepare("DELETE FROM photos WHERE id = ? AND user_id = ?");
    $stmt5->bind_param("ii", $photo_id, $user_id);
    $stmt5->execute();

    $conn->close();

    echo json_encode(["status" => "deleted"]);
?>
