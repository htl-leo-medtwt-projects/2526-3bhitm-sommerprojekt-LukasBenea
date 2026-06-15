<?php
    session_start();
    require_once "mysql.php";

    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

    $result = $conn->query("SELECT * FROM cities");
    $cities = mysqli_fetch_all($result, MYSQLI_ASSOC);

    $tagsResult = $conn->query("SELECT * FROM tags ORDER BY name");
    $tags = mysqli_fetch_all($tagsResult, MYSQLI_ASSOC);

    $likedPhotoIds = [];
    $savedPhotoIds = [];
    $navProfilbild = '';
    if ($user_id > 0) {
        $stmtL = $conn->prepare("SELECT photo_id FROM likes WHERE user_id = ?");
        $stmtL->bind_param("i", $user_id);
        $stmtL->execute();
        foreach (mysqli_fetch_all($stmtL->get_result(), MYSQLI_ASSOC) as $row) {
            $likedPhotoIds[] = $row['photo_id'];
        }

        $stmtS = $conn->prepare("SELECT DISTINCT cp.photo_id FROM collection_photos cp JOIN collections c ON cp.collection_id = c.id WHERE c.user_id = ?");
        $stmtS->bind_param("i", $user_id);
        $stmtS->execute();
        foreach (mysqli_fetch_all($stmtS->get_result(), MYSQLI_ASSOC) as $row) {
            $savedPhotoIds[] = $row['photo_id'];
        }

        $stmtU = $conn->prepare("SELECT profilbild FROM users WHERE id = ?");
        $stmtU->bind_param("i", $user_id);
        $stmtU->execute();
        $uRow = $stmtU->get_result()->fetch_assoc();
        $navProfilbild = $uRow['profilbild'] ?? '';
    }

    $conn->close();

    $navAvatar = !empty($navProfilbild)
        ? '<img class="navAvatarImg" src="../images/' . $navProfilbild . '" alt="account">'
        : '<img src="../images/account_Icon.png" alt="account">';

    $cityCards = "";
    foreach ($cities as $city) {
        $img = !empty($city['hero_image'])
            ? '<img src="../images/' . $city['hero_image'] . '" alt="' . $city['name'] . '">'
            : '<div class="noImage"></div>';

        $cityCards .= '
            <a href="city.php?id=' . $city['id'] . '" class="cityCard">
                ' . $img . '
                <div class="cityOverlay">
                    <p class="cityName">' . $city['name'] . '</p>
                    <p class="cityCountry">' . $city['country'] . '</p>
                </div>
            </a>
        ';
    }

    $tagButtons = '';
    foreach ($tags as $tag) {
        $tagButtons .= '<span class="tagBtn" data-tag="' . $tag['name'] . '">' . $tag['name'] . '</span>';
    }

    $citiesJson = json_encode($cities);
    $likedJson = json_encode($likedPhotoIds);
    $savedJson = json_encode($savedPhotoIds);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery</title>
    <?php
        echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';
        echo '<link href="../css/gallery.css' . '?' . time() . '" rel="stylesheet">';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"></script>';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>';
        echo '<script src="../js/common.js' . '?' . time() . '" defer></script>';
        echo '<script src="../js/gallery.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="wrapper">

        <div id="navbar">
            <a href="index.php" id="navLogo">Scenery</a>
            <div id="navRight">
                <a href="index.php" id="navHome">Home</a>
                <a href="profile.php" id="navProfile">
                    <?php echo $navAvatar; ?>
                </a>
                <a href="logout.php" id="navLogout">Logout</a>
            </div>
        </div>

        <div id="heroSection">
            <div class="skylineLeft">
                <div class="building b1"></div><div class="building b2"></div><div class="building b3"></div>
                <div class="building b4"></div><div class="building b5"></div><div class="building b6"></div>
                <div class="building b7"></div><div class="building b8"></div><div class="building b9"></div>
                <div class="building b10"></div><div class="building b11"></div><div class="building b12"></div>
                <div class="building b13"></div><div class="building b14"></div><div class="building b15"></div>
            </div>
            <div class="skylineCenter">
                <div class="building bc1"></div><div class="building bc2"></div><div class="building bc3"></div>
                <div class="building bc4"></div><div class="building bc5"></div><div class="building bc6"></div>
                <div class="building bc7"></div><div class="building bc6"></div><div class="building bc5"></div>
                <div class="building bc4"></div><div class="building bc3"></div><div class="building bc2"></div>
                <div class="building bc1"></div>
            </div>
            <div class="skylineRight">
                <div class="building b15"></div><div class="building b14"></div><div class="building b13"></div>
                <div class="building b12"></div><div class="building b11"></div><div class="building b10"></div>
                <div class="building b9"></div><div class="building b8"></div><div class="building b7"></div>
                <div class="building b6"></div><div class="building b5"></div><div class="building b4"></div>
                <div class="building b3"></div><div class="building b2"></div><div class="building b1"></div>
            </div>
            <div id="heroOverlay">
                <p id="title">Scenery</p>
                <p id="subtitle">View cities in their best below</p>
                <a href="#gallerySection" id="scrollBtn">Explore</a>
            </div>
        </div>

        <div id="gallerySection">
            <div class="skylineLeftFlipped">
                <div class="building b1"></div><div class="building b2"></div><div class="building b3"></div>
                <div class="building b4"></div><div class="building b5"></div><div class="building b6"></div>
                <div class="building b7"></div><div class="building b8"></div><div class="building b9"></div>
                <div class="building b10"></div><div class="building b11"></div><div class="building b12"></div>
                <div class="building b13"></div><div class="building b14"></div><div class="building b15"></div>
            </div>
            <div class="skylineCenterFlipped">
                <div class="building bc1"></div><div class="building bc2"></div><div class="building bc3"></div>
                <div class="building bc4"></div><div class="building bc5"></div><div class="building bc6"></div>
                <div class="building bc7"></div><div class="building bc6"></div><div class="building bc5"></div>
                <div class="building bc4"></div><div class="building bc3"></div><div class="building bc2"></div>
                <div class="building bc1"></div>
            </div>
            <div class="skylineRightFlipped">
                <div class="building b15"></div><div class="building b14"></div><div class="building b13"></div>
                <div class="building b12"></div><div class="building b11"></div><div class="building b10"></div>
                <div class="building b9"></div><div class="building b8"></div><div class="building b7"></div>
                <div class="building b6"></div><div class="building b5"></div><div class="building b4"></div>
                <div class="building b3"></div><div class="building b2"></div><div class="building b1"></div>
            </div>

            <div id="galleryInner">

                <div id="viewSwitch">
                    <span class="switchBtn active" id="citiesBtn" onclick="switchView('cities')">Cities</span>
                    <span class="switchBtn" id="photosBtn" onclick="switchView('photos')">Photos</span>
                </div>

                <div id="citiesView">
                    <div id="topBar">
                        <input type="text" id="searchInput" placeholder="Search cities or countries...">
                        <?php if ($user_id > 0) { ?>
                            <span id="addBtn" onclick="openUploadModal()">+ Add Photo</span>
                        <?php } ?>
                    </div>
                    <div id="grid" data-masonry='{"itemSelector": ".cityCard", "columnWidth": ".cityCard", "gutter": 20}'>
                        <?php echo $cityCards; ?>
                    </div>
                </div>

                <div id="photosView" class="hidden">
                    <div id="photosTopBar">
                        <input type="text" id="photoSearchInput" placeholder="Search photos...">
                        <div id="photosFilterRow">
                            <div id="tagsBar">
                                <span class="tagBtn active" data-tag="">All</span>
                                <?php echo $tagButtons; ?>
                            </div>
                            <div id="sortBar">
                                <span class="sortBtn active" data-sort="popular">Popular</span>
                                <span class="sortBtn" data-sort="newest">Newest</span>
                            </div>
                        </div>
                    </div>
                    <div id="photosGrid"></div>
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
                <?php echo $user_id > 0 ? '<a href="profile.php">Profile</a>' : ''; ?>
                <?php echo $user_id > 0 ? '<a href="logout.php">Logout</a>' : '<a href="registration.php">Login</a>'; ?>
            </div>
            <p id="footerCopy">© 2026 Scenery. All rights reserved.</p>
        </div>
    </footer>

    <div id="galleryPhotoModal" class="hidden">
        <div id="galleryPhotoOverlay" onclick="closeGalleryPhotoModal()"></div>
        <div id="galleryPhotoBox">
            <span id="galleryPhotoClose" onclick="closeGalleryPhotoModal()">✕</span>
            <div class="photoNavBtn photoNavPrev" onclick="navGalleryModal(-1)"><i class="fa-solid fa-chevron-left"></i></div>
            <div class="photoNavBtn photoNavNext" onclick="navGalleryModal(1)"><i class="fa-solid fa-chevron-right"></i></div>
            <div id="galleryPhotoContent">
                <div id="galleryPhotoLeft">
                    <img id="galleryModalImg" src="" alt="">
                </div>
                <div id="galleryPhotoRight">
                    <div class="pmHeader">
                        <p id="galleryModalCity"></p>
                        <h2 id="galleryModalTitle"></h2>
                        <p id="galleryModalDesc"></p>
                        <p id="galleryModalLikes"></p>
                        <div id="galleryModalActions">
                            <div id="galleryModalLikeBtn" onclick="toggleGalleryLike()">
                                <i id="galleryModalLikeIcon" class="fa-regular fa-heart"></i>
                                <span id="galleryModalLikeText">Like</span>
                            </div>
                            <?php if ($user_id > 0) { ?>
                                <div id="galleryModalBookmarkBtn" onclick="openGalleryCollectionModal()">
                                    <i id="galleryModalBookmarkIcon" class="fa-regular fa-bookmark"></i>
                                    <span id="galleryModalBookmarkText">Save</span>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                    <div id="galleryModalMeta"></div>
                    <div id="galleryModalExif"></div>
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

    <?php if ($user_id > 0) { ?>
    <div id="uploadModal" class="hidden">
        <div id="uploadOverlay" onclick="closeUploadModal()"></div>
        <div id="uploadBox">
            <span id="uploadClose" onclick="closeUploadModal()">✕</span>
            <h2 id="uploadTitle">Upload Photo</h2>
            <div id="uploadForm">

                <div id="uploadDropzone" onclick="document.getElementById('fileInput').click()">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Click to upload</p>
                    <input type="file" id="fileInput" accept="image/*" style="display:none">
                </div>
                <img id="uploadPreview" src="" alt="" class="hidden">

                <input type="text" id="uploadTitle_input" placeholder="Title">
                <input type="text" id="uploadDesc" placeholder="Description (optional)">

                <div id="citySearchWrapper">
                    <input type="text" id="uploadCityInput" placeholder="Search city..." autocomplete="off">
                    <input type="hidden" id="uploadCityId">
                    <div id="citySuggestions" class="hidden"></div>
                    <p id="cityNotFound" class="hidden">Sorry, this city is not in our gallery yet.</p>
                </div>

                <div id="uploadTagsSection">
                    <p id="uploadTagsLabel">Tags <span id="uploadTagsCount">(0/5)</span></p>
                    <div id="uploadTags">
                        <?php foreach ($tags as $tag) { ?>
                            <span class="uploadTagBtn" data-id="<?php echo $tag['id']; ?>"><?php echo $tag['name']; ?></span>
                        <?php } ?>
                        <span class="uploadTagBtn createTag" id="createTagBtn">+ Create</span>
                    </div>
                    <div id="createTagInput" class="hidden">
                        <input type="text" id="newTagName" placeholder="New tag name...">
                        <span id="addTagBtn">Add</span>
                    </div>
                </div>

                <button id="uploadSubmitBtn" onclick="submitUpload()">Upload</button>
            </div>
        </div>
    </div>
    <?php } ?>

    <script>
        <?php echo 'const cities = ' . $citiesJson . ';'; ?>
        <?php echo 'let likedPhotos = ' . $likedJson . ';'; ?>
        <?php echo 'let savedPhotos = ' . $savedJson . ';'; ?>
        <?php echo 'const isLoggedIn = ' . ($user_id > 0 ? 'true' : 'false') . ';'; ?>
    </script>

</body>
</html>
