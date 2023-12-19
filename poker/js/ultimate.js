// This script determines optimal play for ultimate texas hold 'em hands
var card_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
var card_suits = ['diams', 'clubs', 'hearts', 'spades'];
var hand = [], board = [], points = 0;

// Establish functionality on window ready
$(function() {
    'use strict';
    buildTable();

    // Enable reset button to clear hand and points
    $('#reset').click(function() {
        hand.length = 0;
        board.length = 0;
        points = 0;
        $('#action').empty(); 
        $('#total').empty();    
        buildTable();        
    });
});
    
// Build table with all 52 cards
function buildTable() {
    'use strict';
    // Clear the entire table body first
    $('#table > tbody').html('');
    for (var i = 0; i < card_ranks.length; i++) {  
        var row = '<tr>';
        for (var j = 0; j < card_suits.length; j++) {
            row += '<td class="' + card_suits[j] +'" id="' + card_ranks[i] + card_suits[j].charAt(0).toUpperCase() + '" onclick="pickCard(\'' 
            row += card_ranks[i] + card_suits[j].charAt(0).toUpperCase() + '\');">' + card_ranks[i] + '&' + card_suits[j] + ';</td>';
        }
        row += '</tr>';
        $('#table > tbody').append(row);
    }
}

// When a card is selected add it to the hand or board
function pickCard(card) {
    'use strict';
    if (board.length < 5) {
        // Assign values to each card rank
        switch (card.charAt(0)) {
            case 'A': var value = 14;
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
		// Disable and highlight card once selected
        $('#' + card).attr('onclick', '');
        if (hand.length < 2) {
			$('#' + card).css('background-color', '#68d17d');
            hand.push({rank: card.charAt(0), suit: card.charAt(1), value: value});
		} else {
			$('#' + card).css('background-color', '#ffff80');
            board.push({rank: card.charAt(0), suit: card.charAt(1), value: value});
        }
		// Sort the selected cards based on rank and analyze
        hand.sort(function(x, y) {return x.value - y.value;});
        board.sort(function(x, y) {return x.value - y.value;});
        analyzeHand();
    }
}

// Analyze the hand as it is dealt
function analyzeHand() { 
    'use strict';
    // Initial decision based on hole cards
    if (hand.length == 2 && points == 0) {
        points = preflopBet();
    }
    // Next decision based on the flop
    if (board.length == 3 && points == 0) {
        points = flopBet();
    }
    // Final decision based on the river
    if (board.length == 5 && points == 0) {
        points = riverBet();
    }
    // Points determines when and how much to bet
    $('#total').html(points+"x");
    
    if (board.length != 5) {
        var action = (points >= 2 ? 'RAISE' : 'CHECK');
    } else {
        var action = (points >= 1 ? 'CALL' : 'FOLD');
    }
    $('#action').html(action);
}

function preflopBet() { 
    'use strict';
    var bet = false

    // Is the hand suited?
    var suited = (hand[0].suit == hand[1].suit);

    // Evalute high card strength
    switch (hand[1].rank) {
        case 'A': 
            bet = true;
            break;
        case 'K': 
            bet = ((hand[0].value >= 5) || (hand[0].value >= 2 && suited)) ? true : false;
            break;
        case 'Q':
            bet = ((hand[0].value >= 8) || (hand[0].value >= 6 && suited)) ? true : false;
            break;
        case 'J':
            bet = ((hand[0].value >= 10) || (hand[0].value >= 8 && suited)) ? true : false;
            break;
        default: 
            bet = false;
            break;
    }

    // Is it a pair > 2?
    if (!bet) {
        bet = (hand[0].rank == hand[1].rank && hand[0].rank != 2);
    }
    return (bet) ? 4 : 0;
}

function flopBet() { 
    'use strict';
    var bet = false
    
    // Count the ranks and suits on the board
    var ranks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], suits = {C:0, D:0, H:0, S:0};

    for (var i = 0; i < board.length; i++) {
        ranks[board[i].value]++;
        suits[board[i].suit]++;
    }
    // Identify the kickers to the board cards
    var kickers = [0, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    for (var i = 0; i < board.length; i++) {
        var index = kickers.indexOf(board[i].value);
        if (index >= 0) {
            kickers.splice(index, 1);
        }
    }
    // Determine the board texture
    var trips_board = false, pair_board = false, suited_board = false;

    // Is the board trips?
    for (var i = 0; i < ranks.length; i++) {
        if (ranks[i] == 3) {
            trips_board = true;
        }
    }
    // Is the board a pair?
    for (var i = 0; i < ranks.length; i++) {
        if (ranks[i] == 2) {
            pair_board = true;
        }
    }
    // Is the board suited?
    for (var s in suits) {
        if (suits[s] == 3) {
            suited_board = true;
        }
    }

    // Add the ranks and suits from the player's hand
    for (var i = 0; i < hand.length; i++) {
        ranks[hand[i].value]++;
        suits[hand[i].suit]++;
    }

    // Check for two pair or better (no pocket pairs)
    for (var i = 0, pairs = 0; i < ranks.length; i++) {
        if (ranks[i] == 2 && hand[0].rank != hand[1].rank) {
            pairs++;
        } else if (ranks[i] > 2) {
            pairs++;
            pairs++;
        }
    }
    if (pairs >= 2) {
        bet = true;
    }
        
    // Check for a striaght
    ranks[1] = ranks[14];
    for (var i = 0; i < ranks.length; i++) {
        for (var j = i, in_order = 0; j < i+5; j++) {
            if (ranks[j] == 1) {
                in_order++;
            } 
        }
        if (in_order == 5) {
            bet = true;
        }
    }
    ranks[1] = ranks[0];
    
    // Check for a flush
    for (var s in suits) {
        if (suits[s] == 5) {
            bet = true;
        }
    }

    // Trips board
    if(trips_board) {
        // Any four of a kind
        if (board[0].rank == hand[0].rank || board[0].rank == hand[1].rank) {
            bet = true;
        }
        // Any full house
        if (hand[0].rank == hand[1].rank) {
            bet = true;
        }
        // At least 2nd kicker
        if (hand[1].value >= kickers[2]) {
            bet = true;
        }
        // The 3rd & at least 9th kicker
        if (hand[1].value == kickers[3] && hand[0].value >= kickers[9]) {
            bet = true;
        }
    }
    
    // Is the hand all over cards to the board?
    var over_cards = true;
    for (i = 0; i < board.length; i++) {
        if (board[i].value >= hand[0].value || board[i].value >= hand[1].value) {
            over_cards = false;
        }
    }
    
    // Pair board
    if(pair_board) {
        // Flush draws
        for (var s in suits) {
            if (suits[s] == 4) {
                // At least 4th suited draw
                if (hand[1].value >= kickers[4]) {
                    bet = true;
                }
                // At least 5th suited draw and all over cards
                if (hand[1].value >= kickers[5] && over_cards) {
                    bet = true;
                }
            }
        }
        // Striaght draws
        for (var i = 8; i < ranks.length; i++) {
            // Outside straight JT98+
            for (var j = i, in_order = 0; j < i+4; j++) {
                if (ranks[j] >= 1) {
                    in_order++;
                } 
            }
            if (in_order == 4) {
                var bet = true;
            }
        }
        // The 1st kicker
        if (hand[1].value >= kickers[1]) {
            bet = true;
        }
        // The 2nd kicker & at least 4th kicker
        if (hand[1].value == kickers[2] && hand[0].value >= kickers[4]) {
            bet = true;
        }
    }

    // Suited board
    if(suited_board) {
        // Top pair
        if (board[2].value == hand[0].value || board[2].value == hand[1].value) {
            bet = true;
        }
        // Middle pair
        if (board[1].value == hand[0].value || board[1].value == hand[1].value) {
            bet = true;
        }
        // Bottom pair
        if (board[0].value == hand[0].value && hand[1].value >= kickers[6]) {
            bet = true;
        }
        if (board[0].value == hand[1].value && hand[0].value >= kickers[6]) {
            bet = true;
        }
        // Flush draws
        for (var s in suits) {
            if (suits[s] == 4) {
                // With any pair
                if (hand[0].value == hand[1].value) {
                    bet = true;
                }
                // At least 2nd suited draw
                if ((hand[1].suit == s && hand[1].value >= kickers[2]) || (hand[0].suit == s && hand[0].value >= kickers[2])) {
                    bet = true;
                }
                // At least 3rd suited draw and an under card on the board
                if (hand[1].suit == s && hand[1].value >= kickers[3]) {
                    if (hand[0].value > board[0].value || hand[0].value > board[1].value || hand[0].value > board[2].value) {
                        bet = true;
                    }       
                }
                if (hand[0].suit == s && hand[0].value >= kickers[3]) {
                    if (hand[1].value > board[0].value || hand[1].value > board[1].value || hand[1].value > board[2].value) {
                        bet = true;
                    }       
                }
                // At least 6th suited draw and 3rd kicker
                if (hand[0].suit == s && hand[0].value >= kickers[6] && hand[1].value >= kickers[3]) {
                    bet = true;
                }
                if (hand[1].suit == s && hand[1].value >= kickers[6] && hand[0].value >= kickers[3]) {
                    bet = true;
                }
                // At least 8th suited draw and 2nd kicker
                if (hand[0].suit == s && hand[0].value >= kickers[8] && hand[1].value >= kickers[2]) {
                    bet = true;
                }
                if (hand[1].suit == s && hand[1].value >= kickers[8] && hand[0].value >= kickers[2]) {
                    bet = true;
                }
            }
        }
    }

    // Offsuit board
    if (!(suited_board || pair_board || trips_board)) {
        // Flush draws
        for (var s in suits) {
            if (suits[s] == 4) {
                // At least 4th suited draw
                if (hand[1].value >= kickers[4]) {
                    bet = true;
                }
                // At least 5th suited draw and an under card on the board
                if (hand[1].value >= kickers[5]) {
                    if (hand[0].value > board[0].value || hand[0].value > board[1].value || hand[0].value > board[2].value) {
                        bet = true;
                    }  
                }
                // Striaght draws
                for (var i = 2; i < ranks.length; i++) {
                    // Outside straight
                    for (var j = i, in_order = 0; j < i+4; j++) {
                        if (ranks[j] >= 1) {
                            in_order++;
                        } 
                    }
                    if (in_order == 4) {
                        var bet = true;
                    }
                }
            }
        }
    }

console.log(bet);
console.log(hand)
console.log(board)
console.log(ranks);
console.log(suits);
console.log(kickers);

    return (bet) ? 2 : 0;
}

/*

    // Final decision based on outs
    if (hand.length == 7 && points == 0) {
    
        var outs = 0;

        for (var i = 2; i < ranks.length; i++) {
            for (var j = 0; j < board.length; j++) {
                if (board[j].value == i) {
                    outs += (4 - ranks[i]);
                    ranks[i] = 4;
                }
            }
            if (hole[0].value < i && hole[1].value < i) {
                outs += (4- ranks[i]);
            }
        }
        
        if (outs < 21) {
            points += 1;
        }
    }
*/