<?php

$difficulty = $_REQUEST["d"];
$difficulty = intval($difficulty);

$returnObj = [];

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM `memory_moves_lb` WHERE `difficulty` = $difficulty ORDER BY `moves` ASC, `ID` ASC");
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($returnObj, (object) [
            $row
        ]);
    }
    echo json_encode($returnObj);
}