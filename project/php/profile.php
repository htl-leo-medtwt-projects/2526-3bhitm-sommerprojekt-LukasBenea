<?php

require_once "authCheck.php";
require_once "mysql.php";

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

$stmt2 = $conn->prepare("SELECT * FROM photos WHERE user_id = ?");
$stmt2->bind_param("i", $user_id);
$stmt2->execute();
$result2 = $stmt2->get_result();
$photos = mysqli_fetch_all($result2, MYSQLI_ASSOC);

$stmt3 = $conn->prepare("SELECT * FROM collections WHERE user_id = ?");
$stmt3->bind_param("i", $user_id);
$stmt3->execute();
$result3 = $stmt3->get_result();
$collections = mysqli_fetch_all($result3, MYSQLI_ASSOC);

$stmt4 = $conn->prepare("SELECT cities.* FROM cities JOIN visited_cities ON cities.id = visited_cities.city_id WHERE visited_cities.user_id = ?");
$stmt4->bind_param("i", $user_id);
$stmt4->execute();
$result4 = $stmt4->get_result();
$visitedCities = mysqli_fetch_all($result4, MYSQLI_ASSOC);

$stmt5 = $conn->prepare("SELECT COUNT(*) as total FROM likes WHERE user_id = ?");
$stmt5->bind_param("i", $user_id);
$stmt5->execute();
$result5 = $stmt5->get_result();
$likesData = $result5->fetch_assoc();

$stmt6 = $conn->prepare("SELECT photos.* FROM photos JOIN likes ON photos.id = likes.photo_id WHERE likes.user_id = ?");
$stmt6->bind_param("i", $user_id);
$stmt6->execute();
$result6 = $stmt6->get_result();
$likedPhotos = mysqli_fetch_all($result6, MYSQLI_ASSOC);

$conn->close();

$photoCount = count($photos);
$likeCount = $likesData['total'];
$visitedCount = count($visitedCities);
$collectionCount = count($collections);
$joinedDate = date('F Y', strtotime($user['created_at']));
$bioText = !empty($user['bio']) ? $user['bio'] : 'No bio yet.';

$coverImg = !empty($user['cover_image'])
    ? '<img id="coverImg" src="../images/' . $user['cover_image'] . '" alt="cover">'
    : '';

$avatarHtml = !empty($user['profilbild'])
    ? '<img id="avatar" src="../images/' . $user['profilbild'] . '" alt="avatar">'
    : '<div id="avatarPlaceholder">' . strtoupper(substr($user['username'], 0, 1)) . '</div>';

$statsHtml = '
    <div class="statBox">
        <p class="statValue">' . $photoCount . '</p>
        <p class="statLabel">Photos</p>
    </div>
    <div class="statBox">
        <p class="statValue">' . $likeCount . '</p>
        <p class="statLabel">Likes</p>
    </div>
    <div class="statBox">
        <p class="statValue">' . $visitedCount . '</p>
        <p class="statLabel">Cities Visited</p>
    </div>
    <div class="statBox">
        <p class="statValue">' . $collectionCount . '</p>
        <p class="statLabel">Collections</p>
    </div>
';

$photoCards = "";
foreach ($photos as $photo) {
    $photoCards .= '
        <div class="photoCard" onclick="openPhotoDetailById(' . $photo['id'] . ', photos)">
            <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
            <div class="photoOverlay">
                <p class="photoTitle">' . $photo['title'] . '</p>
            </div>
        </div>
    ';
}

$photoSection = empty($photos)
    ? '<p class="emptyMsg">No photos yet.</p>'
    : '<div class="photoGrid" data-masonry=\'{"itemSelector": ".photoCard", "columnWidth": ".photoCard", "gutter": 15}\'>' . $photoCards . '</div>';

$likedCards = "";
foreach ($likedPhotos as $photo) {
    $likedCards .= '
        <div class="photoCard" onclick="openPhotoDetailById(' . $photo['id'] . ', likedPhotosData)">
            <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
            <div class="photoOverlay">
                <p class="photoTitle">' . $photo['title'] . '</p>
            </div>
        </div>
    ';
}

$likedSection = empty($likedPhotos)
    ? '<p class="emptyMsg">No liked photos yet.</p>'
    : '<div class="photoGrid" data-masonry=\'{"itemSelector": ".photoCard", "columnWidth": ".photoCard", "gutter": 15}\'>' . $likedCards . '</div>';

$collectionCards = "";
foreach ($collections as $collection) {
    $collectionCards .= '
        <div class="collectionCard" onclick="openCollectionOverlay(' . $collection['id'] . ')">
            <p class="collectionName">' . $collection['name'] . '</p>
            <p class="collectionDesc">' . $collection['description'] . '</p>
            <div class="deleteCollectionBtn" onclick="deleteCollection(event, ' . $collection['id'] . ')">
                <i class="fa-regular fa-trash-can"></i>
            </div>
        </div>
    ';
}

$collectionSection = empty($collections)
    ? '<p class="emptyMsg">No collections yet.</p>'
    : '<div class="collectionGrid">' . $collectionCards . '</div>';

$visitedCards = "";
foreach ($visitedCities as $city) {
    $visitedCards .= '
        <div class="visitedCard">
            <img src="../images/' . $city['hero_image'] . '" alt="' . $city['name'] . '">
            <div class="visitedOverlay">
                <p class="visitedName">' . $city['name'] . '</p>
                <p class="visitedCountry">' . $city['country'] . '</p>
            </div>
        </div>
    ';
}

$visitedSection = empty($visitedCities)
    ? '<p class="emptyMsg">No cities visited yet.</p>'
    : '<div class="visitedGrid">' . $visitedCards . '</div>';

$photosJson = json_encode($photos);
$likedPhotosJson = json_encode($likedPhotos);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery – <?php echo $user['username']; ?></title>
    <?php
        echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';
        echo '<link href="../css/profile.css' . '?' . time() . '" rel="stylesheet">';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"></script>';
        echo '<script src="../js/script.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="wrapper">

        <div id="navbar">
            <a href="index.php" id="navLogo">Scenery</a>
            <div id="navRight">
                <a href="javascript:history.back()" id="navBack">Back</a>
                <a href="logout.php" id="navLogout">Logout</a>
            </div>
        </div>

        <div id="coverSection">
            <?php echo $coverImg; ?>
            <div id="coverOverlay"></div>
        </div>

        <div id="profileSection">
            <div id="profileHeader">
                <div id="avatarBox">
                    <?php echo $avatarHtml; ?>
                </div>
                <div id="profileInfo">
                    <h1 id="profileUsername"><?php echo $user['username']; ?></h1>
                    <p id="profileBio"><?php echo $bioText; ?></p>
                    <p id="profileJoined">Member since <?php echo $joinedDate; ?></p>
                </div>
            </div>
            <div id="statsBar">
                <?php echo $statsHtml; ?>
            </div>
        </div>

        <div id="contentSection">

            <div class="contentBlock">
                <h2 class="blockTitle">My Photos</h2>
                <?php echo $photoSection; ?>
            </div>

            <div class="contentBlock">
                <h2 class="blockTitle">Liked Photos</h2>
                <?php echo $likedSection; ?>
            </div>

            <div class="contentBlock">
                <h2 class="blockTitle">Collections</h2>
                <?php echo $collectionSection; ?>
            </div>

            <div class="contentBlock">
                <h2 class="blockTitle">Cities Visited</h2>
                <?php echo $visitedSection; ?>
            </div>

        </div>

    </div>

    <div id="collectionOverlayModal" class="hidden">
        <div id="collectionOverlayBg" onclick="closeCollectionOverlay()"></div>
        <div id="collectionOverlayBox">
            <span id="collectionOverlayClose" onclick="closeCollectionOverlay()">✕</span>
            <h2 id="collectionOverlayTitle"></h2>
            <div id="collectionOverlayGrid"></div>
        </div>
    </div>

    <div id="photoDetailModal" class="hidden">
        <div id="photoDetailOverlay" onclick="closePhotoDetail()"></div>
        <div id="photoDetailBox">
            <span id="photoDetailClose" onclick="closePhotoDetail()">✕</span>
            <div id="photoDetailContent">
                <div id="photoDetailLeft">
                    <img id="photoDetailImg" src="" alt="">
                </div>
                <div id="photoDetailRight">
                    <h2 id="photoDetailTitle"></h2>
                    <p id="photoDetailDesc"></p>
                    <div id="photoDetailExif"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="deleteModal" class="hidden">
        <div id="deleteOverlay" onclick="closeDeleteModal()"></div>
        <div id="deleteBox">
            <h2 id="deleteTitle">Delete Collection?</h2>
            <p id="deleteText">Are you sure you want to delete this collection?</p>
            <div id="deleteBtns">
                <div id="deleteCancelBtn" onclick="closeDeleteModal()">Cancel</div>
                <div id="deleteConfirmBtn">Delete</div>
            </div>
        </div>
    </div>

    <script>
        <?php echo 'const photos = ' . $photosJson . ';'; ?>
        <?php echo 'const likedPhotosData = ' . $likedPhotosJson . ';'; ?>
    </script>

</body>
</html>