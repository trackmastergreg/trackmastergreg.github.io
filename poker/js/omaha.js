// This script calculates points for omaha hi-low hands
var card_suits = ['diams', 'clubs', 'hearts', 'spades'], hand = [];
var card_ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

// Establish functionality on window ready
$(function() {
    'use strict';
    buildTable();

    // Enable reset button to clear hand and points
    $('#reset').click(function() {
        hand.length = 0;
        $('#total').empty();    
        $('#action').empty(); 
        buildTable();        
    });
});
    
// Build table with all 52 cards
function buildTable() {
    'use strict';
    // Clear the entire table body first
    $('#table > tbody').html('');
    for (var i = 0, j = card_ranks.length; i < j; i++) {  
        var row = '<tr>';
        row += '<td class="red" id="' + card_ranks[i] + 'D" onclick="pickCard(\'' + card_ranks[i] + 'D\');">' + card_ranks[i] + '&diams;</td>';
        row += '<td id="' + card_ranks[i] + 'C" onclick="pickCard(\'' + card_ranks[i] + 'C\');">' + card_ranks[i] + '&clubs;</td>';
        row += '<td class="red" id="' + card_ranks[i] + 'H" onclick="pickCard(\'' + card_ranks[i] + 'H\');">' + card_ranks[i] + '&hearts;</td>';
        row += '<td id="' + card_ranks[i] + 'S" onclick="pickCard(\'' + card_ranks[i] + 'S\');">' + card_ranks[i] + '&spades;</td>';
        row += '</tr>';
        $('#table > tbody').append(row);
    }
}

// When a card is selected add it to the hand
function pickCard(card) {
    'use strict';
    if (hand.length < 4) {
        $('#' + card).css('background-color', '#ffff80');
        $('#' + card).attr('onclick', '');

        switch (card.charAt(0)) {
            case 'A': var value = 1;
            break;
            case 'K': var value = 13;
            break;
            case 'Q': var value = 12;
            break;
            case 'J': var value = 11;
            break;
            case 'T': var value = 10;
            break;
            default: var value = parseInt(card.charAt(0));
            break;
        }
        hand.push({rank: card.charAt(0), suit: card.charAt(1), value: value});
        points();
    }
}

// Calculate points for the cards selected
function points() { 
    'use strict';
    var points = 0.0;
    
    // Order the cards by rank
    var deal = hand.sort(function(x, y) {return x.value - y.value;});

    for (var i = 0, low = []; i < deal.length; i++) {
        low.push(deal[i].rank);
    }
    
    // Remove any duplicate ranks
    low = low.filter(function(elem, pos) {
        return low.indexOf(elem) == pos;
    }); 
    
    // Award points for two lowest cards
    switch (low[0]+low[1]) {
        case 'A2': points += 20;
        break;
        case 'A3': points += 17;
        break;
        case 'A4': points += 13;
        break;
        case 'A5': points += 10;
        break;
        case '23': points += 15;
        break;
        case '24': points += 12;
        break;
        case '34': points += 11;
        break;
        case '45': points += 8;
        break;
        default: points += 0;
        break;
    }
    
    // Award points for remaining cards
    for (var i = 0; i < 2; i++) {
        switch (low[i+2]) {
            case '3': points += 9;
            break;
            case '4': points += 6;
            break;
            case '5': points += 4;
            break;
            case '6': 
            case 'T': points += 1;
            break;
            case 'J':
            case 'Q':
            case 'K': points += 2;
            break;
            default: points += 0;
            break;
        }
    }

    // Count number of suits and ranks
    for (var i = 0, suits = [[],[],[],[]], ranks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; i < deal.length; i++) {
        switch (deal[i].suit) {
            case 'C': suits[0].push(deal[i].rank);
            break;
            case 'D': suits[1].push(deal[i].rank);
            break;
            case 'H': suits[2].push(deal[i].rank);
            break;
            case 'S': suits[3].push(deal[i].rank);
            break;
        }
        switch (deal[i].rank) {
            case 'A': ranks[1] += 1;
            break;
            case '2': ranks[2] += 1;
            break;
            case '3': ranks[3] += 1;
            break;
            case '4': ranks[4] += 1;
            break;
            case '5': ranks[5] += 1;
            break;
            case '6': ranks[6] += 1;
            break;
            case '7': ranks[7] += 1;
            break;
            case '8': ranks[8] += 1;
            break;
            case '9': ranks[9] += 1;
            break;
            case 'T': ranks[10] += 1;
            break;
            case 'J': ranks[11] += 1;
            break;
            case 'Q': ranks[12] += 1;
            break;
            case 'K': ranks[13] += 1;
            break;
        }
    }

    // Award points for pairs
    for (var i = 1, quads = 0, trips = 0, pairs = 0; i < ranks.length; i++) {
        var pair_points = 0;
        if (ranks[i] >= 2) {
            switch (i) {
                case 1: pair_points += 8.0;
                break;
                case 2: pair_points += 3.0;
                break;
                case 3:
                case 4: 
                case 10: pair_points += 1.0;
                break;
                case 11: pair_points += 2.0;
                break;
                case 12: pair_points += 5.0;
                break;
                case 13: pair_points += 6.0;
                break;
            }
        }
        if (ranks[i] == 3) {
            pair_points *= .5;
        }
        if (ranks[i] == 4) {
            pair_points *= 0;
        }
        points += pair_points;
    
        switch (ranks[i]) {
            case 4: quads += 1;
            break;
            case 3: trips += 1;
            break;
            case 2: pairs += 1;
            break;
        }
    }
    
    // Award points for being suited
    for (var i = 0, double_suit = 0; i < suits.length; i++) {
        var suit_points = 0;
        if (suits[i].length >= 2) {
        	double_suit += 1;
            if (suits[i][0] == 'A') {
                suit_points += 4.0;
            } else {
                switch (suits[i][suits[i].length-1]) {
                    case 'K': suit_points += 3.0;
                    break;
                    case 'Q':
                    case 'J': suit_points += 2.0;
                    break;
                    case 'T':
                    case '9':
                    case '8': suit_points += 1.0;
                    break;
                }
            }
        } 
        if (suits[i].length == 3) {
            suit_points *= .5;
        }
        if (suits[i].length == 4) {
            suit_points *= 0;
        }
        points += suit_points;
    }

    // Identify high only hands
    if ( (ranks[1] + ranks[10] + ranks[11] + ranks[12] + ranks[13] == 4) && (quads + trips == 0) ) {
        if ( (pairs == 2) || (double_suit == 2) || (pairs == 1 && (suits[0].length == 2 || suits[1].length == 2 || suits[2].length == 2|| suits[3].length == 2)) ){
            points = 'HIGH';
        }
    }

    $('#total').html(points);
    
    if (points >= 30) {
        var action = 'RAISE';
    } else if (points >= 20 || points == 'HIGH') {
        var action = 'CALL';
    } else {
        var action = 'FOLD';
    }

    $('#action').html(action);
}