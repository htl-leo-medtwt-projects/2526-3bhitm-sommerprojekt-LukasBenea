<?php
    session_start();
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'];
    $photo_id = $_POST['photo_id'] ?? 0;
    $collection_id = $_POST['collection_id'] ?? 0;
    $remove_all = $_POST['remove_all'] ?? 0;

    if ($remove_all) {
        $stmt = $conn->prepare("SELECT cp.collection_id FROM collection_photos cp JOIN collections c ON cp.collection_id = c.id WHERE cp.photo_id = ? AND c.user_id = ?");
        $stmt->bind_param("ii", $photo_id, $user_id);
        $stmt->execute();
        $affectedRows = mysqli_fetch_all($stmt->get_result(), MYSQLI_ASSOC);
        $affectedIds = array_column($affectedRows, 'collection_id');

        $stmt2 = $conn->prepare("DELETE cp FROM collection_photos cp JOIN collections c ON cp.collection_id = c.id WHERE cp.photo_id = ? AND c.user_id = ?");
        $stmt2->bind_param("ii", $photo_id, $user_id);
        $stmt2->execute();

        foreach ($affectedIds as $cid) {
            $stmtCheck = $conn->prepare("SELECT COUNT(*) as cnt FROM collection_photos WHERE collection_id = ?");
            $stmtCheck->bind_param("i", $cid);
            $stmtCheck->execute();
            $row = $stmtCheck->get_result()->fetch_assoc();
            if ($row['cnt'] == 0) {
                $stmtDel = $conn->prepare("DELETE FROM collections WHERE id = ? AND user_id = ?");
                $stmtDel->bind_param("ii", $cid, $user_id);
                $stmtDel->execute();
            }
        }
    } else {
        $stmt = $conn->prepare("DELETE FROM collection_photos WHERE photo_id = ? AND collection_id = ?");
        $stmt->bind_param("ii", $photo_id, $collection_id);
        $stmt->execute();

        $stmtCheck = $conn->prepare("SELECT COUNT(*) as cnt FROM collection_photos WHERE collection_id = ?");
        $stmtCheck->bind_param("i", $collection_id);
        $stmtCheck->execute();
        $row = $stmtCheck->get_result()->fetch_assoc();
        if ($row['cnt'] == 0) {
            $stmtDel = $conn->prepare("DELETE FROM collections WHERE id = ? AND user_id = ?");
            $stmtDel->bind_param("ii", $collection_id, $user_id);
            $stmtDel->execute();
        }
    }

    $conn->close();

    echo json_encode(["status" => "removed"]);
?>
