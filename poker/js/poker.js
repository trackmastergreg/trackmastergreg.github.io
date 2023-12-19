// This script deals hands of cards for various poker applications.

var card_suits = ['diams', 'clubs', 'hearts', 'spades'], cards = [];
var card_ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

// Establish functionality on window ready:
$(function() {
    'use strict';
 
    $('#card1').val("");
    $('#card2').val("");
    $('#card3').val("");
    $('#card4').val("");
    $('#card5').val("");

    for (var s = 0; s < card_suits.length; s++) {
        for (var r = 0; r < card_ranks.length; r++) {
            var opt = document.createElement('option');
            opt.innerHTML = card_ranks[r] + '&' + card_suits[s] + ';';
            opt.value = card_ranks[r] + card_suits[s].charAt(0).toUpperCase();
            
            if (card_suits[s] == 'diams' || card_suits[s] == 'hearts') {
                opt.setAttribute('class', 'red');
            }
            $('#deckofcards').append(opt);
        }
    }

    $('#cards').submit(deal);
    $('#deckofcards').change(set);
    
}); // End of anonymous function.

function deal(e) {
   'use strict';
    var hand = + $('#hand').val() + 1;

    // Set up for how many cards to deal
    for (var i = hand; i <= 5; i++) {
        $('#card'+i).val("");
        $('#card'+i+'img').attr("src", "img/deck/deck.png");
    }

    // Get a new deck then shuffle it
    cards = shuffle(newdeck());
        
    // Deal from the shuffled deck
    for (var i = 1; i < hand; i++) {
        $('#card'+i).val(cards[i-1].card);
        $('#card'+i+'img').attr("src", "img/deck/" + cards[i-1].card + ".png");
    }
    
    // Get the event object
    if (typeof e == 'undefined') e = window.event;

    // Prevent the form's submission
    if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
}

function newdeck() {
    'use strict';
    var newdeck = [] ;

    for (var s = 0; s < card_suits.length; s++) {
        for (var r = 0; r < card_ranks.length; r++) {
            newdeck.push({card: card_ranks[r] + card_suits[s].charAt(0).toUpperCase(), suit: card_suits[s], value: r+1 });
        }
    }

    return newdeck;
}

function shuffle(array) { 
    'use strict';
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

    return array;
}

function set() {
    'use strict';
    if ($('#card1').val() == "") {
        $('#card1').val($('#deckofcards').val());
        $('#card1img').attr("src", "img/deck/" + $('#deckofcards').val() + ".png");
    } else if ($('#card2').val() == "") {
        $('#card2').val($('#deckofcards').val());
        $('#card2img').attr("src", "img/deck/" + $('#deckofcards').val() + ".png");
    } else if ($('#card3').val() == "") {
        $('#card3').val($('#deckofcards').val());
        $('#card3img').attr("src", "img/deck/" + $('#deckofcards').val() + ".png");
    } else if ($('#card4').val() == "") {
        $('#card4').val($('#deckofcards').val());
        $('#card4img').attr("src", "img/deck/" + $('#deckofcards').val() + ".png");
    } else if ($('#card5').val() == "") {
        $('#card5').val($('#deckofcards').val());
        $('#card5img').attr("src", "img/deck/" + $('#deckofcards').val() + ".png");
    }
}