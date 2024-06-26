<?php
/**
 * Update User Status Endpoint
 *
 * This PHP script serves as an endpoint for updating a user's status.
 * It expects a POST request with JSON data containing the user ID and the new user status.
 * It updates the user's status in the database accordingly.
 *
 * HTTP Methods:
 * - POST: Updates the user's status and returns a JSON response indicating success or failure.
 *
 */

include '../../../../lasalle-calendar-env-variables/config.php';

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize the input
    $requestBody = file_get_contents('php://input');

    // Parse JSON data
    $requestData = json_decode($requestBody, true);

    // Check if JSON data was successfully parsed
    if ($requestData === null) {
        // JSON parsing failed
        http_response_code(400); // Bad Request
        echo json_encode(array("success" => false, "message" => "Invalid JSON data"));
        exit;
    }

    $userId = isset($requestData['userId']) ? htmlspecialchars($requestData['userId']) : null;
    $userStatus = isset($requestData['userStatus']) ? htmlspecialchars($requestData['userStatus']) : null;

    if ($userId === null || $userStatus === null) {
        error_log("Received meetingID: " . $_POST['meetingID']);
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "User ID or userStatus not provided"));
        exit;
    }

    $conn = new mysqli($db_host, $db_username, $db_password, $db_database);

    if ($conn->connect_error) {
        http_response_code(500); // Internal Server Error
        echo json_encode(array("success" => false, "message" => "Database connection error"));
        exit;
    }

    $switchActiveStatement = $conn->prepare('UPDATE users SET isActive = ? WHERE user_id = ?');
    $switchActiveStatement->bind_param("ii", $userStatus, $userId);

    if ($switchActiveStatement->execute()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "User Status Updated"));
        exit;
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "User Status Could Not Be Updated"));
        exit;
    }
} else {
    // Handle invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
