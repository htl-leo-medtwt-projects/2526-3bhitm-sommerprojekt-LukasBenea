<?php
    session_start();
    require_once "mysql.php";

    $city_id = $_GET['id'];
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

    $stmt = $conn->prepare("SELECT * FROM cities WHERE id = ?");
    $stmt->bind_param("i", $city_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $city = $result->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT * FROM photos WHERE city_id = ?");
    $stmt2->bind_param("i", $city_id);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $photos = mysqli_fetch_all($result2, MYSQLI_ASSOC);

    $likedPhotoIds = [];
    if ($user_id > 0) {
        $stmt3 = $conn->prepare("SELECT photo_id FROM likes WHERE user_id = ?");
        $stmt3->bind_param("i", $user_id);
        $stmt3->execute();
        $likedRows = mysqli_fetch_all($stmt3->get_result(), MYSQLI_ASSOC);
        foreach ($likedRows as $row) {
            $likedPhotoIds[] = $row['photo_id'];
        }
    }

    $savedPhotoIds = [];
    if ($user_id > 0) {
        $stmt4 = $conn->prepare("SELECT DISTINCT cp.photo_id FROM collection_photos cp JOIN collections c ON cp.collection_id = c.id WHERE c.user_id = ?");
        $stmt4->bind_param("i", $user_id);
        $stmt4->execute();
        $savedRows = mysqli_fetch_all($stmt4->get_result(), MYSQLI_ASSOC);
        foreach ($savedRows as $row) {
            $savedPhotoIds[] = $row['photo_id'];
        }
    }

    $isVisited = false;
    if ($user_id > 0) {
        $stmt5 = $conn->prepare("SELECT id FROM visited_cities WHERE user_id = ? AND city_id = ?");
        $stmt5->bind_param("ii", $user_id, $city_id);
        $stmt5->execute();
        if ($stmt5->get_result()->fetch_assoc()) {
            $isVisited = true;
        }
    }

    $conn->close();

    $heroImg = !empty($city['hero_image'])
        ? '<img src="../images/' . $city['hero_image'] . '" alt="' . $city['name'] . '">'
        : '<div class="noImage"></div>';

    $metaBoxes = '
        <div class="metaBox">
            <p class="metaLabel">Country</p>
            <p class="metaValue">' . $city['country'] . '</p>
        </div>
        <div class="metaBox">
            <p class="metaLabel">Continent</p>
            <p class="metaValue">' . $city['continent'] . '</p>
        </div>
        <div class="metaBox">
            <p class="metaLabel">Population</p>
            <p class="metaValue">' . number_format($city['population']) . '</p>
        </div>
        <div class="metaBox">
            <p class="metaLabel">Photos</p>
            <p class="metaValue">' . count($photos) . '</p>
        </div>
    ';

    $photoCards = "";
    foreach ($photos as $photo) {
        $isLiked = in_array($photo['id'], $likedPhotoIds);
        $isSaved = in_array($photo['id'], $savedPhotoIds);
        $heartClass = $isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';
        $bookmarkClass = $isSaved ? 'fa-solid fa-bookmark saved' : 'fa-regular fa-bookmark';

        $photoCards .= '
            <div class="photoCard" onclick="openModal(' . $photo['id'] . ')">
                <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
                <div class="photoOverlay">
                    <p class="photoTitle">' . $photo['title'] . '</p>
                </div>
                <div class="cardBtns">
                    <div class="likeBtn" onclick="toggleLike(event, ' . $photo['id'] . ', this)">
                        <i class="' . $heartClass . '"></i>
                    </div>
                    <div class="collectBtn" onclick="handleBookmark(event, ' . $photo['id'] . ', ' . ($isSaved ? 'true' : 'false') . ', this)">
                        <i class="' . $bookmarkClass . '"></i>
                    </div>
                </div>
            </div>
        ';
    }

    $photosJson = json_encode($photos);
    $likedJson = json_encode($likedPhotoIds);
    $savedJson = json_encode($savedPhotoIds);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery – <?php echo $city['name']; ?></title>
    <?php
        echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';
        echo '<script src="../js/common.js' . '?' . time() . '" defer></script>';
        echo '<script src="../js/city.js' . '?' . time() . '" defer></script>';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"></script>';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>';
        echo '<link href="../css/city.css' . '?' . time() . '" rel="stylesheet">';
    ?>
</head>
<body>

    <div id="wrapper">

        <div id="navbar">
            <a href="index.php" id="navLogo">Scenery</a>
            <div id="navRight">
                <a href="javascript:history.back()" id="navBack">Back</a>
                <?php if ($user_id > 0) { ?>
                    <a href="profile.php" id="navProfile">
                        <img src="../images/account_Icon.png" alt="account">
                    </a>
                    <a href="logout.php" id="navLogout">Logout</a>
                <?php } else { ?>
                    <a href="registration.php" id="navLogin">Login</a>
                <?php } ?>
            </div>
        </div>

        <div id="cityHero">
            <?php echo $heroImg; ?>
            <div id="cityHeroOverlay">
                <p id="cityContinent"><?php echo $city['continent']; ?></p>
                <h1 id="cityTitle"><?php echo $city['name']; ?></h1>
                <p id="cityCountry"><?php echo $city['country']; ?></p>
                <?php if ($user_id > 0) { ?>
                    <div id="visitBtn" class="<?php echo $isVisited ? 'visited' : ''; ?>" onclick="toggleVisit(<?php echo $city_id; ?>)">
                        <i class="fa-solid fa-location-dot"></i>
                        <span id="visitText"><?php echo $isVisited ? "I've been here" : "Mark as visited"; ?></span>
                    </div>
                <?php } ?>
            </div>
        </div>

        <div id="cityBody">

            <div id="cityMeta">
                <?php echo $metaBoxes; ?>
            </div>

            <p id="cityDescription"><?php echo $city['description']; ?></p>

            <div id="photosSection">
                <h2 id="photosTitle">Community Photos</h2>
                <div id="photosGrid" data-masonry='{"itemSelector": ".photoCard", "columnWidth": ".photoCard", "gutter": 15}'>
                    <?php echo $photoCards; ?>
                </div>
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

    <div id="modal" class="hidden">
        <div id="modalOverlay" onclick="closeModal()"></div>
        <div id="modalBox">
            <span id="modalClose" onclick="closeModal()">✕</span>
            <div id="modalContent">
                <div id="modalLeft">
                    <img id="modalImg" src="" alt="">
                </div>
                <div id="modalRight">
                    <h2 id="modalTitle"></h2>
                    <p id="modalDesc"></p>
                    <p id="modalTags"></p>
                    <div id="modalActions">
                        <div id="modalLikeBtn" onclick="toggleLikeModal(this)">
                            <i id="modalLikeIcon" class="fa-regular fa-heart"></i>
                            <span id="modalLikeText">Like</span>
                        </div>
                        <div id="modalBookmarkBtn" onclick="handleModalBookmark()">
                            <i id="modalBookmarkIcon" class="fa-regular fa-bookmark"></i>
                            <span id="modalBookmarkText">Save</span>
                        </div>
                    </div>
                    <div id="modalExif">
                        <p class="exifRow" id="exifCamera"></p>
                        <p class="exifRow" id="exifFocal"></p>
                        <p class="exifRow" id="exifAperture"></p>
                        <p class="exifRow" id="exifShutter"></p>
                        <p class="exifRow" id="exifIso"></p>
                        <p class="exifRow" id="exifMode"></p>
                        <p class="exifRow" id="exifWb"></p>
                    </div>
                </div>
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

    <script>
        <?php echo 'const photos = ' . $photosJson . ';'; ?>
        <?php echo 'let likedPhotos = ' . $likedJson . ';'; ?>
        <?php echo 'let savedPhotos = ' . $savedJson . ';'; ?>
    </script>

</body>
</html>
