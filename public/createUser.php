<!DOCTYPE html>
<?php
session_start();
// If the user is not logged in redirect to the login page...
if (!isset($_SESSION['loggedin'])) {
header('Location: index.php');
exit;
}
if (isset($_SESSION['facility'])) {
if ($_SESSION['facility'] != 'LMC-ADMIN') {
header('Location: index.php');
exit;
}

}
?>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/signup.css">
    <link rel="stylesheet" href="css/formStyles.css">
    <link rel="stylesheet" href="./css/banner/banner2.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="./js/signupValidation.js" type="module"></script>
    <script src="./js/components/banner2.js" defer></script>
    <title>Sign Up</title>
  </head>

  <body>
    <script>
var sessionData = {
  email: "<?php echo htmlspecialchars($_SESSION['email'], ENT_QUOTES)?>",
};
</script>
    <div class="flex-wrap">
      <div id="navbarDiv">
        <?php include('navbar.php'); ?> <!-- Use require if it should error if navbar.php is not found -->
      </div>
      <div class="navbar" id="myNavbar"></div>
      <div class="content">
        <div id="signUp">
          <form action="../includes/signup.php" method="post" id="signupForm" class="modern_form">
            <h1 class="center_content">Create User</h1>
            <label for="facility">Facility:</label>
            <select required name="facility" id="facility" placeholder="facility">
              <option>Facility 1</option>
              <option>Facility 2</option>
              <option>Facility 3</option>
            </select>
            <label for="firstName">First Name:</label>
            <input type="text" name="firstName" id="firstName">
            <div id="firstNameError"></div>
            <label for="lastName">Last Name:</label>
            <input type="text" name="lastName" id="lastName">
            <div id="lastNameError"></div>
            <label for="phone">Phone:</label>
            <input required type="text" name="phone" id="phone" placeholder="(xxx) xxx-xxxx">
            <div id="phoneError"></div>
            <label for="email">Email:</label>
            <input required type="email" name="email" id="email" placeholder="example@test.com">
            <div id="emailError"></div>
            <label for="password">Password:
              <span class="password-tooltip"><i class="fas fa-info-circle"></i></span>
            </label>
            <input required type="password" name="password" id="password" placeholder="password123">
            <div id="passwordError"></div>
            <label for="confirmPassword">Confirm Password:</label>
            <input required type="password" name="confirmPassword" id="confirmPassword" placeholder="password123">
            <div id="confirmError"></div>
            <button type="submit">Create User</button>
            <div id="successMessage">
              <p>User Created</p>
              <p id="redirectText"></p>
            </div>
          </form>
        </div>
      </div>
      <div id="footerDiv">
        <?php include('footer.php'); ?> <!-- Use require if it should error if footer.php is not found -->
      </div>
    </div>
  </body>

</html>
