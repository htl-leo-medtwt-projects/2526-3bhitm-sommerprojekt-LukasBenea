<?php

require_once "mysql.php";

$stmt = $conn->prepare("SELECT cities.id, cities.name, cities.latitude, cities.longitude, COUNT(visited_cities.id) as visit_count FROM cities LEFT JOIN visited_cities ON cities.id = visited_cities.city_id GROUP BY cities.id");
$stmt->execute();
$result = $stmt->get_result();
$cities = mysqli_fetch_all($result, MYSQLI_ASSOC);

$conn->close();

echo json_encode($cities);

?>