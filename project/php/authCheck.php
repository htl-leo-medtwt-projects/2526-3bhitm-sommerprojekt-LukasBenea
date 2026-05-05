<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (
    empty($_SESSION['login']) ||
    $_SESSION['login'] !== 1 ||
    empty($_SESSION['user_id'])
) {
    header("Location: registration.php");
    exit;
}

?>