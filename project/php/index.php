<?php
    session_start();
    require_once "mysql.php";

    $isLoggedIn = isset($_SESSION['login']) && $_SESSION['login'] === 1;
    $user_id = $_SESSION['user_id'] ?? 0;

    $navProfilbild = '';
    if ($isLoggedIn && $user_id > 0) {
        $stmtU = $conn->prepare("SELECT profilbild FROM users WHERE id = ?");
        $stmtU->bind_param("i", $user_id);
        $stmtU->execute();
        $uRow = $stmtU->get_result()->fetch_assoc();
        $navProfilbild = $uRow['profilbild'] ?? '';
    }

    $stmtP = $conn->prepare("SELECT COUNT(*) AS c FROM photos");
    $stmtP->execute();
    $totalPhotos = $stmtP->get_result()->fetch_assoc()['c'];

    $stmtC = $conn->prepare("SELECT COUNT(*) AS c FROM cities");
    $stmtC->execute();
    $totalCities = $stmtC->get_result()->fetch_assoc()['c'];

    $stmtUsr = $conn->prepare("SELECT COUNT(*) AS c FROM users");
    $stmtUsr->execute();
    $totalUsers = $stmtUsr->get_result()->fetch_assoc()['c'];

    $stmtV = $conn->prepare("SELECT COUNT(*) AS c FROM visited_cities");
    $stmtV->execute();
    $totalVisits = $stmtV->get_result()->fetch_assoc()['c'];

    $stmtF = $conn->prepare("SELECT cities.*, COUNT(photos.id) AS photo_count FROM cities LEFT JOIN photos ON photos.city_id = cities.id GROUP BY cities.id ORDER BY photo_count DESC, cities.name ASC LIMIT 3");
    $stmtF->execute();
    $featuredCities = mysqli_fetch_all($stmtF->get_result(), MYSQLI_ASSOC);

    $stmtN = $conn->prepare("SELECT photos.*, cities.name AS city_name, users.username AS photographer, users.profilbild AS photographer_avatar, (SELECT GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') FROM photo_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.photo_id = photos.id) AS tags FROM photos LEFT JOIN cities ON photos.city_id = cities.id LEFT JOIN users ON photos.user_id = users.id ORDER BY photos.id DESC LIMIT 6");
    $stmtN->execute();
    $latestPhotos = mysqli_fetch_all($stmtN->get_result(), MYSQLI_ASSOC);

    $conn->close();

    $navAvatar = !empty($navProfilbild)
        ? '<img class="navAvatarImg" src="../images/' . $navProfilbild . '" alt="account">'
        : '<img src="../images/account_Icon.png" alt="account">';

    $navRight = $isLoggedIn
        ? '<a href="gallery.php" id="navGallery">Gallery</a>
           <a href="profile.php" id="navProfile">' . $navAvatar . '</a>
           <a href="logout.php" id="navLogout">Logout</a>'
        : '<a href="gallery.php" id="navGallery">Gallery</a>
           <a href="./registration.php" id="navLogin">Log in</a>';

    $statsHtml = '
        <div class="statCard">
            <i class="fa-solid fa-camera-retro statIcon"></i>
            <p class="statNum">' . number_format($totalPhotos) . '</p>
            <p class="statName">Photos</p>
            <p class="statDesc">Curated city moments shared by our community.</p>
        </div>
        <div class="statCard">
            <i class="fa-solid fa-city statIcon"></i>
            <p class="statNum">' . number_format($totalCities) . '</p>
            <p class="statName">Cities</p>
            <p class="statDesc">Destinations from every corner of the world.</p>
        </div>
        <div class="statCard">
            <i class="fa-solid fa-users statIcon"></i>
            <p class="statNum">' . number_format($totalUsers) . '</p>
            <p class="statName">Members</p>
            <p class="statDesc">Photographers capturing the world together.</p>
        </div>
        <div class="statCard">
            <i class="fa-solid fa-location-dot statIcon"></i>
            <p class="statNum">' . number_format($totalVisits) . '</p>
            <p class="statName">Visits</p>
            <p class="statDesc">Journeys logged across the globe.</p>
        </div>
    ';

    $featuredHtml = '';
    foreach ($featuredCities as $city) {
        $img = !empty($city['hero_image'])
            ? '<img src="../images/' . $city['hero_image'] . '" alt="' . $city['name'] . '">'
            : '<div class="featuredNoImage"></div>';
        $featuredHtml .= '
            <a class="featuredCard" href="city.php?id=' . $city['id'] . '">
                ' . $img . '
                <div class="featuredOverlay">
                    <p class="featuredContinent">' . $city['continent'] . '</p>
                    <p class="featuredName">' . $city['name'] . '</p>
                    <p class="featuredCountry">' . $city['country'] . '</p>
                    <span class="featuredCount">' . (int)$city['photo_count'] . ' photos</span>
                </div>
            </a>
        ';
    }

    $latestHtml = '';
    foreach ($latestPhotos as $photo) {
        $latestHtml .= '
            <div class="latestCard" onclick="openIndexPhoto(' . $photo['id'] . ')">
                <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
                <div class="latestOverlay">
                    <p class="latestTitle">' . $photo['title'] . '</p>
                    <p class="latestCity">' . $photo['city_name'] . '</p>
                </div>
            </div>
        ';
    }

    $latestJson = json_encode($latestPhotos);

    $ctaHtml = $isLoggedIn
        ? '<a href="gallery.php" class="ctaBtn">Explore the Gallery</a>'
        : '<a href="registration.php?mode=register" class="ctaBtn">Join Scenery</a>
           <a href="registration.php" class="ctaBtnGhost">Log in</a>';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery</title>
    <?php
        echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';
        echo '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">';
        echo '<link href="../css/index.css' . '?' . time() . '" rel="stylesheet">';
        echo '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>';
        echo '<script src="../js/index.js' . '?' . time() . '" defer></script>';
        echo '<script src="../js/map.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="navbar">
        <a href="index.php" id="navLogo">Scenery</a>
        <div id="navRight">
            <?php echo $navRight; ?>
        </div>
    </div>

    <div id="snapContainer">

        <section class="snapSection" id="heroSection">

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
                <p id="subtitle">The city is the story</p>
                <p id="clickHint">click to explore</p>
            </div>

            <div class="scrollCue"><i class="fa-solid fa-chevron-down"></i></div>

        </section>

        <section class="snapSection" id="statsSection">
            <div class="sectionInner">
                <p class="sectionLabel">In Numbers</p>
                <p class="sectionHeading">A Growing Community</p>
                <div id="statsGrid">
                    <?php echo $statsHtml; ?>
                </div>
            </div>
        </section>

        <section class="snapSection" id="featuredSection">
            <div class="sectionInner">
                <p class="sectionLabel">Featured</p>
                <p class="sectionHeading">Most Captured Cities</p>
                <div id="featuredGrid">
                    <?php echo $featuredHtml; ?>
                </div>
            </div>
        </section>

        <section class="snapSection" id="latestSection">
            <div class="sectionInner">
                <p class="sectionLabel">Fresh</p>
                <p class="sectionHeading">Latest Photos</p>
                <div id="latestGrid">
                    <?php echo $latestHtml; ?>
                </div>
            </div>
        </section>

        <section class="snapSection" id="mapSection">
            <div class="sectionInner">
                <p class="sectionLabel">Worldwide</p>
                <p id="mapTitle">Cities Around The World</p>
                <p id="mapSubtitle">See where our community has been</p>
                <div id="map"></div>
            </div>
        </section>

        <section class="snapSection" id="ctaSection">
            <div id="ctaInner">
                <p id="ctaTitle">Ready to explore?</p>
                <p id="ctaText">Discover the world through the lens of our community — one city at a time.</p>
                <div id="ctaBtns">
                    <?php echo $ctaHtml; ?>
                </div>
            </div>
            <footer id="footer">
                <div id="footerInner">
                    <a href="index.php" id="footerLogo">Scenery</a>
                    <p id="footerTagline">The city is the star.</p>
                    <div id="footerLinks">
                        <a href="gallery.php">Gallery</a>
                        <?php echo $isLoggedIn ? '<a href="profile.php">Profile</a>' : ''; ?>
                        <?php echo $isLoggedIn ? '<a href="logout.php">Logout</a>' : '<a href="registration.php">Login</a>'; ?>
                    </div>
                    <p id="footerCopy">© 2026 Scenery. All rights reserved.</p>
                </div>
            </footer>
        </section>

    </div>

    <div id="indexPhotoModal" class="hidden">
        <div id="indexPhotoOverlay" onclick="closeIndexPhoto()"></div>
        <div id="indexPhotoBox">
            <span id="indexPhotoClose" onclick="closeIndexPhoto()">✕</span>
            <div id="indexPhotoContent">
                <div id="indexPhotoLeft">
                    <img id="indexPhotoImg" src="" alt="">
                </div>
                <div id="indexPhotoRight">
                    <div class="pmHeader">
                        <p id="indexPhotoCity"></p>
                        <h2 id="indexPhotoTitle"></h2>
                        <p id="indexPhotoDesc"></p>
                    </div>
                    <div id="indexPhotoMeta"></div>
                    <div id="indexPhotoExif"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="zoomOverlay"></div>

    <script>
        <?php echo 'const latestPhotosData = ' . $latestJson . ';'; ?>
    </script>

</body>
</html>
