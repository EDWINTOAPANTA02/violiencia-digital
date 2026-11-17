/**
 * Centro de Ciber-Convivencia TIC | Prevención de la Violencia Digital
 * Departamento de TIC - UPEC | Concurso "PONTE 5 EN TU OFICINA"
 */

document.addEventListener('DOMContentLoaded', () => {
  initFullscreen();
  initNavigation();
  initRadar();
  initChatSimulator();
  initPledgeWall();
});

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

  function updateMeter() {
    const pct = Math.round((visited.size / 4) * 100);
    percentEl.textContent = `${pct}%`;
    fillEl.style.width = `${pct}%`;
    hintEl.textContent =
      pct === 100
        ? '🛡️ ¡Escudo Digital 100% activado!'
        : `Has explorado ${visited.size} de 4 módulos`;
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
    },
    doxxing: {
      badge: 'Amenaza Digital #2',
      title: '📸 Difusión sin Consentimiento (Doxxing)',
      desc: 'Publicar o reenviar fotografías, audios, capturas de conversaciones privadas o datos personales sin autorización.',
      example: 'Reenviar la captura de un chat privado o el número personal de un colega sin su permiso.',
      alert: 'Es una vulneración grave a la privacidad que puede escalar a extorsión.',
    },
    suplantacion: {
      badge: 'Amenaza Digital #3',
      title: '🎭 Suplantación de Identidad',
      desc: 'Crear perfiles falsos o utilizar la cuenta institucional o personal de otra persona para enviar mensajes dañinos.',
      example: 'Abrir una cuenta anónima con la foto de un docente o administrativo para difundir rumores.',
      alert: 'Activa siempre la verificación en dos pasos (2FA) y no compartas tus contraseñas.',
    },
    exclusion: {
      badge: 'Amenaza Digital #4',
      title: '🚫 Exclusión Digital Deliberada',
      desc: 'Aislar intencionalmente a un integrante de canales de comunicación, grupos de coordinación o reuniones virtuales.',
      example: 'Dejar fuera del grupo oficial de trabajo a una persona para impedirle cumplir sus funciones.',
      alert: 'El aislamiento digital también es una forma de violencia psicológica y laboral.',
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
  }

  choiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;

      const c = cases[index];
      const ok = btn.dataset.choice === c.answer;
      if (ok) score += 1;

      scoreEl.textContent = `Aciertos: ${score} / ${cases.length}`;
      feedbackEl.textContent = ok ? `¡Exacto! ${c.feedback}` : `Atención: ${c.feedback}`;
      feedbackEl.className = `sim-feedback ${ok ? 'is-ok' : 'is-bad'}`;
      feedbackEl.hidden = false;
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
   Vista 4: Muro Colaborativo TIC
   ========================================================================== */
function initPledgeWall() {
  const form = document.getElementById('wall-form');
  const nameInput = document.getElementById('wall-name');
  const pledgeInput = document.getElementById('wall-pledge');
  const gridEl = document.getElementById('wall-grid');
  const counterEl = document.getElementById('wall-counter');
  if (!form || !gridEl) return;

  const emojis = ['💻', '🛡️', '🤝', '⚡', '🔒', '🌟'];
  let count = gridEl.querySelectorAll('.wall-card').length;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = nameInput.value.trim();
    if (!author) return;

    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `<span class="wall-emoji" aria-hidden="true">${emojis[count % emojis.length]}</span><div><strong></strong><p></p></div>`;
    card.querySelector('strong').textContent = author;
    card.querySelector('p').textContent = pledgeInput.value;

    gridEl.prepend(card);
    count += 1;
    counterEl.textContent = `Compromisos: ${count}`;
    nameInput.value = '';
    nameInput.focus();
  });
}
