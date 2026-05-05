<?php

session_start();
require_once "mysql.php";

$sql = "SELECT * FROM cities";
$result = $conn->query($sql);
$cities = mysqli_fetch_all($result, MYSQLI_ASSOC);
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

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery</title>
    <?php
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
                <div id="topBar">
                    <input type="text" id="searchInput" placeholder="Search ...">
                    <div id="filterBar">
                        <span id="filterBtn">Filter</span>
                        <span id="addBtn">+ Add</span>
                    </div>
                </div>
                <div id="grid" data-masonry='{"itemSelector": ".cityCard", "columnWidth": ".cityCard", "gutter": 20}'>
                    <?php echo $cityCards; ?>
                </div>
            </div>

        </div>

    </div>

</body>
</html>