const buttonColours = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userClickedPattern = [];

let firstKeypress = true;

let level = 1;

let timeOut;
let interval;


const blink = (selector, minute) => {
  
  minute = minute * 1000;

  interval = setInterval(() => {
    $(selector).css('visibility', 'hidden');
    timeOut = setTimeout(() => {
      $(selector).css('visibility', 'visible');
    }, minute);
  }, (minute * 2));

};


function gameOver() {
  $('#level-title').addClass('visible');
  $('#level-title').css('color','rgb(231, 26, 26)');
  $('.btn').unbind().removeClass('pointer');
  $('.btn').click(function(event) {
    event.stopPropagation();
  });
  gamePattern = [];
  userClickedPattern = [];
  $('#play').removeClass('hide');
  $('#level-title').text('Oops! Gave Over!');
  blink('#level-title', 1);
  $('#play').text('RESTART');
  playErrorSound();
  firstKeypress = true;
  level = 1;
  // $('.btn').unbind().removeClass('pointer');
  $('body').addClass('red');
  setTimeout(function() {
    $('body').removeClass('red');
  },200);
  $('#how-to').removeClass('hide');
}

const clickFunction = function(event) {
  event.stopPropagation();
  let userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  if ( !level ) {
    return gameOver();
  }
  let gamePatternNumber = gamePattern.length;
  let clickPatternNumber = userClickedPattern.length;
  if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') === userClickedPattern.join('') ) {
    $('.btn').unbind().removeClass('pointer');
    $('.btn').click(function(event){
      event.stopPropagation();
    });
    setTimeout(function() {
      $('.btn').click(clickFunction).addClass('pointer')
      nextSequence();
      userClickedPattern = [];
    }, 1000);
  }
  else if ( gamePatternNumber === clickPatternNumber && gamePattern.join('') !== userClickedPattern.join('') ) {
    gameOver();
  }
  else if ( gamePatternNumber > clickPatternNumber ) {
    let currentClickPattern = gamePattern.slice(0, clickPatternNumber);
    if ( currentClickPattern.join('') !== userClickedPattern.join('') ) {
      gameOver();
    }
  }
};

// $('.btn').click(clickFunction).addClass('pointer')
$('.btn').unbind().removeClass('pointer');
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
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNumber];
  $('#level-title').text('LEVEL ' + level);
  gamePattern.push(randomChosenColour);
  setTimeout(() => {
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    level++;
    playSound(randomChosenColour);
  }, 300);

}

function playSound( name ) {
  let playRandomSound = new Audio("sounds/" + name + ".mp3");
  playRandomSound.play();
}

function playErrorSound() {
  let errorSound = new Audio('sounds/wrong.mp3');
  errorSound.play();
}

function animatePress( currentColour ) {
  $( '.' + currentColour ).addClass('pressed');
  setTimeout(function() {
    $( '.' + currentColour ).removeClass('pressed');
  }, 100);
}
$('.btn').click(function(event){
  event.stopPropagation();
});

const startPlay = function() {
  $('#level-title').css('color','#FEF2BF');
  clearInterval(interval);
  $('.btn').click(clickFunction).addClass('pointer')
  if ( firstKeypress ) {
    // $('.btn').click(clickFunction).addClass('pointer')
    firstKeypress = false;
    // $('#level-title').text('Level 0');
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
