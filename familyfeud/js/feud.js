// This script simulates a family feud game
var score = 0;
var data = [
{"round": 1, "question": "Name a vegetable Aaron likes to eat...", "survey": [ 
    {"rank": 1, "answer": "Sweet Potato", "points": 35},
    {"rank": 2, "answer": "Spinach", "points": 30},
    {"rank": 3, "answer": "Zucchini/Squash", "points": 15},
    {"rank": 4, "answer": "Pumpkin", "points": 10},
    {"rank": 5, "answer": "Beets", "points": 10}] 
},

{"round": 2, "question": "Name a reason a baby might cry...", "survey": [ 
    {"rank": 1, "answer": "Hungry", "points": 25},
    {"rank": 2, "answer": "Dirty Diaper", "points": 20},
    {"rank": 3, "answer": "Tired", "points": 15},
    {"rank": 4, "answer": "Teething", "points": 15},
    {"rank": 5, "answer": "Sick/Upset Tummy", "points": 10},
    {"rank": 6, "answer": "Too Hot/Cold", "points": 10},
    {"rank": 7, "answer": "Falls/Bumps Head", "points": 5}]
},

{"round": 3, "question": "Name one of Aaron’s favorite toys to play with...", "survey": [ 
    {"rank": 1, "answer": "Activity Table", "points": 40},
    {"rank": 2, "answer": "Dump Truck", "points": 20},
    {"rank": 3, "answer": "Walker", "points": 15},
    {"rank": 4, "answer": "Fake Food", "points": 10},
    {"rank": 5, "answer": "Piano/Instrument", "points": 10},
    {"rank": 6, "answer": "Giraffes", "points": 5}]
},

{"round": 4, "question": "Name a milestone event that happened during Aaron’s first year...", "survey": [ 
    {"rank": 1, "answer": "First step", "points": 25},
    {"rank": 2, "answer": "Crawling", "points": 15},
    {"rank": 3, "answer": "Rolling over", "points": 10},
    {"rank": 4, "answer": "First Tooth", "points": 10},
    {"rank": 5, "answer": "Smile/Laugh", "points": 10},
    {"rank": 6, "answer": "Clapping", "points": 10},
    {"rank": 7, "answer": "Standing up", "points": 10},
    {"rank": 8, "answer": "Sitting up", "points": 10}]
},

{"round": 5, "question": "Name a household cleaning tool Aaron loves to use...", "survey": [ 
    {"rank": 1, "answer": "Vaccuum", "points": 60},
    {"rank": 2, "answer": "Broom", "points": 20},
    {"rank": 3, "answer": "Swiffer", "points": 15},
    {"rank": 4, "answer": "Spray Bottle", "points": 5}]
},

{"round": 6, "question": "Name a fruit Aaron likes to eat...", "survey": [ 
    {"rank": 1, "answer": "Banana", "points": 35},
    {"rank": 2, "answer": "Strawberry", "points": 20},
    {"rank": 3, "answer": "Watermelon", "points": 15},
    {"rank": 4, "answer": "Apple", "points": 10},
    {"rank": 5, "answer": "Pear", "points": 10},
    {"rank": 6, "answer": "Grapes", "points": 5},
    {"rank": 7, "answer": "Plum/Prune", "points": 5}]
},

{"round": 7, "question": "Name something people do to entertain a baby...", "survey": [ 
    {"rank": 1, "answer": "Sing", "points": 25},
    {"rank": 2, "answer": "Dance", "points": 20},
    {"rank": 3, "answer": "Make Faces", "points": 15},
    {"rank": 4, "answer": "Play Peek-a-boo", "points": 15},
    {"rank": 5, "answer": "Make Noises", "points": 10},
    {"rank": 6, "answer": "Shake Objects", "points": 10},
    {"rank": 7, "answer": "Baby Talk", "points": 5}]
},

{"round": 8, "question": "Name an item Aaron is constantly told \"NO\" to playing with...", "survey": [ 
    {"rank": 1, "answer": "Electrical Items", "points": 30},
    {"rank": 2, "answer": "Fireplace", "points": 20},
    {"rank": 3, "answer": "Trees", "points": 20},
    {"rank": 4, "answer": "Stairs", "points": 10},
    {"rank": 5, "answer": "Diffuser/Fan", "points": 10},
    {"rank": 6, "answer": "Toilet Paper", "points": 10}]
},

{"round": 9, "question": "Name something you’d find in Aaron’s diaper bag...", "survey": [ 
    {"rank": 1, "answer": "Diapers", "points": 40},
    {"rank": 2, "answer": "Wipes", "points": 15},
    {"rank": 3, "answer": "Clothes", "points": 15},
    {"rank": 4, "answer": "Blanket", "points": 10},
    {"rank": 5, "answer": "Book/Toy", "points": 10},
    {"rank": 6, "answer": "Essential Oils", "points": 5},
    {"rank": 7, "answer": "Crackers", "points": 5}]
},

{"round":10, "question": "Name a popular brand of diapers...", "survey": [ 
    {"rank": 1, "answer": "Pampers", "points": 30},
    {"rank": 2, "answer": "Huggies", "points": 25},
    {"rank": 3, "answer": "Luvs", "points": 25},
    {"rank": 4, "answer": "Babyganics", "points": 10},
    {"rank": 5, "answer": "Honest", "points": 10}]
}
];

// Establish functionality on window ready
$(function() {
    'use strict';
    newGame(0);

});

function newGame(game) {

    loadData(data);
    
    function loadData(data) {
        buildLinks();
        buildBoard(game);
        
        // Build the game links
        function buildLinks() {
            'use strict';
            $('#games').html('<h1><a href="index.html">FAMILY FEUD</a></h1>');
            var items = '';
            for (var i = 0; i < data.length; i++) {
                items += '<a href="#" onClick="newGame(' + i + ');">#' + (i+1) + '</a> ';
            }
            $('#games').append(items);
        }

        // Build the game board
        function buildBoard(game) {
            'use strict';
            $('#question').html('The top ' + data[game].survey.length + ' answers are on the board');
            $('#question').append('<div class="hidden">' + data[game].question + '</div>');
            $('#board').html('');
            var items = '';
            for (var i = 0; i < data[game].survey.length; i++) {
                items += '<div id="answer' + i + '" class="answer" onClick="revealAnswer(' + i + ');">';
                items += '<span class="rank">' + data[game].survey[i].rank + '</span><br />';
                items += '<div class="hidden"><div class="reveal">' + data[game].survey[i].answer + '</div>';
                items += '<div class="points">' + data[game].survey[i].points + '</div></div>';
                items += '</div>';
            }
            $('#board').append(items);
            $('.x').css('color', 'black');
            $('.x').css('font-weight', 'normal');
            score = 0;
            $('#score').html(score);
        }    

    }
}

// Show question when clicked
function showQuestion(){
    $('#question').html($('#question > .hidden').html());
    setTimeout(function(){ play('ring-in'); }, 2000);
}

// Reveal answer when clicked
function revealAnswer(id){
    play('reveal');
    $('#answer' + id).html($('#answer' + id + ' > .hidden').html());
    $('#answer' + id).css('background-image', 'none');
    $('#answer' + id).css('background-color', 'black');
    $('#answer' + id).css('padding', '5px 0 5px 0');
    score += parseInt($('#answer' + id + ' > .points').html());
    $('#score').html(score);
}

// Play sound effects
function play(sound){
    var audio = document.getElementById(sound);
    audio.play();
}
    
// Show strike
function strike(id){
   $('#' + id).css('color', 'red');
   $('#' + id).css('font-weight', 'bold');
   play('strike');
}