// Establish functionality on window ready:
var card_ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'], input = [];

$(function() {
    'use strict';
    // Reset interface on button click
    $('input[name=positions]').click(function() {
        input = [];
        buildTable();
    });

    // Build and display the interface
    buildTable();
    
    // Show/hide content
    $('.show').click(function () {
        var item = $(this).attr("title");
        $('#' + item).toggle();
    });

});
    
// Build table for selecting cards
function buildTable() {
    'use strict';
    // Create table structure first
    var table = '<table id="cards"><thead><tr><th colspan="4">Select Cards</th></tr></thead><tbody></tbody></table>';
    $('#strategy').html(table);
    for (var i = 0; i < card_ranks.length; i++) {  
        var row = '<tr>';
        row += '<td class="red" id="' + card_ranks[i] + 'D" onclick="pickCard(\'' + card_ranks[i] + 'D\');">' + card_ranks[i] + '<span class="suit">&diams;</span></td>';
        row += '<td id="' + card_ranks[i] + 'C" onclick="pickCard(\'' + card_ranks[i] + 'C\');">' + card_ranks[i] + '<span class="suit">&clubs;</span></td>';
        row += '<td class="red" id="' + card_ranks[i] + 'H" onclick="pickCard(\'' + card_ranks[i] + 'H\');">' + card_ranks[i] + '<span class="suit">&hearts;</span></td>';
        row += '<td id="' + card_ranks[i] + 'S" onclick="pickCard(\'' + card_ranks[i] + 'S\');">' + card_ranks[i] + '<span class="suit">&spades;</span></td>';
        row += '</tr>';
        $('#cards > tbody').append(row);
    }
    $('#extras').hide();
    showPosition();
}

// Show only the selected position
function showPosition() {
    'use strict';
    // Get selected option
    var position = $('input[name=positions]:checked').val();
    
    $('.blinds').hide();
    $('.button').hide();
    $('.cutoff').hide();
    $('.early').hide();
    
    if (position == "blinds") {
        $('.blinds').show();
        $('h1').css("background-color", "red");
    } else if (position == "button") {
        $('.button').show();
        $('h1').css("background-color", "green");
    } else if (position == "cutoff") {
        $('.cutoff').show();
        $('h1').css("background-color", "yellow");
    } else if (position == "early") {
        $('.early').show();
        $('h1').css("background-color", "orange");
    }
}

function pickCard(card) {
    'use strict';
    if (input.length < 2) {
        $('#' + card).css('background-color', '#ffff80');
        $('#' + card).attr('onclick', '');

        // Assign values for sorting cards
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
        input.push({rank: card.charAt(0), suit: card.charAt(1), value: value});
    }

    if (input.length == 2) {
        // Sort the cards high to low
        input = input.sort(function(x, y) {return y.value - x.value;});

        // Build the hand string
        var hand = input[0].rank + input[1].rank;
        if(input[0].suit == input[1].suit) {
            hand += 's';
        } 
        console.log(hand);
        // Evaluate hand based on strategy
        checkHand(hand);

        // Display a visual of the hand
        var img = '<img src="img/deck/' + input[0].rank + input[0].suit + '.png"/>' + '<img src="img/deck/' + input[1].rank + input[1].suit + '.png"/>';
        $('#hand').html(img);
    }
}

function checkHand(hand) {
    $.getJSON("thecourse.txt", loadData);

    function loadData(data) {
        var position = $('input[name=positions]:checked').val();
        var advice = ['','',''], strategy = '';
        if (position == 'blinds') advice.push('');
        
        getStrategy();
        showStrategy(position);

        // Get the correct strategy
        function getStrategy() {
            'use strict';
            for(var i = 0; i < data.length; i++) {
                if (hand == data[i].hand) {
                    switch (position) {
                        case 'blinds': advice = data[i].blinds;
                                break;
                        case 'button': advice = data[i].button;
                                break;
                        case 'cutoff': advice = data[i].cutoff;
                                break;
                        case 'early': advice = data[i].early;
                                break;
                    }
                }
            }
        }
        
        // Show the correct strategy
        function showStrategy() {
            'use strict';
            for (var i = 0; i < advice.length; i++) {
                switch(advice[i]) {
                    case 'R': var text = (i > 0) ? 'Re-raise' : 'Raise';
                            break;
                    case 'C': var text = 'Call';
                            break;
                    default: var text = (position == 'blinds' && i == 0) ? 'Check' : 'Fold';
                            break;
                }
                switch(i) {
                    case 0: strategy += '<div class="advice"><h3>If no one has <span class="tool_tip" title="Everyone at the table thus far has either limped or folded">raised...</span></h3><p>' + text + '</p></div>';
                            break;
                    case 1: strategy += '<div class="advice"><h3>Against a <span class="tool_tip" title="A raise from early position or from a player who typically limps">tight raise...</span></h3><p>' + text + '</p></div>';
                            break;
                    case 2: strategy += '<div class="advice"><h3>Against a <span class="tool_tip" title="A raise from late position or from a player who raises frequently">loose raise...</span></h3><p>' + text + '</p></div>';
                            break;
                    case 3: strategy += '<div class="advice"><h3>Against a <span class="tool_tip" title="A raise from an aggressive player in late positon trying to steal the pot">steal raise...</span></h3><p>' + text + '</p></div>';
                            break;
                }
            }
            $('#strategy').html(strategy);
            $('#extras').show();
            $('#details').show();
        }
        
        // Show tool tips
        $('.tool_tip').click(function () {
            var $title = $(this).find(".title");
            if (!$title.length) {
                $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
            } else {
                $title.remove();
            }
        });

    }
}