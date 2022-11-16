<!DOCTYPE html>
<html lang="nl">
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./styles.css">
    <link rel="stylesheet" href="./responsive.css">
    <script src="./node_modules/confetti-js-master/dist/index.min.js"></script>
    <script type="json" src="./memory_array/memory_array.json"></script>
    <script src="./spel.js"></script>
    <title>Spel</title>
</head>
<body>
    <!-- Head -->
    <div class="head">
        <div class="leaderboardButtonHTMl">
            <img src="images/leaderboard.png" onclick="showLeaderBoard();">
        </div>
        <div>
            <h1>Memory</h1>
            <p id="timerHTML">00:00:00</p>
        </div>
        <div class="highScore" id="highScore">
            <div><p id="recordMovesHTML">-</p></div>
            <div><p id="winsHTML">0</p></div>
            <div><p id="recordTimeHTML">-</p></div>
            <div><p id="pointsHTML">0</p></div>
        </div>
    </div>
    <div class="grid_container">
        <!-- Left -->
        <form class="settings" id="settings" action="#" onsubmit="startGame();return false">
            <div class="options">
                <div>
                    <label for="cardAmount"></label><input placeholder="Kaarten" type="number" name="cardAmount" id="cardAmount" min="2" max="70" step="2" value="20"/>
                        <label for="themeHTML"></label><select name="theme" id="themeHTML">
                        <option value="fruit">fruit</option>
                        <option value="superheld">superheld</option>
                        <option value="developer">developer</option>
                    </select>
                </div>
                <div>
                    <label for="playerAmountHTML"></label><input placeholder="Spelers" type="number" name="playerAmountHTML" id="playerAmountHTML" min="1" max="5" step="1" value="1"/><br/>
                    <input type="submit" value="Start">
                </div>
            </div>
            <div class="advancedOptionsHTML" id="advancedOptionsHTML"></div>
        </form>
        <!-- memory -->
        <div class="memoryHTML" id="memoryHTML">
            <ul id="memory_listHTML">
            </ul>
        </div>
        <!-- Right -->
        <div id="playersHTML" class="playersHTML"></div>
        <!-- Canvas -->
        <canvas id="confettiCanvasHTML"></canvas>
    </div>
</body>
</html>