<?php

require_once "mysql.php";

$search = $_GET['search'] ?? '';
$tag = $_GET['tag'] ?? '';

$sql = "SELECT photos.*, cities.name as city_name, 
        COUNT(DISTINCT likes.id) as like_count,
        GROUP_CONCAT(DISTINCT tags.name) as tags
        FROM photos 
        LEFT JOIN cities ON photos.city_id = cities.id
        LEFT JOIN likes ON photos.id = likes.photo_id
        LEFT JOIN photo_tags ON photos.id = photo_tags.photo_id
        LEFT JOIN tags ON photo_tags.tag_id = tags.id";

$conditions = [];

if (!empty($search)) {
    $search = mysqli_real_escape_string($conn, $search);
    $conditions[] = "(photos.title LIKE '%$search%' OR tags.name LIKE '%$search%')";
}

if (!empty($tag)) {
    $tag = mysqli_real_escape_string($conn, $tag);
    $conditions[] = "tags.name = '$tag'";
}

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$sql .= " GROUP BY photos.id ORDER BY like_count DESC";

$result = $conn->query($sql);
$photos = mysqli_fetch_all($result, MYSQLI_ASSOC);

$conn->close();

echo json_encode($photos);

?>