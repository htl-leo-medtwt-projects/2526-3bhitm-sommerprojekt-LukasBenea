<?php
    require_once "authCheck.php";
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT * FROM photos WHERE user_id = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $photos = mysqli_fetch_all($stmt2->get_result(), MYSQLI_ASSOC);

    $stmt3 = $conn->prepare("SELECT * FROM collections WHERE user_id = ?");
    $stmt3->bind_param("i", $user_id);
    $stmt3->execute();
    $collections = mysqli_fetch_all($stmt3->get_result(), MYSQLI_ASSOC);

    $stmt4 = $conn->prepare("SELECT cities.* FROM cities JOIN visited_cities ON cities.id = visited_cities.city_id WHERE visited_cities.user_id = ?");
    $stmt4->bind_param("i", $user_id);
    $stmt4->execute();
    $visitedCities = mysqli_fetch_all($stmt4->get_result(), MYSQLI_ASSOC);

    $stmt5 = $conn->prepare("SELECT COUNT(*) as total FROM likes WHERE user_id = ?");
    $stmt5->bind_param("i", $user_id);
    $stmt5->execute();
    $likesData = $stmt5->get_result()->fetch_assoc();

    $stmt6 = $conn->prepare("SELECT photos.* FROM photos JOIN likes ON photos.id = likes.photo_id WHERE likes.user_id = ?");
    $stmt6->bind_param("i", $user_id);
    $stmt6->execute();
    $likedPhotos = mysqli_fetch_all($stmt6->get_result(), MYSQLI_ASSOC);

    $savedPhotoIds = [];
    $stmt7 = $conn->prepare("SELECT DISTINCT cp.photo_id FROM collection_photos cp JOIN collections c ON cp.collection_id = c.id WHERE c.user_id = ?");
    $stmt7->bind_param("i", $user_id);
    $stmt7->execute();
    foreach (mysqli_fetch_all($stmt7->get_result(), MYSQLI_ASSOC) as $row) {
        $savedPhotoIds[] = $row['photo_id'];
    }

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

    $previewLimit = 6;

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
        : '<div class="previewGrid' . (count($photos) > $previewLimit ? ' hasMore' : '') . '" id="myPhotosGrid">' . $photoCards . '</div>'
        . (count($photos) > $previewLimit ? '<div class="showAllBtn" onclick="openSectionOverlay(\'myPhotos\')">Show all ' . count($photos) . ' photos</div>' : '');

    $likedCards = "";
    foreach ($likedPhotos as $photo) {
        $likedCards .= '
            <div class="photoCard" onclick="openPhotoDetailById(' . $photo['id'] . ', likedPhotosData)" data-photo-id="' . $photo['id'] . '">
                <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
                <div class="photoOverlay">
                    <p class="photoTitle">' . $photo['title'] . '</p>
                </div>
                <div class="unlikeBtn" onclick="unlikePhoto(event, ' . $photo['id'] . ', this)">
                    <i class="fa-solid fa-heart"></i>
                </div>
            </div>
        ';
    }

    $likedSection = empty($likedPhotos)
        ? '<p class="emptyMsg">No liked photos yet.</p>'
        : '<div class="previewGrid' . (count($likedPhotos) > $previewLimit ? ' hasMore' : '') . '" id="likedPhotosGrid">' . $likedCards . '</div>'
        . (count($likedPhotos) > $previewLimit ? '<div class="showAllBtn" onclick="openSectionOverlay(\'likedPhotos\')">Show all ' . count($likedPhotos) . ' photos</div>' : '');

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
            <a class="visitedCard" href="city.php?id=' . $city['id'] . '">
                <img src="../images/' . $city['hero_image'] . '" alt="' . $city['name'] . '">
                <div class="visitedOverlay">
                    <p class="visitedName">' . $city['name'] . '</p>
                    <p class="visitedCountry">' . $city['country'] . '</p>
                </div>
            </a>
        ';
    }

    $visitedSection = empty($visitedCities)
        ? '<p class="emptyMsg">No cities visited yet.</p>'
        : '<div class="previewGrid visitedPreviewGrid' . (count($visitedCities) > $previewLimit ? ' hasMore' : '') . '" id="visitedGrid">' . $visitedCards . '</div>'
        . (count($visitedCities) > $previewLimit ? '<div class="showAllBtn" onclick="openSectionOverlay(\'visited\')">Show all ' . count($visitedCities) . ' cities</div>' : '');

    $photosJson = json_encode($photos);
    $likedPhotosJson = json_encode($likedPhotos);
    $visitedJson = json_encode($visitedCities);
    $savedJson = json_encode($savedPhotoIds);
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
        echo '<script src="../js/common.js' . '?' . time() . '" defer></script>';
        echo '<script src="../js/profile.js' . '?' . time() . '" defer></script>';
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

    <footer id="footer">
        <div id="footerInner">
            <a href="index.php" id="footerLogo">Scenery</a>
            <p id="footerTagline">The city is the star.</p>
            <div id="footerLinks">
                <a href="gallery.php">Gallery</a>
                <a href="profile.php">Profile</a>
                <a href="logout.php">Logout</a>
            </div>
            <p id="footerCopy">© 2025 Scenery. All rights reserved.</p>
        </div>
    </footer>

    <div id="sectionOverlay" class="hidden">
        <div id="sectionOverlayBg" onclick="closeSectionOverlay()"></div>
        <div id="sectionOverlayBox">
            <span id="sectionOverlayClose" onclick="closeSectionOverlay()">✕</span>
            <h2 id="sectionOverlayTitle"></h2>
            <div id="sectionOverlayGrid"></div>
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
                    <div id="photoDetailActions">
                        <div id="photoDetailLikeBtn" onclick="toggleLikeDetail()">
                            <i id="photoDetailLikeIcon" class="fa-regular fa-heart"></i>
                            <span id="photoDetailLikeText">Like</span>
                        </div>
                        <div id="photoDetailBookmarkBtn" onclick="handlePhotoDetailBookmark()">
                            <i id="photoDetailBookmarkIcon" class="fa-regular fa-bookmark"></i>
                            <span>Collections</span>
                        </div>
                    </div>
                    <div id="photoDetailExif"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="saveModal" class="hidden">
        <div id="saveModalOverlay" onclick="closeSaveModal()"></div>
        <div id="saveModalBox">
            <span id="saveModalClose" onclick="closeSaveModal()">✕</span>
            <h2 id="saveModalTitle">Collections</h2>
            <div id="savedInSection" class="hidden">
                <p class="saveModalLabel">Saved in</p>
                <div id="savedInList"></div>
                <div id="removeAllBtn" onclick="removeFromAllCollections()">Remove from all collections</div>
            </div>
            <div id="saveModalDivider" class="hidden"></div>
            <div id="addToSection">
                <p class="saveModalLabel" id="addToLabel">Add to Collection</p>
                <input type="text" id="saveModalCollectionSearch" placeholder="Search or create...">
                <div id="saveModalResults"></div>
            </div>
        </div>
    </div>

    <div id="collectionModal" class="hidden">
        <div id="collectionOverlay" onclick="closeCollectionModal()"></div>
        <div id="collectionBox">
            <span id="collectionClose" onclick="closeCollectionModal()">✕</span>
            <h2 id="collectionTitle">Add to Collection</h2>
            <input type="text" id="collectionSearch" placeholder="Search or create collection...">
            <div id="collectionResults"></div>
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
        <?php echo 'const visitedCitiesData = ' . $visitedJson . ';'; ?>
        <?php echo 'let savedPhotos = ' . $savedJson . ';'; ?>
    </script>

</body>
</html>
