<?php

session_start();
require_once "mysql.php";

$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 0;

$sql = "SELECT * FROM cities";
$result = $conn->query($sql);
$cities = mysqli_fetch_all($result, MYSQLI_ASSOC);

$tagsResult = $conn->query("SELECT * FROM tags ORDER BY name");
$tags = mysqli_fetch_all($tagsResult, MYSQLI_ASSOC);

$conn->close();

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
        echo '<script src="../js/script.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="wrapper">

        <div id="navbar">
            <a href="index.php" id="navLogo">Scenery</a>
            <div id="navRight">
                <a href="index.php" id="navHome">Home</a>
                <a href="profile.php" id="navProfile">
                    <img src="../images/account_Icon.png" alt="account">
                </a>
                <a href="logout.php" id="navLogout">Logout</a>
            </div>
        </div>

        <div id="heroSection">

            <div class="skylineLeft">
                <div class="building b1"></div>
                <div class="building b2"></div>
                <div class="building b3"></div>
                <div class="building b4"></div>
                <div class="building b5"></div>
                <div class="building b6"></div>
                <div class="building b7"></div>
                <div class="building b8"></div>
                <div class="building b9"></div>
                <div class="building b10"></div>
                <div class="building b11"></div>
                <div class="building b12"></div>
                <div class="building b13"></div>
                <div class="building b14"></div>
                <div class="building b15"></div>
            </div>

            <div class="skylineCenter">
                <div class="building bc1"></div>
                <div class="building bc2"></div>
                <div class="building bc3"></div>
                <div class="building bc4"></div>
                <div class="building bc5"></div>
                <div class="building bc6"></div>
                <div class="building bc7"></div>
                <div class="building bc6"></div>
                <div class="building bc5"></div>
                <div class="building bc4"></div>
                <div class="building bc3"></div>
                <div class="building bc2"></div>
                <div class="building bc1"></div>
            </div>

            <div class="skylineRight">
                <div class="building b15"></div>
                <div class="building b14"></div>
                <div class="building b13"></div>
                <div class="building b12"></div>
                <div class="building b11"></div>
                <div class="building b10"></div>
                <div class="building b9"></div>
                <div class="building b8"></div>
                <div class="building b7"></div>
                <div class="building b6"></div>
                <div class="building b5"></div>
                <div class="building b4"></div>
                <div class="building b3"></div>
                <div class="building b2"></div>
                <div class="building b1"></div>
            </div>

            <div id="heroOverlay">
                <p id="title">Scenery</p>
                <p id="subtitle">View cities in their best below</p>
                <a href="#gallerySection" id="scrollBtn">Explore</a>
            </div>

        </div>

        <div id="gallerySection">

            <div class="skylineLeftFlipped">
                <div class="building b1"></div>
                <div class="building b2"></div>
                <div class="building b3"></div>
                <div class="building b4"></div>
                <div class="building b5"></div>
                <div class="building b6"></div>
                <div class="building b7"></div>
                <div class="building b8"></div>
                <div class="building b9"></div>
                <div class="building b10"></div>
                <div class="building b11"></div>
                <div class="building b12"></div>
                <div class="building b13"></div>
                <div class="building b14"></div>
                <div class="building b15"></div>
            </div>

            <div class="skylineCenterFlipped">
                <div class="building bc1"></div>
                <div class="building bc2"></div>
                <div class="building bc3"></div>
                <div class="building bc4"></div>
                <div class="building bc5"></div>
                <div class="building bc6"></div>
                <div class="building bc7"></div>
                <div class="building bc6"></div>
                <div class="building bc5"></div>
                <div class="building bc4"></div>
                <div class="building bc3"></div>
                <div class="building bc2"></div>
                <div class="building bc1"></div>
            </div>

            <div class="skylineRightFlipped">
                <div class="building b15"></div>
                <div class="building b14"></div>
                <div class="building b13"></div>
                <div class="building b12"></div>
                <div class="building b11"></div>
                <div class="building b10"></div>
                <div class="building b9"></div>
                <div class="building b8"></div>
                <div class="building b7"></div>
                <div class="building b6"></div>
                <div class="building b5"></div>
                <div class="building b4"></div>
                <div class="building b3"></div>
                <div class="building b2"></div>
                <div class="building b1"></div>
            </div>

            <div id="galleryInner">

                <div id="viewSwitch">
                    <span class="switchBtn active" id="citiesBtn" onclick="switchView('cities')">Cities</span>
                    <span class="switchBtn" id="photosBtn" onclick="switchView('photos')">Photos</span>
                </div>

                <div id="citiesView">
                    <div id="topBar">
                        <input type="text" id="searchInput" placeholder="Search cities or countries...">
                        <?php
                        if ($user_id > 0) {
                        ?>
                            <span id="addBtn" onclick="openUploadModal()">+ Add Photo</span>
                        <?php
                        }
                        ?>
                    </div>
                    <div id="grid" data-masonry='{"itemSelector": ".cityCard", "columnWidth": ".cityCard", "gutter": 20}'>
                        <?php echo $cityCards; ?>
                    </div>
                </div>

                <div id="photosView" class="hidden">
                    <div id="photosTopBar">
                        <input type="text" id="photoSearchInput" placeholder="Search photos...">
                        <div id="tagsBar">
                            <span class="tagBtn active" data-tag="">All</span>
                            <?php echo $tagButtons; ?>
                        </div>
                    </div>
                    <div id="photosGrid" data-masonry='{"itemSelector": ".galleryPhotoCard", "columnWidth": ".galleryPhotoCard", "gutter": 15}'></div>
                </div>

            </div>

        </div>

    </div>

    <?php
    if ($user_id > 0) {
    ?>
    <div id="uploadModal" class="hidden">
        <div id="uploadOverlay" onclick="closeUploadModal()"></div>
        <div id="uploadBox">
            <span id="uploadClose" onclick="closeUploadModal()">✕</span>
            <h2 id="uploadTitle">Upload Photo</h2>
            <div id="uploadForm">
                <div id="uploadDropzone" onclick="document.getElementById('fileInput').click()">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Click or drag to upload</p>
                    <input type="file" id="fileInput" accept="image/*" style="display:none">
                </div>
                <img id="uploadPreview" src="" alt="" class="hidden">
                <input type="text" id="uploadTitle_input" placeholder="Title">
                <input type="text" id="uploadDesc" placeholder="Description (optional)">
                <select id="uploadCity">
                    <option value="">Select city...</option>
                    <?php
                    foreach ($cities as $city) {
                    ?>
                        <option value="<?php echo $city['id']; ?>"><?php echo $city['name']; ?></option>
                    <?php
                    }
                    ?>
                </select>
                <div id="uploadTags">
                    <?php
                    foreach ($tags as $tag) {
                    ?>
                        <span class="uploadTagBtn" data-id="<?php echo $tag['id']; ?>"><?php echo $tag['name']; ?></span>
                    <?php
                    }
                    ?>
                </div>
                <button id="uploadSubmitBtn" onclick="submitUpload()">Upload</button>
            </div>
        </div>
    </div>
    <?php
    }
    ?>

    <script>
        <?php echo 'const cities = ' . $citiesJson . ';'; ?>
    </script>

</body>
</html>