/**
 * Centro de Ciber-Convivencia TIC | Prevención de la Violencia Digital
 * Departamento de TIC - UPEC | Concurso "PONTE 5 EN TU OFICINA"
 */

let launchConfetti = () => {};

document.addEventListener('DOMContentLoaded', () => {
  initConfetti();
  initFullscreen();
  initNavigation();
  initRadar();
  initChatSimulator();
  initShieldInteractive();
  initPledgeWall();
  initMemoryGame();
  initBackgroundMusic();
});

/* ==========================================================================
   Música de fondo: arranca con el primer toque y se puede pausar
   ========================================================================== */
function initBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('btn-music');
  if (!audio || !btn) return;

  audio.volume = 0.5;
  let wantsPlay = true;
  try {
    wantsPlay = localStorage.getItem('bg-music') !== 'off';
  } catch {
    /* almacenamiento bloqueado: se usa el valor por defecto */
  }

  function render(playing) {
    btn.setAttribute('aria-pressed', String(playing));
    btn.textContent = playing ? '🔊 Música' : '🔈 Música';
  }

  function play() {
    audio.play().then(() => render(true)).catch(() => render(false));
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      wantsPlay = true;
      play();
    } else {
      wantsPlay = false;
      audio.pause();
      render(false);
    }
    try {
      localStorage.setItem('bg-music', wantsPlay ? 'on' : 'off');
    } catch {
      /* ignorar */
    }
  });

  audio.addEventListener('pause', () => render(false));
  audio.addEventListener('play', () => render(true));

  // Autoplay: el navegador lo bloquea hasta que haya una interacción del usuario
  if (wantsPlay) {
    const startOnce = () => {
      if (audio.paused && wantsPlay) play();
      document.removeEventListener('pointerdown', startOnce);
      document.removeEventListener('keydown', startOnce);
    };
    document.addEventListener('pointerdown', startOnce);
    document.addEventListener('keydown', startOnce);
    play();
  }
}

/* ==========================================================================
   Efecto ligero de Confeti para logros e interacción
   ========================================================================== */
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = ['#0F5934', '#F2C037', '#0284C7', '#10B981', '#E11D48'];
  let particles = [];
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 90);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 20);
    if (particles.length > 0) {
      animId = requestAnimationFrame(tick);
    } else {
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  launchConfetti = () => {
    const originX = canvas.width * 0.55;
    const originY = canvas.height * 0.35;
    for (let i = 0; i < 65; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 6.5;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 6 + Math.random() * 6,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        life: 75 + Math.random() * 35,
      });
    }
    if (!animId) tick();
  };
}

/* ==========================================================================
   Modo Pantalla Completa
   ========================================================================== */
function initFullscreen() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      alert('Tu navegador bloqueó pantalla completa. También puedes presionar F11.');
    }
  });

  document.addEventListener('fullscreenchange', () => {
    btn.textContent = document.fullscreenElement
      ? '✕ Salir de Pantalla Completa'
      : '⛶ Pantalla Completa';
  });
}

/* ==========================================================================
   Navegación entre vistas y Medidor de Escudo Digital
   ========================================================================== */
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.view-panel');
  const jumpBtns = document.querySelectorAll('.btn-jump');
  const percentEl = document.getElementById('shield-percent');
  const fillEl = document.getElementById('shield-fill');
  const hintEl = document.getElementById('meter-hint');

  const visited = new Set(['radar']);
  const MODULE_COUNT = 5;

  function updateMeter() {
    const pct = Math.round((visited.size / MODULE_COUNT) * 100);
    percentEl.textContent = `${pct}%`;
    fillEl.style.width = `${pct}%`;
    hintEl.textContent =
      pct === 100
        ? '🛡️ ¡Escudo Digital 100% activado!'
        : `Has explorado ${visited.size} de ${MODULE_COUNT} módulos`;
  }

  function showView(viewId) {
    panels.forEach((p) => {
      const match = p.dataset.view === viewId;
      p.hidden = !match;
      p.classList.toggle('is-active', match);
    });

    navBtns.forEach((b) => {
      b.classList.toggle('is-active', b.dataset.view === viewId);
    });

    visited.add(viewId);
    updateMeter();
  }

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  jumpBtns.forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.jump));
  });

  updateMeter();
}

/* ==========================================================================
   Vista 5: Juego de Memoria (Empareja amenaza con respuesta)
   ========================================================================== */
function initMemoryGame() {
  const board = document.getElementById('game-board');
  const statusEl = document.getElementById('game-status');
  const movesEl = document.getElementById('game-moves');
  const resetBtn = document.getElementById('btn-game-reset');
  if (!board || !statusEl || !movesEl || !resetBtn) return;

  const pairs = [
    { id: 'a', threat: '💬 Burla en el grupo de la oficina', answer: '🛡️ Pedir respeto y reportar al responsable' },
    { id: 'b', threat: '📸 Captura privada reenviada', answer: '🔒 No reenviar y borrar el contenido' },
    { id: 'c', threat: '🎭 Cuenta falsa con tu nombre', answer: '🚩 Reportar la suplantación a TIC' },
    { id: 'd', threat: '🚫 Excluido de los canales oficiales', answer: '🤝 Reincorporar por canales oficiales' },
  ];

  let flipped = [];
  let lock = false;
  let matched = 0;
  let moves = 0;

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function onFlip(card) {
    if (lock || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');
    card.setAttribute('aria-label', `${card.dataset.text}, boca arriba`);
    flipped.push(card);
    if (flipped.length < 2) return;

    moves++;
    movesEl.textContent = `Movimientos: ${moves}`;
    const [first, second] = flipped;

    if (first.dataset.pair === second.dataset.pair) {
      first.classList.add('is-matched');
      second.classList.add('is-matched');
      flipped = [];
      matched++;
      if (matched === pairs.length) {
        statusEl.textContent = `🏆 ¡Completaste el juego en ${moves} movimientos! Escudo reforzado.`;
        launchConfetti();
      } else {
        statusEl.textContent = '✅ ¡Pareja correcta!';
      }
    } else {
      lock = true;
      statusEl.textContent = 'No coincide, intenta de nuevo.';
      setTimeout(() => {
        // Si se reinició el tablero mientras esperaba, no tocar las cartas nuevas
        if (!board.contains(first)) return;
        first.classList.remove('is-flipped');
        second.classList.remove('is-flipped');
        first.setAttribute('aria-label', 'Carta boca abajo');
        second.setAttribute('aria-label', 'Carta boca abajo');
        flipped = [];
        lock = false;
      }, 900);
    }
  }

  function build() {
    board.innerHTML = '';
    flipped = [];
    lock = false;
    matched = 0;
    moves = 0;
    movesEl.textContent = 'Movimientos: 0';
    statusEl.textContent = `Encuentra las ${pairs.length} parejas.`;

    const cards = shuffle(
      pairs.flatMap((p) => [
        { pair: p.id, text: p.threat },
        { pair: p.id, text: p.answer },
      ])
    );

    cards.forEach((data, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memo-card';
      card.dataset.pair = data.pair;
      card.dataset.text = data.text;
      card.setAttribute('aria-label', `Carta ${index + 1}, boca abajo`);

      const back = document.createElement('span');
      back.className = 'memo-face memo-back';
      back.setAttribute('aria-hidden', 'true');
      back.textContent = '?';

      const front = document.createElement('span');
      front.className = 'memo-face memo-front';
      front.textContent = data.text;

      card.append(back, front);
      card.addEventListener('click', () => onFlip(card));
      board.appendChild(card);
    });
  }

  resetBtn.addEventListener('click', build);
  build();
}

/* ==========================================================================
   Vista 1: Radar Digital (Inspector interactivo)
   ========================================================================== */
function initRadar() {
  const threats = {
    ciberacoso: {
      badge: 'Amenaza Digital #1',
      title: '💬 Ciberacoso Laboral',
      desc: 'Hostigamiento reiterado mediante chats grupales, correos o mensajes con burlas, humillaciones o presión agresiva fuera de horario.',
      example: 'Crear memes ridiculizando a un compañero en el grupo de WhatsApp de la oficina.',
      alert: 'Afecta la salud emocional y genera ansiedad al revisar el celular o el correo.',
      riskLabel: 'Impacto Emocional: Alto',
      riskPct: 82,
    },
    doxxing: {
      badge: 'Amenaza Digital #2',
      title: '📸 Difusión sin Consentimiento (Doxxing)',
      desc: 'Publicar o reenviar fotografías, audios, capturas de conversaciones privadas o datos personales sin autorización.',
      example: 'Reenviar la captura de un chat privado o el número personal de un colega sin su permiso.',
      alert: 'Es una vulneración grave a la privacidad que puede escalar a extorsión.',
      riskLabel: 'Riesgo de Privacidad: Crítico',
      riskPct: 95,
    },
    suplantacion: {
      badge: 'Amenaza Digital #3',
      title: '🎭 Suplantación de Identidad',
      desc: 'Crear perfiles falsos o utilizar la cuenta institucional o personal de otra persona para enviar mensajes dañinos.',
      example: 'Abrir una cuenta anónima con la foto de un docente o administrativo para difundir rumores.',
      alert: 'Activa siempre la verificación en dos pasos (2FA) y no compartas tus contraseñas.',
      riskLabel: 'Riesgo Reputacional: Crítico',
      riskPct: 90,
    },
    exclusion: {
      badge: 'Amenaza Digital #4',
      title: '🚫 Exclusión Digital Deliberada',
      desc: 'Aislar intencionalmente a un integrante de canales de comunicación, grupos de coordinación o reuniones virtuales.',
      example: 'Dejar fuera del grupo oficial de trabajo a una persona para impedirle cumplir sus funciones.',
      alert: 'El aislamiento digital también es una forma de violencia psicológica y laboral.',
      riskLabel: 'Impacto Laboral: Alto',
      riskPct: 78,
    },
  };

  const items = document.querySelectorAll('.threat-item');
  const inspector = document.getElementById('threat-inspector');

  function renderThreat(key) {
    const data = threats[key];
    if (!data || !inspector) return;

    inspector.innerHTML = `
      <span class="inspector-badge">${data.badge}</span>
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <div class="risk-row">
        <span>${data.riskLabel}</span>
        <div class="risk-bar"><div class="risk-fill" style="width: ${data.riskPct}%"></div></div>
      </div>
      <div class="inspector-box">
        <strong>Ejemplo en la oficina:</strong>
        <span>${data.example}</span>
      </div>
      <div class="inspector-box">
        <strong>Señal de alerta:</strong>
        <span>${data.alert}</span>
      </div>
    `;
  }

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      renderThreat(btn.dataset.threat);
    });
  });

  renderThreat('ciberacoso');
}

/* ==========================================================================
   Vista 2: Simulador de Chat / WhatsApp
   ========================================================================== */
function initChatSimulator() {
  const cases = [
    {
      avatar: '👥',
      sender: 'Grupo Café Oficina',
      time: 'Hoy · 10:14',
      message: '😂 Miren esta foto que le tomé sin que se dé cuenta a nuestro compañero, hagámosla sticker para el grupo.',
      answer: 'violence',
      feedback: '🚨 Violencia Digital: Tomar y difundir fotos sin consentimiento para burlarse es ciberacoso. ¡No seas cómplice!',
    },
    {
      avatar: '📧',
      sender: 'Coordinación TIC',
      time: 'Hoy · 11:30',
      message: 'Buenos días estimado/a, cuando tengas un espacio dentro de tu jornada, ¿me ayudas revisando el acta? ¡Muchas gracias!',
      answer: 'safe',
      feedback: '✅ Buen Trato Digital: Mensaje cordial, claro y respetuoso del horario laboral.',
    },
    {
      avatar: '📱',
      sender: 'Número Desconocido',
      time: 'Ayer · 22:48',
      message: 'Si no haces lo que te digo mañana, voy a reenviar tus capturas privadas a toda la dirección.',
      answer: 'violence',
      feedback: '🚨 Violencia Digital: Es extorsión y hostigamiento. No cedas: guarda capturas, bloquea y reporta institucionalmente.',
    },
    {
      avatar: '🎭',
      sender: 'Perfil Anónimo',
      time: 'Hoy · 09:05',
      message: 'Usando una cuenta falsa publiqué el teléfono personal y dirección de un colega para que le escriban reclamos.',
      answer: 'violence',
      feedback: '🚨 Violencia Digital (Doxxing y Suplantación): Exponer datos personales sin permiso vulnera la seguridad de la persona.',
    },
  ];

  const avatarEl = document.getElementById('chat-avatar');
  const senderEl = document.getElementById('chat-sender');
  const timeEl = document.getElementById('chat-time');
  const bubbleEl = document.getElementById('chat-bubble');
  const progressEl = document.getElementById('sim-progress');
  const scoreEl = document.getElementById('sim-score');
  const feedbackEl = document.getElementById('sim-feedback');
  const btnNext = document.getElementById('btn-sim-next');
  const choiceBtns = document.querySelectorAll('.btn-sim-choice');
  const phoneMockup = document.querySelector('.phone-mockup');

  let index = 0;
  let score = 0;
  let locked = false;

  function renderCase() {
    const c = cases[index];
    locked = false;
    avatarEl.textContent = c.avatar;
    senderEl.textContent = c.sender;
    timeEl.textContent = c.time;
    bubbleEl.textContent = c.message;
    progressEl.textContent = `Caso ${index + 1} de ${cases.length}`;
    feedbackEl.hidden = true;
    btnNext.hidden = true;
    if (phoneMockup) phoneMockup.classList.remove('is-alert', 'is-safe');
  }

  choiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;

      const c = cases[index];
      const ok = btn.dataset.choice === c.answer;
      if (ok) score += 1;

      if (phoneMockup) {
        phoneMockup.classList.remove('is-alert', 'is-safe');
        phoneMockup.classList.add(c.answer === 'violence' ? 'is-alert' : 'is-safe');
      }

      scoreEl.textContent = `Aciertos: ${score} / ${cases.length}`;
      feedbackEl.textContent = ok ? `¡Exacto! ${c.feedback}` : `Atención: ${c.feedback}`;
      feedbackEl.className = `sim-feedback ${ok ? 'is-ok' : 'is-bad'}`;
      feedbackEl.hidden = false;

      if (index === cases.length - 1 && score >= 3) {
        launchConfetti();
      }

      btnNext.textContent = index < cases.length - 1 ? 'Siguiente Mensaje →' : '🔄 Reiniciar Simulador';
      btnNext.hidden = false;
    });
  });

  btnNext.addEventListener('click', () => {
    if (index < cases.length - 1) {
      index += 1;
    } else {
      index = 0;
      score = 0;
      scoreEl.textContent = `Aciertos: 0 / ${cases.length}`;
    }
    renderCase();
  });

  renderCase();
}

/* ==========================================================================
   Vista 3: Reglas Interactivas + Protocolo SOS en 3 Clics
   ========================================================================== */
function initShieldInteractive() {
  const ruleButtons = document.querySelectorAll('.rule-toggle');
  const rulesCounter = document.getElementById('rules-counter');
  const completeBanner = document.getElementById('shield-complete-banner');

  ruleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const checked = btn.classList.toggle('is-checked');
      btn.setAttribute('aria-pressed', String(checked));
      btn.querySelector('.rule-check').textContent = checked ? '✔' : '○';

      const total = document.querySelectorAll('.rule-toggle.is-checked').length;
      if (rulesCounter) {
        rulesCounter.textContent = `${total} / ${ruleButtons.length} activadas`;
      }
      if (completeBanner) {
        const allDone = total === ruleButtons.length;
        completeBanner.hidden = !allDone;
        if (allDone) launchConfetti();
      }
    });
  });

  const sosData = {
    1: {
      title: '1. Conserva toda la evidencia',
      text: 'No borres mensajes, correos ni audios. Toma capturas de pantalla donde se observe claramente la fecha, la hora y el perfil o número del remitente.',
    },
    2: {
      title: '2. Bloquea y reporta',
      text: 'Bloquea al agresor en la red social o aplicación de mensajería para frenar el contacto inmediato y utiliza el botón de reporte de la plataforma.',
    },
    3: {
      title: '3. Busca apoyo institucional',
      text: 'No enfrentes esto en silencio. Acude a Bienestar Universitario, Talento Humano o solicita orientación técnica al Departamento de TIC.',
    },
  };

  const sosTabs = document.querySelectorAll('.sos-tab');
  const sosBox = document.getElementById('sos-detail-box');

  function renderSos(step) {
    const info = sosData[step];
    if (!info || !sosBox) return;
    sosBox.innerHTML = `<h4>${info.title}</h4><p>${info.text}</p>`;
  }

  sosTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      sosTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderSos(tab.dataset.sos);
    });
  });

  renderSos('1');
}

/* ==========================================================================
   Vista 4: Muro Colaborativo TIC con Reacciones
   ========================================================================== */
function initPledgeWall() {
  const form = document.getElementById('wall-form');
  const nameInput = document.getElementById('wall-name');
  const pledgeInput = document.getElementById('wall-pledge');
  const gridEl = document.getElementById('wall-grid');
  const counterEl = document.getElementById('wall-counter');
  const ambassadorBanner = document.getElementById('ambassador-banner');
  const ambassadorTitle = document.getElementById('ambassador-title');
  if (!form || !gridEl) return;

  const emojis = ['💻', '🛡️', '🤝', '⚡', '🔒', '🌟'];
  let count = gridEl.querySelectorAll('.wall-card').length;

  // Delegación para dar "👏" a cualquier compromiso del muro
  gridEl.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;
    const current = Number(likeBtn.dataset.likes || 0) + 1;
    likeBtn.dataset.likes = String(current);
    likeBtn.querySelector('span').textContent = String(current);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = nameInput.value.trim();
    if (!author) return;

    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `
      <span class="wall-emoji" aria-hidden="true">${emojis[count % emojis.length]}</span>
      <div class="wall-card-body">
        <strong></strong>
        <p></p>
        <button type="button" class="like-btn" data-likes="1">👏 <span>1</span></button>
      </div>
    `;
    card.querySelector('strong').textContent = author;
    card.querySelector('p').textContent = pledgeInput.value;

    gridEl.prepend(card);
    count += 1;
    counterEl.textContent = `Compromisos: ${count}`;

    if (ambassadorBanner && ambassadorTitle) {
      ambassadorTitle.textContent = `¡Insignia Digital desbloqueada para ${author}!`;
      ambassadorBanner.hidden = false;
    }
    launchConfetti();

    nameInput.value = '';
    nameInput.focus();
  });
}
