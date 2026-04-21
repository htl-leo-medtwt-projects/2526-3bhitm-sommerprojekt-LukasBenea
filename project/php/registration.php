<?php
    session_start();

    $mode = "login";
    if (isset($_GET["mode"]) && $_GET["mode"] === "register") {
        $mode = "register";
    }

    require_once "mysql.php";

    $error = "";
    $success = "";

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $postMode = $_POST["mode"] ?? "";
        $user = trim($_POST["user"] ?? "");
        $pass = $_POST["password"] ?? "";

        if ($postMode === "register") {
            $pass2 = $_POST["password2"] ?? "";

            if ($pass !== $pass2) {
                $error = "Passwords do not match!";
            } else {
                $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
                $stmt->bind_param("ss", $user, $user);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->fetch_assoc()) {
                    $error = "User already exists!";
                } else {
                    $hashedPassword = password_hash($pass, PASSWORD_BCRYPT);
                    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $user, $user, $hashedPassword);
                    $stmt->execute();
                    $success = "Registration successful! You can now log in.";
                }
            }
        } elseif ($postMode === "login") {
            $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $user, $user);
            $stmt->execute();
            $result = $stmt->get_result();
            $dbUser = $result->fetch_assoc();

            if ($dbUser && password_verify($pass, $dbUser["password"])) {
                $_SESSION["user_id"] = $dbUser["id"];
                $_SESSION["username"] = $dbUser["username"];
                $_SESSION["login"] = 1;
                header("Location: gallery.php");
                exit();
            } else {
                $error = "Wrong username or password!";
            }
        }
    }

    $conn->close();

    $errorHtml = !empty($error)
        ? '<div class="message error">' . htmlspecialchars($error) . '</div>'
        : '';

    $successHtml = !empty($success)
        ? '<div class="message success">' . htmlspecialchars($success) . '</div>'
        : '';

    $password2Field = $mode === "register"
        ? '<div class="inputBox"><input type="password" name="password2" placeholder="Repeat Password"></div>'
        : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scenery – Login</title>
    <?php
        echo '<script src="../js/registration.js' . '?' . time() . '" defer></script>';

        echo '<link href="../css/registration.css' . '?' . time() . '" rel="stylesheet">';
    ?>
</head>
<body>

    <a href="gallery.php" id="logoLink">Scenery</a>

    <div id="wrapper">

        <div id="photoCard">

            <img id="klebeband" src="../images/klebeband.png" alt="">

            <div id="tabs">
                <span class="tab <?php echo $mode === 'login' ? 'active' : ''; ?>" id="loginTab">Login</span>
                <span class="tab <?php echo $mode === 'register' ? 'active' : ''; ?>" id="registerTab">Register</span>
            </div>

            <div id="loginBox">
                <img id="accountIcon" src="../images/account_Icon.png" alt="icon">

                <?php echo $errorHtml; ?>
                <?php echo $successHtml; ?>

                <form method="POST" id="form">
                    <input type="hidden" name="mode" value="<?php echo $mode; ?>">

                    <div class="inputBox">
                        <p>Username or Email</p>
                        <input type="text" name="user" required>
                    </div>

                    <div class="inputBox">
                        <p>Password</p>
                        <input type="password" name="password" required>
                    </div>

                    <?php echo $password2Field; ?>

                    <button type="submit" id="submitBtn">
                        <?php echo $mode === 'login' ? 'Log in' : 'Register'; ?>
                    </button>

                </form>

            </div>

            <div id="bottomText">
                <?php if ($mode === 'login'): ?>
                    <p>Don't have an account? <a href="registration.php?mode=register">Sign up</a></p>
                <?php else: ?>
                    <p>Already have an account? <a href="registration.php?mode=login">Log in</a></p>
                <?php endif; ?>
            </div>

        </div>

    </div>

</body>
</html>