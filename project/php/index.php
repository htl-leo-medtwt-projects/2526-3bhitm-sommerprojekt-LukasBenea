<?php
    session_start();

    $isLoggedIn = isset($_SESSION['login']) && $_SESSION['login'] === 1;

    $navRight = $isLoggedIn
        ? '<a href="profile.php" id="navProfile"><img src="../images/account_Icon.png" alt="account"></a>
        <a href="logout.php" id="navLogout">Logout</a>'
        : '<a href="./registration.php" id="navLogin">Log in</a>';

    $infoCards = '
        <div class="infoCard">
            <p class="infoTitle">Discover Cities</p>
            <p class="infoText">Explore stunning photography from cities around the world, curated by our community.</p>
        </div>
        <div class="infoCard">
            <p class="infoTitle">Share Your Shots</p>
            <p class="infoText">Upload your best city photos and let the world see your perspective.</p>
        </div>
        <div class="infoCard">
            <p class="infoTitle">Tag & Filter</p>
            <p class="infoText">Find exactly what you are looking for with our powerful tag and filter system.</p>
        </div>
        <div class="infoCard">
            <p class="infoTitle">Like & Collect</p>
            <p class="infoText">Save your favourite shots and build your personal city collection.</p>
        </div>
    ';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery</title>
    <?php
        echo '<link href="../css/index.css' . '?' . time() . '" rel="stylesheet">';
        echo '<script src="../js/index.js' . '?' . time() . '" defer></script>';
        echo '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">';
        echo '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>';
        echo '<script src="../js/map.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="wrapper">

        <div id="navbar">
            <a href="index.php" id="navLogo">Scenery</a>
            <div id="navRight">
                <?php echo $navRight; ?>
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
                <p id="subtitle">The city is the story</p>
                <p id="clickHint">click to explore</p>
            </div>

        </div>

        <div id="infoSection">
            <div id="infoGrid">
                <?php echo $infoCards; ?>
            </div>
        </div>

        <div id="mapSection">
            <div id="mapInner">
                <p id="mapTitle">Cities Around The World</p>
                <p id="mapSubtitle">See where our community has been</p>
                <div id="map"></div>
            </div>
        </div>

    </div>

    <div id="zoomOverlay"></div>

</body>
</html>
