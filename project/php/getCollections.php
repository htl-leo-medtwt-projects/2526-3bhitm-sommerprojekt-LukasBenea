<?php

session_start();
require_once "mysql.php";

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT * FROM collections WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$collections = mysqli_fetch_all($result, MYSQLI_ASSOC);

$conn->close();

echo json_encode($collections);

?>