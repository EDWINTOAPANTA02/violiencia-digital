/**
 * Escudo Digital del Buen Trato: Prevención de la Violencia Digital
 * Departamento de TIC - UPEC | Concurso "PONTE 5 EN TU OFICINA"
 */

document.addEventListener('DOMContentLoaded', () => {
  initFullscreenToggle();
  initTabs();
  initConceptCards();
  initDetectorQuiz();
  initPledgeWall();
});

/* ==========================================================================
   Modo Pantalla Completa
   ========================================================================== */
function initFullscreenToggle() {
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (!btnFullscreen) return;

  function updateLabel() {
    const isFull = Boolean(document.fullscreenElement);
    btnFullscreen.textContent = isFull ? '✕ Salir de Pantalla Completa' : '⛶ Pantalla Completa';
  }

  btnFullscreen.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error al cambiar pantalla completa:', error);
      alert('Tu navegador bloqueó el modo pantalla completa. También puedes presionar F11.');
    }
  });

  document.addEventListener('fullscreenchange', updateLabel);
}

/* ==========================================================================
   Navegación entre Módulos (1 al 4)
   ========================================================================== */
function initTabs() {
  const pills = document.querySelectorAll('.step-pill');
  const panels = document.querySelectorAll('.step-panel');
  const goButtons = document.querySelectorAll('.btn-go-tab');

  function activateTab(tabNumber) {
    const target = String(tabNumber);

    panels.forEach((panel) => {
      const isMatch = panel.dataset.tab === target;
      panel.hidden = !isMatch;
      panel.classList.toggle('is-active', isMatch);
    });

    pills.forEach((pill) => {
      pill.classList.toggle('is-active', pill.dataset.tab === target);
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => activateTab(pill.dataset.tab));
  });

  goButtons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.next));
  });
}

/* ==========================================================================
   Módulo 1: Tarjetas desplegables de Tipos de Violencia Digital
   ========================================================================== */
function initConceptCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach((card) => {
    const detail = card.querySelector('.card-detail');
    const hint = card.querySelector('.card-toggle-hint');

    function toggleCard() {
      const isOpen = card.classList.toggle('is-open');
      detail.hidden = !isOpen;
      hint.textContent = isOpen ? 'Ocultar detalle ▴' : 'Ver detalle ▾';
    }

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });
  });
}

/* ==========================================================================
   Módulo 2: Detector Interactivo ("¿Buen Trato o Violencia Digital?")
   ========================================================================== */
function initDetectorQuiz() {
  const cases = [
    {
      question:
        '1. En un grupo de WhatsApp de la oficina, alguien comparte un meme burlándose del aspecto físico de un compañero y otros lo reenvían.',
      answer: 'violence',
      explanation:
        '🚨 Es Violencia Digital (Ciberacoso). Reenviar burlas o memes ofensivos normaliza el hostigamiento. ¡Corta la cadena!',
    },
    {
      question:
        '2. Un compañero te envía un correo respetuoso en horario laboral solicitando apoyo con un informe y agradeciendo tu tiempo.',
      answer: 'safe',
      explanation:
        '✅ Es Buen Trato Digital. La comunicación clara, cordial y dentro de horarios laborales fortalece el respeto.',
    },
    {
      question:
        '3. Alguien publica sin permiso el número personal y una captura de chat privado de una colega para exponerla en redes.',
      answer: 'violence',
      explanation:
        '🚨 Es Violencia Digital (Difusión sin consentimiento / Doxxing). Vulnerar la privacidad ajena es una falta grave.',
    },
    {
      question:
        '4. Crean un perfil anónimo en redes sociales para desacreditar el trabajo de un docente o administrativo durante una reunión virtual.',
      answer: 'violence',
      explanation:
        '🚨 Es Violencia Digital (Suplantación / Hostigamiento). El anonimato no justifica la agresión ni el daño reputacional.',
    },
  ];

  const questionEl = document.getElementById('quiz-question');
  const progressEl = document.getElementById('quiz-progress');
  const scoreEl = document.getElementById('quiz-score');
  const actionsEl = document.getElementById('quiz-actions');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextWrapEl = document.getElementById('quiz-next-wrap');
  const btnNext = document.getElementById('btn-quiz-next');
  const choiceBtns = document.querySelectorAll('.btn-choice');

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  function renderCase() {
    const item = cases[currentIndex];
    answered = false;
    progressEl.textContent = `Caso ${currentIndex + 1} de ${cases.length}`;
    questionEl.textContent = item.question;
    feedbackEl.hidden = true;
    feedbackEl.className = 'quiz-feedback';
    nextWrapEl.hidden = true;
    actionsEl.hidden = false;
  }

  choiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      const userChoice = btn.dataset.choice;
      const item = cases[currentIndex];
      const isCorrect = userChoice === item.answer;

      if (isCorrect) score += 1;
      scoreEl.textContent = `Aciertos: ${score} / ${cases.length}`;

      feedbackEl.textContent = isCorrect
        ? `¡Correcto! ${item.explanation}`
        : `Atención: ${item.explanation}`;
      feedbackEl.className = `quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
      feedbackEl.hidden = false;
      actionsEl.hidden = true;

      btnNext.textContent =
        currentIndex < cases.length - 1 ? 'Siguiente Caso →' : '🔄 Reiniciar Detector';
      nextWrapEl.hidden = false;
    });
  });

  btnNext.addEventListener('click', () => {
    if (currentIndex < cases.length - 1) {
      currentIndex += 1;
    } else {
      currentIndex = 0;
      score = 0;
      scoreEl.textContent = `Aciertos: 0 / ${cases.length}`;
    }
    renderCase();
  });

  renderCase();
}

/* ==========================================================================
   Módulo 4: Muro Colaborativo de Compromisos TIC
   ========================================================================== */
function initPledgeWall() {
  const form = document.getElementById('pledge-form');
  const nameInput = document.getElementById('pledge-name');
  const selectInput = document.getElementById('pledge-select');
  const wallEl = document.getElementById('pledge-wall');
  const counterEl = document.getElementById('pledge-counter');

  if (!form || !wallEl) return;

  const emojis = ['💻', '🛡️', '🤝', '🌟', '💚', '🔒'];
  let pledgeCount = wallEl.querySelectorAll('.pledge-chip').length;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const author = nameInput.value.trim();
    if (!author) return;

    const commitment = selectInput.value;
    const emoji = emojis[pledgeCount % emojis.length];

    const chip = document.createElement('div');
    chip.className = 'pledge-chip';
    chip.innerHTML = `<span class="pledge-emoji" aria-hidden="true">${emoji}</span><div><strong></strong><p></p></div>`;
    chip.querySelector('strong').textContent = author;
    chip.querySelector('p').textContent = commitment;

    wallEl.prepend(chip);
    pledgeCount += 1;
    counterEl.textContent = `Compromisos: ${pledgeCount}`;
    nameInput.value = '';
    nameInput.focus();
  });
}
