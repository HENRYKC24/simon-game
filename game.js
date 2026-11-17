// Memory Game: each round only the NEW pad lights up. Tap the whole
// pattern from the start, in order: the earlier pads come from your memory.
// One wrong pad ends the game. Touch, mouse, or the keys Q W A S
// (Space/Enter to start).

const PADS = ['green', 'red', 'yellow', 'blue'];
const KEYS = {q: 'green', w: 'red', a: 'yellow', s: 'blue'};
const $ = id => document.getElementById(id);

const board = $('board');
const pads = Object.fromEntries(
  [...document.querySelectorAll('.pad')].map(el => [el.dataset.pad, el]),
);

let pattern = [];
let step = 0;
let listening = false;
let playing = false;
let best = Number(localStorage.getItem('memory-best')) || 0;
let sound = localStorage.getItem('memory-sound') !== 'off';

// ---------- Sound ----------
const sounds = Object.fromEntries(
  [...PADS, 'wrong'].map(name => [name, new Audio(`./sounds/${name}.mp3`)]),
);
const play = name => {
  if (!sound) return;
  const a = sounds[name].cloneNode();
  a.volume = 0.8;
  a.play().catch(() => {});
};
const showSound = () => {
  const btn = $('sound');
  btn.setAttribute('aria-pressed', String(sound));
  btn.setAttribute('aria-label', sound ? 'Sound on' : 'Sound off');
};
$('sound').addEventListener('click', () => {
  sound = !sound;
  localStorage.setItem('memory-sound', sound ? 'on' : 'off');
  showSound();
});

// ---------- Display ----------
const setStatus = (text, small = '') => {
  $('status').innerHTML = small ? `${text}<small>${small}</small>` : text;
};
const showScores = () => {
  $('level').textContent = String(pattern.length);
  $('best').textContent = String(best);
};
const enablePads = on => {
  listening = on;
  Object.values(pads).forEach(p => {
    p.disabled = !on;
  });
};

const wait = ms => new Promise(r => setTimeout(r, ms));

const flash = async (name, ms) => {
  pads[name].classList.add('lit');
  play(name);
  await wait(ms);
  pads[name].classList.remove('lit');
};

// ---------- A round ----------
const nextRound = async () => {
  pattern.push(PADS[Math.floor(Math.random() * 4)]);
  step = 0;
  showScores();
  enablePads(false);
  setStatus('Watch', `round ${pattern.length}`);
  await wait(600);
  if (!playing) return;
  // Only the new pad: the rest of the pattern is for you to remember.
  await flash(pattern[pattern.length - 1], 450);
  if (!playing) return;
  setStatus('Your turn', `${pattern.length} tap${pattern.length === 1 ? '' : 's'}`);
  enablePads(true);
};

const press = async name => {
  if (!listening) return;
  if (name !== pattern[step]) {
    gameOver();
    return;
  }
  flash(name, 180);
  step += 1;
  const left = pattern.length - step;
  if (left > 0) {
    setStatus('Your turn', `${left} more`);
    return;
  }
  enablePads(false);
  setStatus('Nice!', 'next round');
  await wait(700);
  if (playing) nextRound();
};

const start = () => {
  if (playing) return;
  playing = true;
  pattern = [];
  $('start').classList.add('hidden');
  $('over').classList.add('hidden');
  nextRound();
};

const gameOver = () => {
  playing = false;
  enablePads(false);
  play('wrong');
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  board.classList.add('wrong');
  setTimeout(() => board.classList.remove('wrong'), 400);
  const rounds = pattern.length - 1;
  const isBest = rounds > best;
  if (isBest) {
    best = rounds;
    localStorage.setItem('memory-best', String(best));
  }
  showScores();
  setStatus('');
  $('over-text').textContent =
    rounds > 0
      ? `You remembered ${rounds} round${rounds === 1 ? '' : 's'} in a row.`
      : 'That one was the wrong pad. Have another go.';
  $('r-level').textContent = String(rounds);
  $('r-best').textContent = String(best);
  $('new-best').classList.toggle('hidden', !isBest || rounds === 0);
  setTimeout(() => {
    $('over').classList.remove('hidden');
    $('start').classList.remove('hidden');
    $('again').focus();
  }, 600);
};

// ---------- Input ----------
Object.entries(pads).forEach(([name, el]) => {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    press(name);
  });
});
$('start').addEventListener('click', start);
$('again').addEventListener('click', start);
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (KEYS[key]) {
    press(KEYS[key]);
  } else if ((e.key === ' ' || e.key === 'Enter') && !playing && e.target.tagName !== 'BUTTON') {
    e.preventDefault();
    start();
  }
});

showSound();
showScores();
setStatus('');
