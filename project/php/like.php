<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'] ?? 0;
    $photo_id = $_POST['photo_id'] ?? 0;

    if ($user_id === 0) {
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM likes WHERE user_id = ? AND photo_id = ?");
    $stmt->bind_param("ii", $user_id, $photo_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->fetch_assoc()) {
        $stmt2 = $conn->prepare("DELETE FROM likes WHERE user_id = ? AND photo_id = ?");
        $stmt2->bind_param("ii", $user_id, $photo_id);
        $stmt2->execute();
        echo json_encode(["status" => "unliked"]);
    } else {
        $stmt2 = $conn->prepare("INSERT INTO likes (user_id, photo_id) VALUES (?, ?)");
        $stmt2->bind_param("ii", $user_id, $photo_id);
        $stmt2->execute();
        echo json_encode(["status" => "liked"]);
    }

    $conn->close();
?>
