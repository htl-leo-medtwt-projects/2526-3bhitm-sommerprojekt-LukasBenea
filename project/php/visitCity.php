<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'] ?? 0;
    $city_id = $_POST['city_id'] ?? 0;

    if ($user_id === 0) {
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id FROM visited_cities WHERE user_id = ? AND city_id = ?");
    $stmt->bind_param("ii", $user_id, $city_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->fetch_assoc()) {
        $stmt2 = $conn->prepare("DELETE FROM visited_cities WHERE user_id = ? AND city_id = ?");
        $stmt2->bind_param("ii", $user_id, $city_id);
        $stmt2->execute();
        echo json_encode(["status" => "removed"]);
    } else {
        $stmt2 = $conn->prepare("INSERT INTO visited_cities (user_id, city_id) VALUES (?, ?)");
        $stmt2->bind_param("ii", $user_id, $city_id);
        $stmt2->execute();
        echo json_encode(["status" => "visited"]);
    }

    $conn->close();
?>
