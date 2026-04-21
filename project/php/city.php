<?php
    require_once "mysql.php";

    $city_id = $_GET['id'];

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
        $photoCards .= '
            <div class="photoCard" onclick="openModal(' . $photo['id'] . ')">
                <img src="../images/' . $photo['image_path'] . '" alt="' . $photo['title'] . '">
                <div class="photoOverlay">
                    <p class="photoTitle">' . $photo['title'] . '</p>
                </div>
            </div>
        ';
    }

    $photosJson = json_encode($photos);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery – <?php echo $city['name']; ?></title>
    <?php
        echo '<link href="../css/city.css' . '?' . time() . '" rel="stylesheet">';
        echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"></script>';
        echo '<script src="../js/script.js' . '?' . time() . '" defer></script>';
    ?>
</head>
<body>

    <div id="wrapper">

        <a href="gallery.php" id="backBtn">Back to Gallery</a>

        <div id="cityHero">
            <?php echo $heroImg; ?>
            <div id="cityHeroOverlay">
                <p id="cityContinent"><?php echo $city['continent']; ?></p>
                <h1 id="cityTitle"><?php echo $city['name']; ?></h1>
                <p id="cityCountry"><?php echo $city['country']; ?></p>
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

    <script>
        <?php echo 'const photos = ' . $photosJson . ';'; ?>
    </script>

</body>
</html>