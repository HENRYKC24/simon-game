var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var firstKeypress = true;

var level = 0;

function gameOver() {
  // $('#top').trigger("click");
  gamePattern = [];
  userClickedPattern = [];
  $('#level-title').text('Gave Over, Press Any Key to Restart!');
  playErrorSound();
  firstKeypress = true;
  level = 0;
  // $('[type="button"').unbind();
  $('body').addClass('red');
  setTimeout(function() {
    $('body').removeClass('red');
  },200);
}

var clickFunction = function() {
  var userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  if ( !level ) {
    return gameOver();
  }
  var gamePatternNumber = gamePattern.length;
  var clickPatternNumber = userClickedPattern.length;
  console.log(gamePattern, userClickedPattern);
  if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') === userClickedPattern.join('') ) {
    $('[type="button"').unbind();
    setTimeout(function() {
      $('[type="button"').click(clickFunction);
      nextSequence();
      userClickedPattern = [];
    }, 1000);
  }
  else if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') !== userClickedPattern.join('') ) {
    console.log(1);
    gameOver();
  }
  else if ( gamePatternNumber > clickPatternNumber ) {
    var currentClickPattern = gamePattern.slice(0, clickPatternNumber);
    console.log(currentClickPattern, gamePattern, userClickedPattern);
    if ( currentClickPattern.join('') !== userClickedPattern.join('') ) {
      console.log(2);
      gameOver();
    }
  }
};

$('[type="button"').click(clickFunction);

function nextSequence() {
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
  level++;
  $('#level-title').text('Level ' + level);
  playSound(randomChosenColour);

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

$('body').keypress(function() {
  if ( firstKeypress ) {
    // $('[type="button"').click(clickFunction);
    firstKeypress = false;
    $('#level-title').text('Level 0');
    nextSequence();
  }
});
