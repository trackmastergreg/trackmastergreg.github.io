// This script calculates M Ratio for tournaments and advises on hands to play

var structure = [
{tournament: "Monday Night 7PM", buy_in: 25, stack: 2000},
{level:  1, minutes: 15, ante:    0, small_blind:    25, big_blind:    50},
{level:  2, minutes: 15, ante:    0, small_blind:    50, big_blind:   100},
{level:  3, minutes: 15, ante:    0, small_blind:   100, big_blind:   200},
{level:  4, minutes: 15, ante:    0, small_blind:   150, big_blind:   300},
{level:  5, minutes: 15, ante:    0, small_blind:   200, big_blind:   400},
{level:  6, minutes: 15, ante:    0, small_blind:   250, big_blind:   500},
{level:  7, minutes: 15, ante:    0, small_blind:   300, big_blind:   600},
{level:  8, minutes: 15, ante:    0, small_blind:   400, big_blind:   800},
{level:  9, minutes: 15, ante:    0, small_blind:   500, big_blind:  1000},
{level: 10, minutes: 15, ante:    0, small_blind:   600, big_blind:  1200},
{level: 11, minutes: 15, ante:    0, small_blind:   800, big_blind:  1600},
{level: 12, minutes: 15, ante:    0, small_blind:  1000, big_blind:  2000},
{level: 13, minutes: 15, ante:    0, small_blind:  1500, big_blind:  3000},
{level: 14, minutes: 15, ante:    0, small_blind:  2000, big_blind:  4000},
{level: 15, minutes: 15, ante:    0, small_blind:  2500, big_blind:  5000},
{level: 16, minutes: 15, ante:    0, small_blind:  3000, big_blind:  6000},
{level: 17, minutes: 15, ante:    0, small_blind:  4000, big_blind:  8000},
{level: 18, minutes: 15, ante:    0, small_blind:  5000, big_blind: 10000},
{level: 19, minutes: 15, ante:    0, small_blind:  6000, big_blind: 12000},
{level: 20, minutes: 15, ante:    0, small_blind:  8000, big_blind: 16000},
{level: 21, minutes: 15, ante:    0, small_blind: 10000, big_blind: 20000},
{level: 22, minutes: 15, ante:    0, small_blind: 12000, big_blind: 24000},
{level: 23, minutes: 15, ante:    0, small_blind: 15000, big_blind: 30000},
{level: 24, minutes: 15, ante:    0, small_blind: 20000, big_blind: 40000},
{level: 25, minutes: 15, ante:    0, small_blind: 30000, big_blind: 60000},
{level: 26, minutes: 15, ante:    0, small_blind: 40000, big_blind: 80000},
{level: 27, minutes: 15, ante:    0, small_blind: 50000, big_blind:100000}
];

// Establish functionality on window ready:
$(function() {
    'use strict';

    for (var i = 1, j = structure.length; i < j; i++) {
            var opt = document.createElement('option');
            $(opt).attr('title', structure[i].level);
            $(opt).attr('value', structure[i].level);
            $(opt).text(structure[i].level);
            $('#levels').append(opt);
    }
    
    // Load data for the selected menu option
    $('#levels').change(function() {
        $('#ante').val(structure[this.value].ante);
        $('#small_blind').val(structure[this.value].small_blind);
        $('#big_blind').val(structure[this.value].big_blind);
    });
    
    $('#stack').val(structure[0].stack);
    $('#tournament').change(calcRatio);
    //calcRatio();
    
}); // End of anonymous function.
    
// Calculate the effective M ratio
function calcRatio() {
    'use strict';
    
    $('#m5').hide();
    $('#m4').hide();
    $('#m3').hide();
    $('#m2').hide();
    $('#m1').hide();
    
    var stack = Number($('#stack').val());
    var small_blind = Number($('#small_blind').val());
    var big_blind = Number($('#big_blind').val());
    var ante = Number($('#ante').val());
    var players = Number($('#players').val());

    var ratio = stack / (small_blind + big_blind + (ante * players));
    var m = ratio * (players/10.0)

    $('#ratio').val(m.toFixed(2));
    
    if (m >= 20) {
        $('#m5').show();
        $('h1').css("background-color", "green");
        $('h1').css("color", "black");
    } else if (m >= 10) {
        $('#m4').show();
        $('h1').css("background-color", "yellow");
        $('h1').css("color", "black");
    } else if (m >= 6) {
        $('#m3').show();
        $('h1').css("background-color", "orange");
        $('h1').css("color", "black");
    } else if (m >= 1) {
        $('#m2').show();
        $('h1').css("background-color", "red");
        $('h1').css("color", "black");
    } else {
        $('#m1').show();
        $('h1').css("background-color", "black");
        $('h1').css("color", "white");
    }
}

