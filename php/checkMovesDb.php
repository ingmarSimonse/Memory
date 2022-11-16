<?php

$difficulty = $_REQUEST["d"];
$difficulty = intval($difficulty);
$moves = $_REQUEST["m"];
$moves = intval($moves);
$name = $_REQUEST["n"];
$name = strval($name);


// Create connection
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$i = 0;
$saveID = "";

$result = $conn->query("SELECT * FROM `memory_moves_lb` WHERE `difficulty` = $difficulty ORDER BY `moves` DESC, `ID` ASC");
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($moves < intval($row["moves"])) {
            if ($i === 0) {
                // Save id of the lowest score
                $saveID = intval($row['ID']);
            } elseif ($i === 9) {
                insertNewLbScore($conn, $difficulty, $name, $moves, $saveID);
            }
        } elseif ($i === 0) {
            // Doesn't get on the leaderboard
            echo false;
            break;
        } else {
            insertNewLbScore($conn, $difficulty, $name, $moves, $saveID);
            break;
        }
        $i++;
    }
}

function insertNewLbScore($conn, $difficulty, $name, $moves, $saveID) {
    // Insert new leaderboard score
    $conn->query("INSERT INTO `memory_moves_lb` (`ID`, `difficulty`, `name`, `moves`) VALUES (NULL, $difficulty, '$name', $moves)");
    // Delete lowest leaderboard score
    $conn->query("DELETE FROM `memory_moves_lb` WHERE `ID` = $saveID");
}