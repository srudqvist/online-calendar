<?php
/**
 * Save Event Endpoint
 *
 * This PHP script serves as an endpoint for creating new events. It receives POST requests with form data containing event information.
 * It validates the received data, ensures that the facility information exists in the session, and inserts a new event record into the database if the data is valid.
 *
 * HTTP Methods:
 * - POST: Accepts POST requests containing form data for event creation.
 *
 * Request Data Parameters:
 * - eventName: The name of the event.
 * - dayFrom: The start day of the event.
 * - dayTo: The end day of the event.
 * - startTime: The start time of the event.
 * - endTime: The end time of the event.
 * - duration: The duration of the event.
 * - timeZone: The time zone of the event.
 * - meetingType: The type of the meeting.
 * - description: The description of the event.
 * - eventColor: The color code associated with the event.
 *
 * Response Format:
 * - JSON: Returns a JSON response indicating the success or failure of the event creation process.
 *
 */

include '../../../lasalle-calendar-env-variables/config.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    session_start();
    // Check if facility information exists in the session
    if(isset($_SESSION['facility'])) {
        // Retrieve facility from session
        $facility = $_SESSION['facility'];

        // Retrieve and sanitize form data
        $eventName = isset($_POST['eventName']) ? htmlspecialchars($_POST['eventName']) : null;
        $startDay = isset($_POST['dayFrom']) ? htmlspecialchars($_POST['dayFrom']) : null;
        $endDay = isset($_POST['dayTo']) ? htmlspecialchars($_POST['dayTo']) : null;
        $startTime = isset($_POST['startTime']) ? htmlspecialchars($_POST['startTime']) : null;
        $endTime = isset($_POST['endTime']) ? htmlspecialchars($_POST['endTime']) : null;
        $duration = isset($_POST['duration']) ? htmlspecialchars($_POST['duration']) : null;
        $timeZone = isset($_POST['timeZone']) ? htmlspecialchars($_POST['timeZone']) : null;
        $meetingType = isset($_POST['meetingType']) ? htmlspecialchars($_POST['meetingType']) : null;
        $description = isset($_POST['description']) ? htmlspecialchars($_POST['description']) : "";
        $color = isset($_POST['eventColor']) ? htmlspecialchars($_POST['eventColor']) : null;

        $eventInfo = array($facility, $eventName, $startDay, $endDay, $endTime, $duration, $timeZone, $meetingType, $color);

        foreach ($eventInfo as $value) {
            if ($value === null) {
                exit("Expected Data Was Not Provided");
            }
        }

        // Create a new MySQLi object
        $conn = new mysqli($db_host, $db_username, $db_password, $db_database);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        // Prepare SQL statement to insert data into the event_containers table
        $sql = "INSERT INTO event_containers (facility, event_name, start_day, end_day, start_time, end_time, duration, time_zone, meeting_type, description, color) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Prepare and bind parameters
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssssss", $facility, $eventName, $startDay, $endDay, $startTime, $endTime, $duration, $timeZone, $meetingType, $description, $color);

        // Execute the SQL statement
        if ($stmt->execute() === true) {
            $stmt->close();
            $conn->close();
            header("Location: ../public/eventContainers.php");
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Close statement and connection
        $stmt->close();
        $conn->close();
    } else {
        // Facility information not found in session
        echo json_encode(array("success" => false, "message" => "Facility information not found in session"));
    }
} else {
    // Handle invalid request method
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
