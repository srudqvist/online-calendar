<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login.css">
    <title>Sign Up</title>
</head>

<body>
    <div id="navbarDiv">
        <?php include('navbar.php'); ?> <!-- Use require if it should error if navbar.php is not found -->
    </div>

    <div id="loginForm">
        <form action="/includes/signup.php" method="post" class="modern_form">
            <label for="facility">Facility:</label>
            <select required name="facility" id="facility" placeholder="facility">
                <option>Facility 1</option>
                <option>Facility 2</option>
                <option>Facility 3</option>
            </select>
            <label for="phone">Phone:</label>
            <input required type="text" name="phone" id="email" placeholder="1234567890">
            <label for="email">Email:</label>
            <input required type="email" name="email" id="email" placeholder="example@test.com">
            <label for="password">Password:</label>
            <input required type="password" name="password" id="password" placeholder="password123">
            <button type="submit">Sign Up</button>
            <div id="createForgot">
                <p>Already have an account? <a href="index.php">Log In</a></p>
            </div>
        </form>
    </div>
    <?php include('footer.php'); ?> <!-- Use require if it should error if footer.php is not found -->
</body>

</html>