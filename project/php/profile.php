<?php
    require_once "authCheck.php";
    require_once "mysql.php";

    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    $stmt2 = $conn->prepare("SELECT photos.*, cities.name AS city_name, users.username AS photographer, users.profilbild AS photographer_avatar, (SELECT GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') FROM photo_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.photo_id = photos.id) AS tags FROM photos LEFT JOIN cities ON photos.city_id = cities.id LEFT JOIN users ON photos.user_id = users.id WHERE photos.user_id = ?");
    $stmt2->bind_param("i", $user_id);
    $stmt2->execute();
    $photos = mysqli_fetch_all($stmt2->get_result(), MYSQLI_ASSOC);

    $stmt3 = $conn->prepare("SELECT collections.*, (SELECT photos.image_path FROM collection_photos JOIN photos ON photos.id = collection_photos.photo_id WHERE collection_photos.collection_id = collections.id ORDER BY collection_photos.id ASC LIMIT 1) AS cover_image FROM collections WHERE user_id = ?");
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

    $stmt6 = $conn->prepare("SELECT photos.*, cities.name AS city_name, users.username AS photographer, users.profilbild AS photographer_avatar, (SELECT GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') FROM photo_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.photo_id = photos.id) AS tags FROM photos JOIN likes ON photos.id = likes.photo_id LEFT JOIN cities ON photos.city_id = cities.id LEFT JOIN users ON photos.user_id = users.id WHERE likes.user_id = ?");
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
            <div class="photoCard" data-photo-id="' . $photo['id'] . '" onclick="openPhotoDetailById(' . $photo['id'] . ', photos)">
                <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
                <div class="photoOverlay">
                    <p class="photoTitle">' . $photo['title'] . '</p>
                </div>
                <div class="deletePhotoBtn" onclick="askDeletePhoto(event, ' . $photo['id'] . ')">
                    <i class="fa-regular fa-trash-can"></i>
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
        $cover = !empty($collection['cover_image'])
            ? '<img src="../images/' . $collection['cover_image'] . '" alt="' . $collection['name'] . '">'
            : '<div class="collectionCoverEmpty"><i class="fa-regular fa-images"></i></div>';

        $collectionCards .= '
            <div class="collectionCard" data-id="' . $collection['id'] . '" onclick="openCollectionOverlay(' . $collection['id'] . ')">
                <div class="collectionCover">' . $cover . '</div>
                <div class="collectionCardBody">
                    <p class="collectionName">' . $collection['name'] . '</p>
                    <p class="collectionDesc">' . $collection['description'] . '</p>
                </div>
                <div class="collectionCardBtns">
                    <div class="editCollectionBtn" onclick="openEditCollection(event, ' . $collection['id'] . ')">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </div>
                    <div class="deleteCollectionBtn" onclick="deleteCollection(event, ' . $collection['id'] . ')">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
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
                <div id="editProfileBtn" onclick="openEditProfile()">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <span>Edit Profile</span>
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
            <p id="footerCopy">© 2026 Scenery. All rights reserved.</p>
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
            <div class="photoNavBtn photoNavPrev" onclick="navDetailModal(-1)"><i class="fa-solid fa-chevron-left"></i></div>
            <div class="photoNavBtn photoNavNext" onclick="navDetailModal(1)"><i class="fa-solid fa-chevron-right"></i></div>
            <div id="photoDetailContent">
                <div id="photoDetailLeft">
                    <img id="photoDetailImg" src="" alt="">
                </div>
                <div id="photoDetailRight">
                    <div class="pmHeader">
                        <p id="photoDetailCity" class="pmCity"></p>
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
                            <div id="photoDetailDeleteBtn" class="hidden" onclick="askDeletePhoto(event, currentDetailPhotoId)">
                                <i class="fa-regular fa-trash-can"></i>
                                <span>Delete</span>
                            </div>
                        </div>
                    </div>
                    <div id="photoDetailMeta"></div>
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

    <div id="deletePhotoModal" class="hidden">
        <div id="deletePhotoOverlay" onclick="closeDeletePhotoModal()"></div>
        <div id="deletePhotoBox">
            <h2 id="deletePhotoTitle">Delete Photo?</h2>
            <p id="deletePhotoText">This photo will be permanently removed. This cannot be undone.</p>
            <div id="deletePhotoBtns">
                <div id="deletePhotoCancelBtn" onclick="closeDeletePhotoModal()">Cancel</div>
                <div id="deletePhotoConfirmBtn" onclick="confirmDeletePhoto()">Delete</div>
            </div>
        </div>
    </div>

    <div id="editCollectionModal" class="hidden">
        <div id="editCollectionOverlay" onclick="closeEditCollection()"></div>
        <div id="editCollectionBox">
            <span id="editCollectionClose" onclick="closeEditCollection()">✕</span>
            <h2 id="editCollectionTitle">Edit Collection</h2>
            <input type="text" id="editCollectionName" placeholder="Collection name">
            <input type="text" id="editCollectionDesc" placeholder="Description (optional)">
            <button id="editCollectionSaveBtn" onclick="submitEditCollection()">Save</button>
        </div>
    </div>

    <div id="editProfileModal" class="hidden">
        <div id="editProfileOverlay" onclick="closeEditProfile()"></div>
        <div id="editProfileBox">
            <span id="editProfileClose" onclick="closeEditProfile()">✕</span>
            <h2 id="editProfileModalTitle">Edit Profile</h2>

            <p class="editProfileLabel">Cover Image</p>
            <div id="editCoverDropzone" onclick="document.getElementById('editCoverInput').click()">
                <img id="editCoverPreview" src="" alt="" class="hidden">
                <div id="editCoverPlaceholder"><i class="fa-solid fa-image"></i><span>Click to upload cover</span></div>
                <input type="file" id="editCoverInput" accept="image/*" style="display:none">
            </div>

            <p class="editProfileLabel">Avatar</p>
            <div id="editAvatarRow">
                <div id="editAvatarPreviewBox" onclick="document.getElementById('editAvatarInput').click()">
                    <img id="editAvatarPreview" src="" alt="" class="hidden">
                    <div id="editAvatarPlaceholder"><i class="fa-solid fa-user"></i></div>
                </div>
                <span id="editAvatarHint" onclick="document.getElementById('editAvatarInput').click()">Click to change avatar</span>
                <input type="file" id="editAvatarInput" accept="image/*" style="display:none">
            </div>

            <p class="editProfileLabel">Bio</p>
            <textarea id="editBioInput" placeholder="Tell something about yourself..." maxlength="200"></textarea>

            <button id="editProfileSaveBtn" onclick="submitEditProfile()">Save Changes</button>
        </div>
    </div>

    <script>
        <?php echo 'const photos = ' . $photosJson . ';'; ?>
        <?php echo 'const likedPhotosData = ' . $likedPhotosJson . ';'; ?>
        <?php echo 'const visitedCitiesData = ' . $visitedJson . ';'; ?>
        <?php echo 'let savedPhotos = ' . $savedJson . ';'; ?>
        <?php echo 'const isLoggedIn = true;'; ?>
        <?php echo 'const currentUserId = ' . (int)$user_id . ';'; ?>
        <?php echo 'const userBio = ' . json_encode($user['bio'] ?? '') . ';'; ?>
        <?php echo 'const userAvatar = ' . json_encode($user['profilbild'] ?? '') . ';'; ?>
        <?php echo 'const userCover = ' . json_encode($user['cover_image'] ?? '') . ';'; ?>
    </script>

</body>
</html>
