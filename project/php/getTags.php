<?php

require_once "mysql.php";

$result = $conn->query("SELECT * FROM tags ORDER BY name");
$tags = mysqli_fetch_all($result, MYSQLI_ASSOC);

$conn->close();

echo json_encode($tags);

?>