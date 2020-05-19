var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var firstKeypress = true;

var level = 1;


function gameOver() {
  // $('#top').trigger("click");
  $('[type="button"').unbind();
  $('[type="button"').click(function(event) {
    event.stopPropagation();
  });
  gamePattern = [];
  userClickedPattern = [];
  $('#play').removeClass('hide');
  $('#level-title').text('Oops! Gave Over!');
  $('#play').text('RESTART');
  playErrorSound();
  firstKeypress = true;
  level = 1;
  // $('[type="button"').unbind();
  $('body').addClass('red');
  setTimeout(function() {
    $('body').removeClass('red');
  },200);
  $('#how-to').removeClass('hide');
}

var clickFunction = function(event) {
  event.stopPropagation();
  var userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  if ( !level ) {
    return gameOver();
  }
  var gamePatternNumber = gamePattern.length;
  var clickPatternNumber = userClickedPattern.length;
  if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') === userClickedPattern.join('') ) {
    $('[type="button"').unbind();
    $('[type="button"').click(function(event){
      event.stopPropagation();
    });
    setTimeout(function() {
      $('[type="button"').click(clickFunction);
      nextSequence();
      userClickedPattern = [];
    }, 1000);
  }
  else if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') !== userClickedPattern.join('') ) {
    gameOver();
  }
  else if ( gamePatternNumber > clickPatternNumber ) {
    var currentClickPattern = gamePattern.slice(0, clickPatternNumber);
    if ( currentClickPattern.join('') !== userClickedPattern.join('') ) {
      gameOver();
    }
  }
};

// $('[type="button"').click(clickFunction);
$('[type="button"').unbind();
$('.how-to-play').addClass('hide');

const showHint = (event) => {
  event.stopPropagation();
  $('.how-to-play').click((event) => {
    event.stopPropagation();
  });
  $('.app').addClass('hide');
  $('.how-to-play').removeClass('hide').addClass('purple');
  $('body').addClass('purple');
  $('#how-to').addClass('hide');
};

$('#how-to').click(showHint);

const closeHint = () => {
  $('.how-to-play').addClass('hide');
  $('body').removeClass('purple');
  $('.app').removeClass('hide');
  $('#how-to').removeClass('hide');
};
$('.close').click(closeHint);


$('.tips-btn').click(closeHint);

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  $('#level-title').text('Level ' + level);
  gamePattern.push(randomChosenColour);
  setTimeout(() => {
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    level++;
    playSound(randomChosenColour);
  }, 300);

}

function playSound( name ) {
  var playRandomSound = new Audio("sounds/" + name + ".mp3");
  playRandomSound.play();
}

function playErrorSound() {
  var errorSound = new Audio('sounds/wrong.mp3');
  errorSound.play();
}

function animatePress( currentColour ) {
  $( '.' + currentColour ).addClass('pressed');
  setTimeout(function() {
    $( '.' + currentColour ).removeClass('pressed');
  }, 100);
}
$('[type="button"').click(function(event){
  event.stopPropagation();
});

const startPlay = function() {
  $('[type="button"').click(clickFunction);
  if ( firstKeypress ) {
    // $('[type="button"').click(clickFunction);
    firstKeypress = false;
    $('#level-title').text('Level 0');
    $('#play').addClass('hide');
    nextSequence();
    // $('#how-to').addClass('hide');
  }
}

$('body').keypress(startPlay);

$('#play').click(startPlay);

$('footer').click((event) => {
  event.stopPropagation();
})
