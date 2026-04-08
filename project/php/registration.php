<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
     <?php
        echo '<link    href="../css/registration.css'   . '?' . time() . '" rel="stylesheet">';
        echo '<script  src="../js/script.js'    . '?' . time() . '" defer></script>';
    ?>
</head>
<body>
    <div id="wrapper">


        <div id="photoCard">

            <div id="loginBox">
                
                <img id="klebeband" src="../images/klebeband.png" alt="">    

                <img id="accountIcon" src="../images/account_Icon.png" alt="icon">
        

                <div class="inputBox">
                    <p>email :</p>
                    <input type="text">
                </div>

                <div class="inputBox">
                    <p>password :</p>
                    <input type="password">
                </div>
            </div>
            

            <div id="bottomText">
                <p>Don't have an account?</p>
            </div>

        </div>

       

    

</div>
</body>
</html>