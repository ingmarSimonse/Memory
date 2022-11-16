let guessCheck;
let cardSave;
let cardSaveArray = [];
let memoryCardsShuffled;
let moves;
let confettiSettings;
let confetti;
let timerHTML;
let memoryHTML;
let memory_listHTML;
let playersHTML;
let playerAmount;
let playerAmountHTML;
let playerTurn;
let playerStats = [];
let playerTurnN;
let themeHTML;
let confettiCanvasHTML;
let advancedOptionsHTML;
let pointsHTML;
let winsHTML;
let recordTimeHTML;
let recordMovesHTMl;
let points;
let wins;
let recordTime;
let recordMoves;
let allMoves;
let highScoreHTML;
let cardAmount;
function playOnClickSound() {
    new Audio('./sound/onclick.mp3').play().then(() => true);
}
function playPositiveSound() {
    new Audio('./sound/positive.mp3').play().then(() => true);
}
function playGameWinSound() {
    new Audio('./sound/game_win.mp3').play().then(() => true);
}
let colorArray = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple', 'pink', 'salmon'];

window.onload = function() {
    pointsHTML = document.getElementById('pointsHTML');
    advancedOptionsHTML = document.getElementById('advancedOptionsHTML');
    playerAmountHTML = document.getElementById('playerAmountHTML');
    themeHTML = document.getElementById('themeHTML');
    winsHTML = document.getElementById('winsHTML');
    recordTimeHTML = document.getElementById('recordTimeHTML');
    recordMovesHTMl = document.getElementById('recordMovesHTML');
    highScoreHTML = document.getElementById('highScore');
    cardAmount = document.getElementById('cardAmount');
    // Set up cookies
    points = checkCookie('memory_points');
    pointsHTML.innerHTML = points;
    wins = checkCookie('memory_wins');
    winsHTML.innerHTML = wins;
    recordTime = checkCookie('memory_time_' + cardAmount.value);
    if (recordTime === 0) {
        recordTimeHTML.innerHTML = '-';
    } else {
        recordTimeHTML.innerHTML = setUpTimer(recordTime);
    }
    recordMoves = checkCookie('memory_moves_' + cardAmount.value);
    if (recordMoves === 0) {
        recordMovesHTMl.innerHTML = '-';
    } else {
        recordMovesHTMl.innerHTML = recordMoves;
    }
    cardAmount.onchange = function() {
        recordTime = checkCookie('memory_time_' + cardAmount.value);
        recordMoves = checkCookie('memory_moves_' + cardAmount.value);
        if (recordMoves === 0) {
            recordMovesHTMl.innerHTML = '-';
        } else {
            recordMovesHTMl.innerHTML = recordMoves;
        }
        if (recordTime === 0) {
            recordTimeHTML.innerHTML = '-';
        } else {
            recordTimeHTML.innerHTML = setUpTimer(recordTime);
        }
    }
    // High score Hover
    highScoreHTML.onmouseover = function() {
        highScoreHTML.style.fontWeight = 'normal';
        pointsHTML.innerHTML = 'kaarten';
        winsHTML.innerHTML = 'overwinningen';
        recordTimeHTML.innerHTML = 'beste tijd';
        recordMovesHTMl.innerHTML = 'beste pogingen';
    }
    highScoreHTML.onmouseout = function() {
        highScoreHTML.style.fontWeight = 'bold';
        pointsHTML.innerHTML = points;
        winsHTML.innerHTML = wins;
        if (recordTime === 0) {
            recordTimeHTML.innerHTML = '-';
        } else {
            recordTimeHTML.innerHTML = setUpTimer(recordTime);
        }
        if (recordMoves === 0) {
            recordMovesHTMl.innerHTML = '-';
        } else {
            recordMovesHTMl.innerHTML = recordMoves;
        }
    }
    // Set up PlayerStats
    for (let i = 1; i <= 5; i++) {
        playerStats.push({
            'playerID': i,
            'playerName': i,
            'playerColor': colorArray[i - 1],
            'playerMoves': 0,
            'playerCards': 0
        });
    }
    // Set up Theme OnChange change max amount of cards
    themeHTML.onchange = function() {
        readTextFile('./memory_array/memory_array.json', function(text) {
            const data = JSON.parse(text);
            const array = data[themeHTML.value];
            if (array.length * 2 > 72) {
                cardAmount.max = 72;
            } else {
                cardAmount.max = (array.length * 2);
            }
        });
    }
    // Set up advanced Options (name / color)
    // Set up options player1 on reload
    advancedOptionsHTML.innerHTML =
        '<div><label for="playerNameHTML' + 1 + '"></label><input onchange="changeName(this, ' + 1 + ')" type="text" maxlength="6" name="playerNameHTML" id="playerNameHTML' + 1 + '" value="' + playerStats[0]['playerName'] + '"/>' +
        '<label for="colorHTML' + 1 + '"></label><select onchange="changeColor(this, this.id, ' + 1 + ')" name="colorHTML" id="colorHTML' + 1 + '">' +
        '</select></div>';
    colorArraySetUP(1);
    document.getElementById('colorHTML' + 1).options.selectedIndex = 1 - 1;
    selectedBackgroundColor('colorHTML' + 1);
    playerAmountHTML.onchange = function() {
        // Set up advanced options
        advancedOptionsHTML.innerHTML = '';
        for (let i = 1; i <= playerAmountHTML.value; i++) {
            advancedOptionsHTML.innerHTML +=
                '<div><label for="playerNameHTML' + i + '"></label><input onchange="changeName(this, ' + 1 + ')" type="text" maxlength="6" name="playerNameHTML" id="playerNameHTML' + i + '" value="' + playerStats[i - 1]['playerName'] + '"/>' +
                '<label for="colorHTML' + i + '"></label><select onchange="changeColor(this, this.id, ' + i + ')" name="colorHTML" id="colorHTML' + i + '">' +
                '</select></div>';
            colorArraySetUP(i);
            document.getElementById('colorHTML' + (i)).selectedIndex = colorArray.indexOf(playerStats[i- 1]['playerColor']);
            selectedBackgroundColor('colorHTML' + i);
        }
    };
}

function colorArraySetUP(i) {
    // Set up options in array
    for (let x = 0; x < colorArray.length; x++) {
        document.getElementById('colorHTML' + i).innerHTML +=
            '<option value="' + colorArray[x] + '" style="background-color: ' + getColorVar(x) + ';"></option>';
    }
}

function getColorVar(i) {
    return 'var(--' + colorArray[i] + '-player)';
}

function changeName(i, n) {
    playerStats[n - 1]['playerName'] = i.value;
}

function changeColor(i, id, n) {
    playerStats[n - 1]['playerColor'] = i.value;
    selectedBackgroundColor(id);
}

function selectedBackgroundColor(id) {
    const selected = document.getElementById(id);
    selected.style.backgroundColor = selected.options[selected.selectedIndex].style.backgroundColor;
}

function startGame() {
    // Set values to 0
    for (let i = 0; i < playerStats.length; i++) {
        playerStats[i]['playerMoves'] = 0;
        playerStats[i]['playerCards'] = 0;
    }
    document.getElementById('playersHTML').style.zIndex = '11';
    document.getElementById('settings').style.zIndex = '11';
    confettiCanvasHTML = document.getElementById('confettiCanvasHTML');
    playerAmount = playerAmountHTML.value;
    playersHTML = document.getElementById('playersHTML');
    memoryHTML = document.getElementById('memoryHTML');
    memory_listHTML = document.getElementById('memory_listHTML');
    confettiCanvasHTML.style.zIndex = '-1';
    guessCheck = 0;
    allMoves = 0;
    playerTurn = 1;
    cardSaveArray = [];
    cardSave = null;
    memory_listHTML.innerHTML = '';
    moves = 0;
    // Confetti
    confettiSettings = {
        target: confettiCanvasHTML,
        max: 1000,
        size: 1.2,
        respawn: false,
        clock: 60,
        start_from_edge: true,
        rotate: true,
        width: (document.body.clientWidth / 100 * 80),
        height: document.body.clientHeight
    };
    confetti = new ConfettiGenerator(confettiSettings);
    // Timer
    timerHTML = document.getElementById('timerHTML');
    timerHTML.innerHTML = '00:00:00';
    if (stopTime) {
        setTimeout(() => {
            startTimer();
        }, 1);
    } else {
        resetTimer();
    }
    //JSON
    readTextFile('./memory_array/memory_array.json', function(text) {
        let i;
        const data = JSON.parse(text);
        const array = data[themeHTML.value];
        memoryCardsShuffled = setUpArray(array);
        // // memoryCardsShuffled = data; // Test version

        // Set up the game
        memoryHTML.className = 'memoryHTML';
        memory_listHTML.className = '';
        let x = memoryCardsShuffled.length;
        const w = window.matchMedia("(max-width: 700px)");
        if (w.matches) {
            switch(true) {
                //flexible grid
                case (x < 7):
                    memory_listHTML.classList.add('grid2');
                    break;
                case (x < 9):
                    memory_listHTML.classList.add('grid3');
                    break;
                case (x < 13):
                    memory_listHTML.classList.add('grid3');
                    break;
                case (x < 21):
                    memory_listHTML.classList.add('grid4');
                    break;
                case (x < 35):
                    memory_listHTML.classList.add('grid5');
                    break;
                case (x < 43):
                    memory_listHTML.classList.add('grid6');
                    break;
                case (x < 73):
                    memory_listHTML.classList.add('grid7');
                    break;
            }
        } else {
            switch(true) {
                //flexible grid
                case (x === 2):
                    memory_listHTML.classList.add('grid2');
                    break;
                case (x === 6):
                    memory_listHTML.classList.add('grid3');
                    memory_listHTML.classList.add('width80');
                    break;
                case (x < 9):
                    memory_listHTML.classList.add('grid4');
                    break;
                case (x === 10):
                    memory_listHTML.classList.add('grid5');
                    break;
                case (x < 15):
                    memory_listHTML.classList.add('grid5');
                    memory_listHTML.classList.add('width80');
                    break;
                case (x < 19):
                    memory_listHTML.classList.add('grid6');
                    break;
                case (x < 21):
                    memory_listHTML.classList.add('grid7');
                    break;
                case (x < 33):
                    memory_listHTML.classList.add('grid8');
                    break;
                case (x < 45):
                    memory_listHTML.classList.add('grid9');
                    break;
                case (x < 51):
                    memory_listHTML.classList.add('grid10');
                    break;
                case (x < 67):
                    memory_listHTML.classList.add('grid11');
                    break;
                case (x < 73):
                    memory_listHTML.classList.add('grid12');
                    break;
            }
        }

        // Set up memory html
        for (i = 0; i < memoryCardsShuffled.length; i++) {
            memory_listHTML.innerHTML += '<li id="' + memoryCardsShuffled[i]['id'] + '" onclick="memoryCheck(this);"><div><img src="./images/memory_cards/' + themeHTML.value + '/' + memoryCardsShuffled[i]['src'] + '" alt=""/><img alt=""/></div></li>';
        }
        // Set up players html
        playersHTML.innerHTML = '';
        for (i = 0; i < playerAmount; i++) {
            playersHTML.innerHTML +=
                '<div id="player' + (i + 1) + '" class="playerHTML ' + playerStats[i]['playerColor'] + '-player"><b>' + playerStats[i]['playerName'] +'</b>' +
                '<div id="playerMovesHTML' + (i + 1) + '">0</div>' +
                '<div id="playerCardsHTML' + (i + 1) + '">0</div></div>';
        }
        document.getElementById('player1').classList.add('active');
        // Hover player
        for (i = 0; i < playerAmount; i++) {
            (function(i) {
                document.getElementById('player' + (i + 1)).onmouseover = function() {
                    document.getElementById('playerCardsHTML' + (i + 1)).innerHTML = 'Kaarten: ' + playerStats[i]['playerCards'];
                    document.getElementById('playerMovesHTML' + (i + 1)).innerHTML = 'Pogingen: ' + playerStats[i]['playerMoves'];
                }
                document.getElementById('player' + (i + 1)).onmouseout = function() {
                    document.getElementById('playerCardsHTML' + (i + 1)).innerHTML = playerStats[i]['playerCards'];
                    document.getElementById('playerMovesHTML' + (i + 1)).innerHTML = playerStats[i]['playerMoves'];
                }
            })(i);
        }
    });
}

// Onclick
function memoryCheck(card) {
    // Check if the card is the same clicked twice or if has already been revealed.
    if (!cardSaveArray.includes(card) && card !== cardSave) {
        guessCheck++;
        if (guessCheck === 1) {
            // First guess
            playOnClickSound();
            cardSave = card;
            card.classList.add('active');
        } else if (guessCheck === 2) {
            // Second guess
            playOnClickSound();
            if (parseInt(cardSave.id) === (card.id - 100) || (cardSave.id - 100) === parseInt(card.id)) {
                // The cards where the same
                cardSaveArray.push(card);
                cardSaveArray.push(cardSave);
                card.classList.add(playerStats[playerTurn - 1]['playerColor'] + '-card');
                cardSave.classList.add(playerStats[playerTurn - 1]['playerColor'] + '-card');
                guessCheck = 0;
                cardSave = null;
                playerStats[playerTurn - 1]['playerCards'] += 2;
                document.getElementById('playerCardsHTML' + playerTurn).innerHTML = playerStats[playerTurn - 1]['playerCards'];
                playerTurnN = true;
                if (memoryCardsShuffled.length === cardSaveArray.length) {
                    //The game is over
                    setTimeout(function() {
                        confettiCanvasHTML.style.zIndex = '10';
                        confetti.render();
                        playGameWinSound();
                        stopTimer();
                        // high score / cookies
                        for (let i = 0; i < playerAmount; i++) {
                            points += playerStats[i]['playerCards'];
                            allMoves += playerStats[i]['playerMoves'];
                        }
                        wins++;
                        // Cookies
                        makeCookie('memory_wins', wins, 365);
                        makeCookie('memory_points', points, 365);
                        if (parseInt(readCookie('memory_moves_' + cardSaveArray.length)) > allMoves || parseInt(readCookie('memory_moves_' + cardSaveArray.length)) === 0) {
                            makeCookie('memory_moves_' + cardSaveArray.length, allMoves, 365);
                            recordMovesHTMl.innerHTML = allMoves;
                        }
                        let memory_time_int = parseInt(readCookie('memory_time_' + cardSaveArray.length));
                        if (memory_time_int === 0 || memory_time_int > elapsedTime) {
                            makeCookie('memory_time_' + cardSaveArray.length, elapsedTime);
                            recordTimeHTML.innerHTML = hr + ':' + min + ':' + sec;
                        }
                        // Database stuff
                        const xhttp = new XMLHttpRequest();
                        xhttp.onload = function() {
                            console.log(this.response);
                        }
                        xhttp.open('GET', './php/checkMovesDb.php?d=' + cardSaveArray.length + '&m=' + allMoves + '&n=' + playerStats[0]['playerName']);
                        xhttp.send();

                        pointsHTML.innerHTML = points;
                        winsHTML.innerHTML = wins;
                    }, 250);
                } else {
                    setTimeout(function() {
                        playPositiveSound();
                    }, 300);
                }
            } else {
                // The cards where different
                setTimeout(function() {
                    card.classList.remove('active');
                    cardSave.classList.remove('active');
                    guessCheck = 0;
                    cardSave = null;
                }, 1000);
            }
            card.classList.add('active');
            //playerTurn/Moves
            playerStats[playerTurn - 1]['playerMoves']++;
            document.getElementById('playerMovesHTML' + playerTurn).innerHTML = playerStats[playerTurn - 1]['playerMoves'];
            playerTurn++;
            if (playerTurnN) {
                playerTurn--;
                playerTurnN = false;
            }
            if (playerTurn > (playerAmount)) {
                playerTurn = 1;
            }
            for (let i = 1; i <= playerAmount; i++) {
                document.getElementById('player' + i).classList.remove('active');
            }
            document.getElementById('player' + playerTurn).classList.add('active');
        }
    }
}

//Onclick show leaderboard
function showLeaderBoard() {
    memory_listHTML = document.getElementById('memory_listHTML');
    memory_listHTML.className = '';
    timerHTML = document.getElementById('timerHTML');
    timerHTML.innerHTML = '00:00:00';
    stopTimer();
    resetTimer();
    // get lb database
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        let response = this.response;
        let parsedResponse = JSON.parse(response);
        // Set up leaderboard
        memory_listHTML.innerHTML = `<p> ${cardAmount.value} </p>`;
        for (let i = 0; i < 10; i++) {
            memory_listHTML.innerHTML += `<p> ${(i + 1)}: ${parsedResponse[i][0]['name']} - ${parsedResponse[i][0]['moves']} </p>`;
        }
    }
    xhttp.open('GET', './php/getLeaderboard.php?d=' + cardAmount.value);
    xhttp.send();
}

// Set up the array
function setUpArray(array) {
    let i;
    // max amount array
    const maxArray = cardAmount;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    array = array.splice(0, ((maxArray.value / 2)));
    // set src and id
    for (i = 0; i < array.length; i++) {
        array[i]['id'] = i;
        array[i]['src'] = array[i]['name'] + '.png';
    }
    const array1 = JSON.parse(JSON.stringify(array));
    // Set up duplicate items
    for (i = 0; i < array1.length; i++) {
        array1[i]['name'] = array[i]['name'] + 1;
        array1[i]['id'] = array[i]['id'] + 100;
    }
    array.push(...array1);
    // Shuffle array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Timer
let hr = 0;
let min = 0;
let sec = 0;
let startTime;
let stopTime = true;
let elapsedTime;

function startTimer() {
  if (stopTime === true) {
      startTime = Date.now();
      stopTime = false;
        timerCycle();
    }
}
function stopTimer() {
  if (stopTime === false) {
      stopTime = true;
  }
}

function resetTimer() {
    timerHTML.innerHTML = '00:00:00';
    startTime = Date.now();
}

function timerCycle() {
    if (stopTime === false) {
        elapsedTime = Date.now() - startTime;
        timerHTML.innerHTML = setUpTimer(elapsedTime);
        setTimeout('timerCycle()', 100);
  }
}

function setUpTimer(time) {
    sec = formatLimit2Decimals(time / 1000);
    min = formatLimit2Decimals(sec / 60);
    hr = formatLimit2Decimals(min / 60);
    sec = sec - (min * 60);
    min = min - (hr * 60);

    if (sec < 10 || sec === 0) {
        sec = '0' + sec;
    }
    if (min < 10 || min === 0) {
        min = '0' + min;
    }
    if (hr < 10 || hr === 0) {
        hr = '0' + hr;
    }

    return hr + ':' + min + ':' + sec;
}

function formatLimit2Decimals(value) {
    const parts = value.toString().split('.');

    if (parts.length === 2) {
        return Number([parts[0], parts[1].slice(0, 0)].join('.'));
    } else {
        return Number(parts[0]);
    }
}

// JSON
function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// Cookie Functions
function makeCookie(name, value, days) {
    let expiredDate;
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expiredDate = "; expires= " + date.toUTCString();
    } else {
        expiredDate = "";
    }
    document.cookie = name + "=" + value + expiredDate + "; path=/";
}

function readCookie(name) {
    const nameCookie = name + "=";
    const cookieArray = document.cookie.split("; ");
    for (let i = 0; i < cookieArray.length; i++) {
        let thisCookie = cookieArray[i];
        thisCookie = thisCookie.trim();
        if (thisCookie.indexOf(nameCookie) === 0) {
            return thisCookie.substring(nameCookie.length, thisCookie.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    name = name + "=" + name;
    const cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        const thisCookieArray = cookieArray[i].trim().split("|");
        if (thisCookieArray[0] === name) {
            makeCookie(thisCookieArray[0], "", -1);
        }
    }
}

function checkCookie(cookie) {
    if (readCookie(cookie) === null) {
        makeCookie(cookie, 0, 365);
        return 0;
    } else {
        return parseInt(readCookie(cookie));
    }
}