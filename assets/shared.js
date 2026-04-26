/* shared.js – cursor & guard, loaded in <head> so guard fires before content renders */

var GUARD_QUESTIONS = [
  {
    text: 'What is the answer to the <em>Ultimate Question of Life, the Universe, and Everything</em>?',
    plain: 'What is the answer to the Ultimate Question of Life, the Universe, and Everything?',
    answers: ['42']
  },
  {
    text: 'What is the value of the <em>square root of −1</em>?',
    plain: 'What is the value of the square root of -1?',
    answers: ['i', 'sqrt(-1)', '√-1', '√(−1)', 'sqrt(−1)']
  },
  {
    text: 'What is the <em>only even prime number</em>?',
    plain: 'What is the only even prime number?',
    answers: ['2']
  },
  {
    text: 'How many <em>bits</em> are in a byte?',
    plain: 'How many bits are in a byte?',
    answers: ['8']
  },
  {
    text: 'What is the sum of <em>angles in a triangle</em> (in degrees)?',
    plain: 'What is the sum of angles in a triangle (in degrees)?',
    answers: ['180', '180°', '180 degrees']
  }
];

function initGuard() {
  if (sessionStorage.getItem('guardPassed')) return;

  var q = GUARD_QUESTIONS[Math.floor(Math.random() * GUARD_QUESTIONS.length)];

  var overlay = document.createElement('div');
  overlay.id = 'guard-overlay';
  overlay.innerHTML =
    '<div class="guard-inner">' +
      '<div class="guard-index">// access verification</div>' +
      '<div class="guard-question" id="guard-q">' + q.text + '</div>' +
      '<div class="guard-form">' +
        '<input class="guard-input" id="guard-input" type="text" placeholder="your answer\u2026" autocomplete="off" />' +
        '<button class="guard-submit" id="guard-btn">Enter</button>' +
      '</div>' +
      '<div class="guard-hint">Wrong answer? You\u2019ll be redirected to Google.</div>' +
    '</div>';

  document.body.insertBefore(overlay, document.body.firstChild);

  setTimeout(function () {
    var inp = document.getElementById('guard-input');
    if (inp) inp.focus();
  }, 150);

  function check() {
    var val = document.getElementById('guard-input').value.trim().toLowerCase();
    var correct = q.answers.some(function (a) { return val === a.toLowerCase(); });
    if (correct) {
      sessionStorage.setItem('guardPassed', '1');
      var ov = document.getElementById('guard-overlay');
      ov.classList.add('fade-out');
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 650);
    } else {
      var input = document.getElementById('guard-input');
      input.classList.remove('error');
      void input.offsetWidth;
      input.classList.add('error');
      setTimeout(function () {
        window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q.plain);
      }, 400);
    }
  }

  document.getElementById('guard-btn').addEventListener('click', check);
  document.getElementById('guard-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') check();
  });
}

function initCursor() {
  if (window.matchMedia('(max-width: 900px)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  var canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var mx = -100, my = -100;
  var particles = [];

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    dot.style.opacity = '1';
    for (var i = 0; i < 3; i++) {
      particles.push({
        x: mx + (Math.random() - 0.5) * 4,
        y: my + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 + 0.5,
        life: 1,
        size: Math.random() * 2.5 + 1
      });
    }
  });

  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,150,90,' + (p.life * 0.6) + ')';
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
}
