 /* =========================================================
       1. MAILERLITE SUCCESS CALLBACK
       ========================================================= */
    function ml_webform_success_6141456() {
      var r = window.ml_jQuery || window.jQuery;
      if (r) {
        r('.ml-subscribe-form-6141456 .row-success').show();
        r('.ml-subscribe-form-6141456 .row-form').hide();
      } else {
        document.querySelector('.ml-subscribe-form-6141456 .row-success').style.display = 'block';
        document.querySelector('.ml-subscribe-form-6141456 .row-form').style.display = 'none';
      }
    }

    /* =========================================================
       2. EXIT-INTENT MODAL CONTROLLER
       ========================================================= */
    const modalOverlay = document.getElementById('exitModalOverlay');
    const modalCloseBtn = document.getElementById('exitModalClose');
    const STORAGE_KEY = 'exit_intent_modal_shown';

    function openExitModal() {
      modalOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeExitModal() {
      modalOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Close via X button, backdrop click, or Escape key
    modalCloseBtn.addEventListener('click', closeExitModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeExitModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        closeExitModal();
      }
    });

    // Exit-Intent Detection (triggers once per browser session when cursor exits top viewport)
    let exitIntentArmed = false;

    // Arm after 1.5s so accidental cursor placement on initial page load doesn't misfire
    setTimeout(() => {
      exitIntentArmed = true;
    }, 1500);

    document.addEventListener('mouseout', (e) => {
      if (!exitIntentArmed) return;
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      if (modalOverlay.classList.contains('is-open')) return;

      // Detect cursor leaving through the top edge of the browser window
      const leftViewport = !e.relatedTarget && !e.toElement;
      if (leftViewport && e.clientY <= 10) {
        sessionStorage.setItem(STORAGE_KEY, '1');
        openExitModal();
      }
    });

    /* =========================================================
       3. INTERACTIVE 3D FANNED CARD STACK
       ========================================================= */
    const stage = document.getElementById('cardStage');
    const stack = document.getElementById('cardStack');
    const leftCard = document.querySelector('[data-card="left"]');
    const centerCard = document.querySelector('[data-card="center"]');
    const rightCard = document.querySelector('[data-card="right"]');
    const allCards = [leftCard, centerCard, rightCard];

    const target = { x: 0, y: 0, active: 0 };
    const current = { x: 0, y: 0, active: 0 };
    const lerp = (start, end, factor) => start + (end - start) * factor;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      target.x = Math.max(-1, Math.min(1, nx));
      target.y = Math.max(-1, Math.min(1, ny));
      target.active = 1;

      allCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const gx = ((e.clientX - cardRect.left) / cardRect.width) * 100;
        const gy = ((e.clientY - cardRect.top) / cardRect.height) * 100;
        card.style.setProperty('--glare-x', `${gx}%`);
        card.style.setProperty('--glare-y', `${gy}%`);
      });
    });

    stage.addEventListener('mouseleave', () => {
      target.x = 0;
      target.y = 0;
      target.active = 0;
    });

    function animateCards() {
      current.x = lerp(current.x, target.x, 0.08);
      current.y = lerp(current.y, target.y, 0.08);
      current.active = lerp(current.active, target.active, 0.07);

      const stackRotateY = current.x * 11;
      const stackRotateX = -current.y * 9;
      stack.style.transform = `rotateX(${stackRotateX}deg) rotateY(${stackRotateY}deg)`;

      const spread = current.active * 14;

      // Left card
      const leftX = -58 - spread + current.x * -10;
      const leftY = 12 + current.y * -6;
      const leftRot = -15 - current.active * 3 + current.x * 2.5;
      leftCard.style.transform = `translate3d(${leftX}px, ${leftY}px, -36px) rotate(${leftRot}deg)`;

      // Right card
      const rightX = 58 + spread + current.x * -10;
      const rightY = 12 + current.y * -6;
      const rightRot = 15 + current.active * 3 + current.x * 2.5;
      rightCard.style.transform = `translate3d(${rightX}px, ${rightY}px, -36px) rotate(${rightRot}deg)`;

      // Center card
      const centerX = current.x * 8;
      const centerY = current.y * 6;
      const centerZ = 18 + current.active * 10;
      centerCard.style.transform = `translate3d(${centerX}px, ${centerY}px, ${centerZ}px)`;

      requestAnimationFrame(animateCards);
    }

    animateCards();
