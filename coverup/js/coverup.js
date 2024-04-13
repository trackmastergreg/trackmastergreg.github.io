//open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

const digits = 5;
var min = Math.pow(10,digits-1);
var max = (min*10)-1;
var exclude = [];
var num = generateRandom(min, max, exclude);
var clue = 'Randomly generated number';
var answer = [];
var lastCell = [];
var lastValue = [];
var lastAnswer = [];
var attempts = 0;
var total = 0;

// Establish functionality on window ready
$(function() {
	var r = document.querySelector(':root');
	r.style.setProperty('--cols', digits);
	
	getData()
	.then((data) => {
		var n = generateRandom(0, data.length-1, '');
		num = data[n].stat;
		clue = data[n].desc;
		document.getElementById('clue').innerHTML += clue;
		console.log(num);
		displayGameBoard();
	});
    
});

// Load game data from external source
async function getData() {
	try {
		const response = await fetch('data.json');
		if (!response.ok) {
			throw new Error();
		}
		const data = await response.json();
		return data;
	}
	catch (error) {
		const data = JSON.parse('[{"stat":'+num+', "desc": "'+clue+'"}]');
		return data;
	}
}

// Build and display game board
function displayGameBoard() {
	var columns = [];
	for (var i = 0; i < digits; i++) {
		columns[i] = []; 
	}
	
	for (var i = 0; i < columns.length; ++i) {
		for (var j = 0; j < digits+1; ++j) {
			if (j >= digits-1-i) {
				if (i == 0) {
					exclude = 0;
				}
		        columns[i][j] = generateRandom(0,9,num.toString().substring(i,i+1)+","+columns[i].toString()+exclude);			
			}
			else {
				columns[i][j] = "";
			}
		}
		if (i >= 0) {
			columns[i][generateRandom(digits-1-i,digits,"")] = num.toString().substring(i,i+1);
		}
	}
    var insert = '<div class="board">';
	
    for (var i = 0; i < columns[digits-1].length; i++) {
        insert += '<div class="row" role="group" id="row'+i+'">';
	    for (var j = 0; j < columns.length; j++) {
			var cell = 'r'+i+'c'+j;
			var content = columns[j][i];
			var style = (content != "") ? 'cell' : '';
			insert += '<div onclick="coverUp(this,'+j+')" class="'+ style +'" id="'+cell+'">'+content+'</div>';
		}
		insert += '</div>';
    }
	
	style = 'cell answer';
	insert += '<hr/><div class="row" role="group" id="answer">';
    for (var i = 0; i < digits; i++) {
		insert += '<div onclick="unCover('+i+')" class="'+ style +'" role="group" id="a'+i+'">?</div>';
	}
	insert += '</div></div>';
    $('#game').append(insert);
}

// Select number from a column to cover up incorrect value in the answer row
function coverUp(div, col) {
	if (answer[col] != 'Y' && answer[col] != 'X' && div.innerHTML != "") {
		lastCell[col] = div.id;
		lastValue[col] = div.innerHTML;
		lastAnswer[col] = document.getElementById('a'+col).innerHTML;

		div.innerHTML = '';
		div.classList.add('empty');					
		document.getElementById('a'+col).innerHTML = lastValue[col];
		document.getElementById('a'+col).classList.remove('answer');					

		answer[col] = 'X';
	}
}

// Remove current value from the answer row to select a new number from column
function unCover(col) {
	if (answer[col] == 'X') {
		document.getElementById(lastCell[col]).innerHTML = lastValue[col];
		document.getElementById(lastCell[col]).classList.remove('empty');
		
		document.getElementById('a'+col).innerHTML = lastAnswer[col];
		if (attempts == 0) {
			document.getElementById('a'+col).classList.add('answer');				
		}
		answer[col] = '';
	}
}

// Check if the current guess is correct
function checkGuess() {
	if (countGuess() == 5 && total != digits && total >= 0)
	{
		for (var i = 0; i < digits; i++) {
			answer[i] = (document.getElementById('a'+i).innerHTML == num.toString().substring(i,i+1)) ? 'Y' : 'N';
			if (answer[i] == "Y") {
				document.getElementById('a'+i).classList.add('highlight');
			}
		}
		var q = countCorrect();
		if (q > total) {
			++attempts;
			total = q;
		} else {
			total = -1;
		}
		if (total == digits) {
			alert("Congrats! You won the game in " + attempts + " turns");
			document.getElementById('guess').innerHTML = 'CORRECT!';
		} else if (total < 0) {
			alert("Sorry, the correct answer was " + num + "\nPlease try again next time");
			document.getElementById('guess').innerHTML = 'GAME OVER';
		}
	}
}

// Make sure all columns have valid guesses
function countGuess() {
	for (var i = 0, guess = 0; i < digits; i++) {
		if (answer[i] != "" && answer[i] != "N" && answer[i] !== undefined) {
			++guess;
		}
	}
	return (guess);
}

// Count number of correctly guessed values
function countCorrect() {
	for (var i = 0, correct = 0; i < digits; i++) {
		if (answer[i] == "Y") {
			++correct;
		}
	}
	return (correct);
}

// Random number generator, option to exclude certain values
function generateRandom(min, max, exclude) {
  let random;
  while (random === undefined) {
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    if (exclude.indexOf(x) === -1) random = x;
  }
  return random;
}
