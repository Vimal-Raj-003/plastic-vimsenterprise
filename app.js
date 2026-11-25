/* ============================================================================
   VIMS ENTERPRISES — NON-STOP HEADER POLYMER POURING, SCROLL PROCESS TIMELINE,
   FAST AUTO-MOVING CIRCULAR MEDALLION CARDS, DETAILS MODAL & COMPLETE FOOTER
   ============================================================================ */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. POLYMER CATALOG WITH DEMO RATES & REAL PHOTOGRAPHS
  // --------------------------------------------------------------------------
  const POLYMER_CATALOG = [
    {
      id: 'pp-homo',
      shortCode: 'PP',
      name: 'Polypropylene (PP)',
      rate: '₹118 / kg',
      grade: 'Virgin Injection & Raffia Grade',
      color: 'Natural Virgin White',
      density: '0.90 – 0.91 g/cm³',
      photo: 'assets/user_card_2_white.jpg',
      description:
        'High stiffness, chemical resistance, and fatigue durability for automotive, packaging, and household molded components.'
    },
    {
      id: 'hdpe-cobalt',
      shortCode: 'HDPE',
      name: 'High-Density Polyethylene',
      rate: '₹124 / kg',
      grade: 'High-Rigidity Molding & Blow Grade',
      color: 'Cobalt Blue',
      density: '0.94 – 0.96 g/cm³',
      photo: 'assets/gemini_grade_2_hdpe.jpg',
      description:
        'High impact strength, low moisture absorption, and strong environmental stress-crack resistance for crates, drums, and pipes.'
    },
    {
      id: 'pa66-green',
      shortCode: 'PA66',
      name: 'Polyamide 66 (Nylon 66)',
      rate: '₹195 / kg',
      grade: 'Heat-Stabilized Structural Grade',
      color: 'Emerald Green',
      density: '1.14 – 1.15 g/cm³',
      photo: 'assets/user_upload_2_green_bowl.jpg',
      description:
        'Superior thermal resistance, tensile rigidity, and wear resistance for high-load mechanical gears and automotive connectors.'
    },
    {
      id: 'pa6-red',
      shortCode: 'PA6',
      name: 'Polyamide 6 (Nylon 6)',
      rate: '₹185 / kg',
      grade: 'Engineering Gear & Bearing Grade',
      color: 'Crimson Red',
      density: '1.13 – 1.15 g/cm³',
      photo: 'assets/user_upload_3_red_mound.jpg',
      description:
        'High toughness, abrasion resistance, and damping capacity for dynamic spur gears, power tool housings, and brackets.'
    },
    {
      id: 'abs-amber',
      shortCode: 'ABS',
      name: 'ABS Engineering Resin',
      rate: '₹152 / kg',
      grade: 'High-Gloss Injection Molding Grade',
      color: 'Amber Gold',
      density: '1.04 – 1.06 g/cm³',
      photo: 'assets/gemini_grade_5_abs.jpg',
      description:
        'Balanced impact toughness, surface gloss, and dimensional accuracy for electronics enclosures and automotive fascia.'
    },
    {
      id: 'pet-clear',
      shortCode: 'PET',
      name: 'PET Polyester Granules',
      rate: '₹114 / kg',
      grade: 'Optical Preform & Bottle Grade',
      color: 'Crystal Clear',
      density: '1.33 – 1.38 g/cm³',
      photo: 'assets/gemini_grade_4_pet.jpg',
      description:
        'High optical clarity, gas barrier performance, and dimensional stability for beverage preforms and transparent packaging.'
    },
    {
      id: 'pc-optical',
      shortCode: 'PC',
      name: 'Polycarbonate (PC)',
      rate: '₹210 / kg',
      grade: 'High-Impact Optical & Lens Grade',
      color: 'Transparent Clear',
      density: '1.20 – 1.22 g/cm³',
      photo: 'assets/tp_poly_2_pc.jpg',
      description:
        'Exceptional impact toughness, thermal stability, and optical transparency for automotive lighting lenses and switchgear.'
    },
    {
      id: 'ldpe-film',
      shortCode: 'LDPE',
      name: 'Low-Density Polyethylene',
      rate: '₹122 / kg',
      grade: 'Flexible Molding & Film Grade',
      color: 'Translucent Natural',
      density: '0.91 – 0.93 g/cm³',
      photo: 'assets/gemini_grade_3_ldpe.jpg',
      description:
        'Excellent flexibility, toughness, and melt flow characteristics for thin-wall closures, liners, and cable jacketing.'
    },
    {
      id: 'pvc-grey',
      shortCode: 'PVC',
      name: 'PVC Industrial Compound',
      rate: '₹108 / kg',
      grade: 'Rigid Fitting & Conduit Compound',
      color: 'Industrial Slate Grey',
      density: '1.35 – 1.45 g/cm³',
      photo: 'assets/gemini_grade_6_pvc.jpg',
      description:
        'Inherent flame retardancy, chemical resistance, and weatherability for industrial pipe fittings, valves, and conduit boxes.'
    }
  ];

  // --------------------------------------------------------------------------
  // 2. SCENE DEFINITIONS & PROCESS TIMELINE MAPPING
  // --------------------------------------------------------------------------
  const SCENE_DEFINITIONS = [
    { startFrame: 1, endFrame: 36, isHero: true, timelineIdx: 0 },
    {
      startFrame: 37,
      endFrame: 60,
      isHero: false,
      timelineIdx: 1,
      kicker: 'STAGE 01 • HOPPER FEED',
      title: 'Granules Enter Hopper',
      caption: 'Real polymer granules flow directly into the stainless-steel machine hopper.'
    },
    {
      startFrame: 61,
      endFrame: 82,
      isHero: false,
      timelineIdx: 2,
      kicker: 'STAGE 02 • BARREL REVEAL',
      title: 'Opening the Barrel Core',
      caption: 'The outer stainless shroud parts open to reveal the feed throat and screw.'
    },
    {
      startFrame: 83,
      endFrame: 108,
      isHero: false,
      timelineIdx: 2,
      kicker: 'STAGE 03 • PLASTICIZING',
      title: 'Screw Conveying & Melting',
      caption: 'The rotating helical screw conveys solid granules forward into a smooth melt.'
    },
    {
      startFrame: 109,
      endFrame: 134,
      isHero: false,
      timelineIdx: 3,
      kicker: 'STAGE 04 • MOLD INJECTION',
      title: 'Filling the Closed Cavity',
      caption: 'Molten polymer flows through the runner passage to fill the precision gear cavity.'
    },
    {
      startFrame: 135,
      endFrame: 156,
      isHero: false,
      timelineIdx: 4,
      kicker: 'STAGE 05 • COOLING & OPENING',
      title: 'Solidification & Unclamping',
      caption: 'The molded gear cools solid before the movable steel mold half opens.'
    },
    {
      startFrame: 157,
      endFrame: 180,
      isHero: false,
      timelineIdx: 5,
      kicker: 'STAGE 06 • FINISHED COMPONENT',
      title: 'Precision Molded Gear',
      caption: 'Ejector pins release the finished solid gear component from the mold.'
    }
  ];

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function clamp01(val) {
    return Math.max(0, Math.min(1, val));
  }

  // --------------------------------------------------------------------------
  // 3. 2D IMAGE-SEQUENCE PLAYER + NON-STOP 60FPS HEADER POLYMER POURING
  // --------------------------------------------------------------------------
  const storySection = document.getElementById('home');
  const seqCanvas = document.getElementById('sequence-scroll-canvas');
  const seqCtx = seqCanvas ? seqCanvas.getContext('2d', { alpha: false }) : null;
  const pourCanvas = document.getElementById('live-continuous-pour-canvas');
  const pourCtx = pourCanvas ? pourCanvas.getContext('2d') : null;
  const heroOverlay = document.getElementById('hero-opening-overlay');
  const captionOverlay = document.getElementById('scene-caption-overlay');
  const captionKicker = document.getElementById('scene-caption-kicker');
  const captionTitle = document.getElementById('scene-caption-title');
  const captionBody = document.getElementById('scene-caption-body');
  const vizNodes = Array.from(document.querySelectorAll('.viz-stage-node'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-nav-section]'));

  const TOTAL_PROCESS_FRAMES = 180;
  const TOTAL_HERO_FRAMES = 36;
  const CACHE_RADIUS = 28;

  const processFrameCache = new Map();
  const heroFrameCache = new Map();
  let posterImage = null;

  let activeControllerMode = 'hero-loop';
  let canonicalScrollProgress = 0;
  let targetProcessFrame = 1;
  let scrollDirection = 1;
  let paintGenerationToken = 0;
  let lastDrawMetrics = null;

  let heroLoopIndex = 1;
  let lastHeroTickTime = performance.now();
  const HERO_FRAME_INTERVAL_MS = 1000 / 24;

  // 36 live continuous 60FPS 3D-shaded cylindrical polymer pellets that pour NON-STOP
  // from the tilted borosilicate glass container mouth whenever the user is on the header!
  const PELLET_COLORS = [
    { top: '#589efc', mid: '#1a62da', bot: '#0c3080', cap: '#2e7cf0' }, // Cobalt Blue
    { top: '#fee876', mid: '#e8b822', bot: '#9e720c', cap: '#f5ce3e' }, // Golden Yellow
    { top: '#5cd688', mid: '#169a4e', bot: '#0a562a', cap: '#2cb666' }, // Emerald Green
    { top: '#f2606a', mid: '#c01c2a', bot: '#6c0c14', cap: '#d83442' }, // Crimson Red
    { top: '#fcfeff', mid: '#dae2ec', bot: '#9ca8b8', cap: '#ecf2f8' }  // Natural White
  ];

  const liveStreamPellets = Array.from({ length: 34 }, (_, i) => {
    const r1 = ((i * 73 + 19) % 100) / 100;
    const r2 = ((i * 41 + 53) % 100) / 100;
    return {
      color: PELLET_COLORS[i % PELLET_COLORS.length],
      progress: i / 34,
      speed: 0.0085 + (i % 4) * 0.0018,
      startX: 0.748 + (r1 - 0.5) * 0.044,
      endX: 0.766 + (r2 - 0.5) * 0.078,
      scale: 0.92 + (i % 3) * 0.14,
      angle: ((r1 - 0.5) * 0.75),
      rotSpeed: (i % 2 === 0 ? 1 : -1) * 0.008
    };
  });

  function drawLive3DCylindricalPellet(ctx, x, y, w, h, angle, col, alpha) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);

    const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    grad.addColorStop(0, col.top);
    grad.addColorStop(0.45, col.mid);
    grad.addColorStop(1, col.bot);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, h * 0.38);
    ctx.fill();

    // Cylinder end-cap face
    ctx.fillStyle = col.cap;
    ctx.beginPath();
    ctx.ellipse(w * 0.28, 0, w * 0.14, h * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function renderLiveContinuousPourOverlay() {
    if (!pourCanvas || !pourCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(pourCanvas.clientWidth * dpr);
    const ch = Math.round(pourCanvas.clientHeight * dpr);
    if (pourCanvas.width !== cw || pourCanvas.height !== ch) {
      pourCanvas.width = cw;
      pourCanvas.height = ch;
    }

    pourCtx.clearRect(0, 0, cw, ch);

    // Keep pouring continuously while in the opening Glass & Hopper scenes (Frames 1..55)
    if (targetProcessFrame > 55 || !lastDrawMetrics) return;

    const fadeOut = targetProcessFrame <= 36 ? 1.0 : clamp01(1 - (targetProcessFrame - 36) / 19);
    const m = lastDrawMetrics;
    const scaleFactor = m.drawH / 720;

    for (let i = 0; i < liveStreamPellets.length; i++) {
      const p = liveStreamPellets[i];
      p.progress = (p.progress + p.speed) % 1.0;
      p.angle += p.rotSpeed;

      const easeP = 0.42 * p.progress + 0.58 * p.progress * p.progress;
      const nx = p.startX + (p.endX - p.startX) * easeP;
      const ny = 0.445 + easeP * 0.54;

      let alpha = 0.94 * fadeOut;
      if (p.progress < 0.14) alpha *= p.progress / 0.14;
      if (p.progress > 0.86) alpha *= (1 - p.progress) / 0.14;

      const px = m.offsetX + nx * m.drawW;
      const py = m.offsetY + ny * m.drawH;
      const pw = 24 * p.scale * scaleFactor;
      const ph = 16 * p.scale * scaleFactor;

      drawLive3DCylindricalPellet(pourCtx, px, py, pw, ph, p.angle, p.color, alpha);
    }
  }

  function getActiveVariant() {
    return window.innerWidth <= 768 && window.innerHeight > window.innerWidth ? 'mobile' : 'desktop';
  }

  function formatFramePath(variant, frameNum) {
    return `assets/frames/${variant}/frame-${String(frameNum).padStart(6, '0')}.webp?v=nat3`;
  }

  function formatHeroFramePath(frameNum) {
    return `assets/frames/hero/hero-${String(frameNum).padStart(6, '0')}.webp?v=nat3`;
  }

  function computeCanonicalScrollProgress() {
    if (!storySection) return 0;
    const rect = storySection.getBoundingClientRect();
    const scrollable = Math.max(1, storySection.offsetHeight - window.innerHeight);
    return clamp01(-rect.top / scrollable);
  }

  function syncCanvasDimensions() {
    if (!seqCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(seqCanvas.clientWidth * dpr);
    const h = Math.round(seqCanvas.clientHeight * dpr);
    if (seqCanvas.width !== w || seqCanvas.height !== h) {
      seqCanvas.width = w;
      seqCanvas.height = h;
    }
  }

  function drawImageCoverContain(img) {
    if (!seqCanvas || !seqCtx || !img || !img.complete || img.naturalWidth === 0) return false;
    syncCanvasDimensions();

    const cw = seqCanvas.width;
    const ch = seqCanvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (cw === 0 || ch === 0) return false;

    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    seqCtx.fillStyle = '#050b16';
    seqCtx.fillRect(0, 0, cw, ch);

    let drawW, drawH, offsetX, offsetY;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - drawH) * 0.5;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
      offsetX = (cw - drawW) * 0.62;
      offsetY = 0;
    }

    seqCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastDrawMetrics = { drawW, drawH, offsetX, offsetY };
    return true;
  }

  function updateOverlaysForFrame(frameNum, mode) {
    const scene =
      SCENE_DEFINITIONS.find(s => frameNum >= s.startFrame && frameNum <= s.endFrame) ||
      SCENE_DEFINITIONS[SCENE_DEFINITIONS.length - 1];

    // Update interactive bottom process visualization timeline nodes
    vizNodes.forEach((node, idx) => {
      node.classList.toggle('active', idx === scene.timelineIdx);
    });

    if (mode === 'hero-loop' || frameNum <= 36) {
      if (heroOverlay) heroOverlay.classList.remove('is-hidden');
      if (captionOverlay) captionOverlay.hidden = true;
      return;
    }

    if (heroOverlay) heroOverlay.classList.add('is-hidden');

    if (captionOverlay && !scene.isHero) {
      captionOverlay.hidden = false;
      if (captionKicker) captionKicker.textContent = scene.kicker;
      if (captionTitle) captionTitle.textContent = scene.title;
      if (captionBody) captionBody.textContent = scene.caption;
    }
  }

  // Clickable stage nodes in the bottom process timeline bar
  vizNodes.forEach(node => {
    node.addEventListener('click', () => {
      const jumpFrame = parseInt(node.getAttribute('data-jump-frame') || '1', 10);
      if (!storySection) return;
      const targetProgress = (jumpFrame - 1) / (TOTAL_PROCESS_FRAMES - 1);
      const scrollable = Math.max(1, storySection.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: storySection.offsetTop + targetProgress * scrollable,
        behavior: 'smooth'
      });
    });
  });

  function pruneProcessCache(variant, centerFrame) {
    for (const [key, entry] of processFrameCache.entries()) {
      const [entryVariant, numStr] = key.split(':');
      const fNum = parseInt(numStr, 10);
      if (fNum === 1 && entryVariant === variant) continue;
      if (entryVariant !== variant || Math.abs(fNum - centerFrame) > CACHE_RADIUS + 8) {
        if (entry.img) {
          entry.img.onload = null;
          entry.img.onerror = null;
          entry.img.src = '';
        }
        processFrameCache.delete(key);
      }
    }
  }

  function requestProcessFrame(variant, frameNum, isUrgentTarget) {
    const clampedNum = clamp(frameNum, 1, TOTAL_PROCESS_FRAMES);
    const key = `${variant}:${clampedNum}`;
    const existing = processFrameCache.get(key);
    if (existing) return existing;

    const tokenAtRequest = paintGenerationToken;
    const img = new Image();
    const entry = { img, status: 'loading', frameNum: clampedNum, variant };
    processFrameCache.set(key, entry);

    img.onload = () => {
      entry.status = 'loaded';
      if (activeControllerMode === 'hero-loop') {
        if (clampedNum === 1 && variant === getActiveVariant()) {
          drawImageCoverContain(img);
        }
        return;
      }
      if (
        isUrgentTarget &&
        tokenAtRequest === paintGenerationToken &&
        clampedNum === targetProcessFrame &&
        variant === getActiveVariant()
      ) {
        drawImageCoverContain(img);
        updateOverlaysForFrame(clampedNum, 'scroll-scrub');
      }
    };

    img.onerror = () => {
      entry.status = 'error';
    };

    img.src = formatFramePath(variant, clampedNum);
    return entry;
  }

  function findNearestLoadedProcessFrame(variant, targetNum) {
    const exact = processFrameCache.get(`${variant}:${targetNum}`);
    if (exact && exact.status === 'loaded') return exact;

    for (let dist = 1; dist <= TOTAL_PROCESS_FRAMES; dist++) {
      const prevCandidate = targetNum - scrollDirection * dist;
      if (prevCandidate >= 1 && prevCandidate <= TOTAL_PROCESS_FRAMES) {
        const e1 = processFrameCache.get(`${variant}:${prevCandidate}`);
        if (e1 && e1.status === 'loaded') return e1;
      }
      const nextCandidate = targetNum + scrollDirection * dist;
      if (nextCandidate >= 1 && nextCandidate <= TOTAL_PROCESS_FRAMES) {
        const e2 = processFrameCache.get(`${variant}:${nextCandidate}`);
        if (e2 && e2.status === 'loaded') return e2;
      }
    }
    return null;
  }

  function preloadDirectionalWindow(variant, centerFrame, direction) {
    requestProcessFrame(variant, 1, false);
    for (let i = 1; i <= 16; i++) {
      const f = centerFrame + direction * i;
      if (f >= 1 && f <= TOTAL_PROCESS_FRAMES) requestProcessFrame(variant, f, false);
    }
    for (let i = 1; i <= 6; i++) {
      const f = centerFrame - direction * i;
      if (f >= 1 && f <= TOTAL_PROCESS_FRAMES) requestProcessFrame(variant, f, false);
    }
    pruneProcessCache(variant, centerFrame);
  }

  function preloadHeroLoopFrames() {
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      if (heroFrameCache.has(i)) continue;
      const img = new Image();
      const entry = { img, status: 'loading' };
      heroFrameCache.set(i, entry);
      img.onload = () => {
        entry.status = 'loaded';
      };
      img.src = formatHeroFramePath(i);
    }
  }

  function updateMasterPlaybackController(now) {
    canonicalScrollProgress = computeCanonicalScrollProgress();
    const variant = getActiveVariant();

    // Always play the continuous Hero Pouring Loop when at the top header (regardless of OS reduced-motion setting!)
    if (canonicalScrollProgress <= 0.003) {
      if (activeControllerMode !== 'hero-loop') {
        activeControllerMode = 'hero-loop';
        targetProcessFrame = 1;
        paintGenerationToken++;
      }
      updateOverlaysForFrame(1, 'hero-loop');

      if (variant === 'desktop') {
        if (now - lastHeroTickTime >= HERO_FRAME_INTERVAL_MS) {
          lastHeroTickTime = now;
          heroLoopIndex = (heroLoopIndex % TOTAL_HERO_FRAMES) + 1;
        }
        const heroEntry = heroFrameCache.get(heroLoopIndex);
        if (heroEntry && heroEntry.status === 'loaded') {
          drawImageCoverContain(heroEntry.img);
          return;
        }
      }

      const f1 = requestProcessFrame(variant, 1, false);
      if (f1 && f1.status === 'loaded') {
        drawImageCoverContain(f1.img);
      } else if (posterImage && posterImage.complete) {
        drawImageCoverContain(posterImage);
      }
      return;
    }

    if (activeControllerMode !== 'scroll-scrub') {
      activeControllerMode = 'scroll-scrub';
      paintGenerationToken++;
    }

    const nextTargetFrame = clamp(
      1 + Math.round(canonicalScrollProgress * (TOTAL_PROCESS_FRAMES - 1)),
      1,
      TOTAL_PROCESS_FRAMES
    );

    if (nextTargetFrame !== targetProcessFrame) {
      scrollDirection = nextTargetFrame >= targetProcessFrame ? 1 : -1;
      targetProcessFrame = nextTargetFrame;
      paintGenerationToken++;
    }

    const entry = requestProcessFrame(variant, targetProcessFrame, true);
    if (entry.status === 'loaded') {
      drawImageCoverContain(entry.img);
    } else {
      const fallback = findNearestLoadedProcessFrame(variant, targetProcessFrame);
      if (fallback && fallback.img) {
        drawImageCoverContain(fallback.img);
      } else if (posterImage && posterImage.complete) {
        drawImageCoverContain(posterImage);
      }
    }

    updateOverlaysForFrame(targetProcessFrame, 'scroll-scrub');
    preloadDirectionalWindow(variant, targetProcessFrame, scrollDirection);
  }

  function initSequencePlayer() {
    const variant = getActiveVariant();
    posterImage = new Image();
    posterImage.onload = () => {
      if (canonicalScrollProgress <= 0.01) drawImageCoverContain(posterImage);
    };
    posterImage.src =
      (variant === 'mobile'
        ? 'assets/frames/poster-mobile.webp'
        : 'assets/frames/poster-desktop.webp') + '?v=nat3';

    for (let i = 1; i <= 18; i++) {
      requestProcessFrame(variant, i, i === 1);
    }
    preloadHeroLoopFrames();
  }

  // --------------------------------------------------------------------------
  // 4. FAST AUTO-SLIDING CIRCULAR MEDALLION POLYMER CARDS WITH RATE
  // --------------------------------------------------------------------------
  const cardsTrack = document.getElementById('polymer-cards-track');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const modalBackdrop = document.getElementById('polymer-modal-backdrop');
  const modalCloseBtn = document.getElementById('polymer-modal-close');
  const modalContactToggle = document.getElementById('btn-modal-contact-toggle');
  const modalContactReveal = document.getElementById('modal-contact-reveal');

  let currentSlideIndex = 0;
  let isSliderHovered = false;
  let selectedPolymer = POLYMER_CATALOG[0];

  function buildPolymerRateCards() {
    if (!cardsTrack) return;
    cardsTrack.innerHTML = '';

    // Duplicate catalog items once so the track can step rapidly and loop seamlessly
    const displayList = POLYMER_CATALOG.concat(POLYMER_CATALOG.slice(0, 4));

    displayList.forEach((poly, idx) => {
      const catalogIndex = idx % POLYMER_CATALOG.length;
      const card = document.createElement('article');
      card.className = 'polymer-medallion-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${poly.name}, Rate ${poly.rate}. Click for details.`);

      card.innerHTML = `
        <div class="medallion-circle-photo">
          <img src="${poly.photo}" alt="${poly.name}" />
        </div>
        <span class="medallion-rate-badge">${poly.rate}</span>
        <h3 class="medallion-title">${poly.name}</h3>
        <span class="medallion-tap-hint">View Details &#8594;</span>
      `;

      const openCardDetails = () => openPolymerModal(catalogIndex, false);
      card.addEventListener('click', openCardDetails);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCardDetails();
        }
      });

      cardsTrack.appendChild(card);
    });
  }

  function slideToIndex(idx) {
    if (!cardsTrack) return;
    const cards = cardsTrack.querySelectorAll('.polymer-medallion-card');
    if (cards.length === 0) return;

    const maxIdx = POLYMER_CATALOG.length;
    currentSlideIndex = idx > maxIdx ? 0 : idx < 0 ? maxIdx - 1 : idx;

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    const shift = currentSlideIndex * (cardWidth + gap);
    cardsTrack.style.transform = `translateX(${-shift}px)`;
  }

  function openPolymerModal(index, autoShowContact) {
    selectedPolymer = POLYMER_CATALOG[index] || POLYMER_CATALOG[0];
    if (!modalBackdrop) return;

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    const imgEl = document.getElementById('modal-polymer-img');
    if (imgEl) {
      imgEl.src = selectedPolymer.photo;
      imgEl.alt = selectedPolymer.name;
    }

    setEl('modal-polymer-rate', selectedPolymer.rate);
    setEl('modal-polymer-code', `${selectedPolymer.shortCode} • INDUSTRIAL GRADE`);
    setEl('modal-polymer-name', selectedPolymer.name);
    setEl('modal-polymer-desc', selectedPolymer.description);
    setEl('modal-polymer-grade', selectedPolymer.grade);
    setEl('modal-polymer-color', selectedPolymer.color);
    setEl('modal-polymer-density', selectedPolymer.density);

    if (modalContactReveal) {
      modalContactReveal.hidden = !autoShowContact;
    }

    modalBackdrop.hidden = false;
  }

  function closePolymerModal() {
    if (modalBackdrop) modalBackdrop.hidden = true;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => slideToIndex(currentSlideIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => slideToIndex(currentSlideIndex + 1));
  }

  if (cardsTrack) {
    cardsTrack.addEventListener('mouseenter', () => {
      isSliderHovered = true;
    });
    cardsTrack.addEventListener('mouseleave', () => {
      isSliderHovered = false;
    });
  }

  // Fast, snappy automatic horizontal movement every 1.35 seconds ("டக்கு டக்குன்னு மூவ் ஆகணும்")
  // Never blocked by OS reduced-motion setting!
  setInterval(() => {
    if (!isSliderHovered && (!modalBackdrop || modalBackdrop.hidden)) {
      slideToIndex(currentSlideIndex + 1);
    }
  }, 1350);

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePolymerModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closePolymerModal();
    });
  }
  if (modalContactToggle && modalContactReveal) {
    modalContactToggle.addEventListener('click', () => {
      modalContactReveal.hidden = !modalContactReveal.hidden;
    });
  }

  const footerContactBtn = document.getElementById('footer-contact-btn');
  if (footerContactBtn) {
    footerContactBtn.addEventListener('click', () => openPolymerModal(0, true));
  }
  const footerBottomContactBtn = document.getElementById('footer-bottom-contact-btn');
  if (footerBottomContactBtn) {
    footerBottomContactBtn.addEventListener('click', () => openPolymerModal(0, true));
  }

  // --------------------------------------------------------------------------
  // 5. PRIVACY POLICY & TERMS OF SERVICE MODALS IN FOOTER
  // --------------------------------------------------------------------------
  const LEGAL_CONTENT = {
    privacy: {
      title: 'Privacy Policy — VIMS Enterprises',
      html: `
        <p><strong>Effective Date:</strong> January 2026</p>
        <h4>1. Information We Collect</h4>
        <p>When you contact VIMS Enterprises for polymer raw material orders, we collect your name, company details, phone number, email address, and material grade requirements.</p>
        <h4>2. How We Use Your Information</h4>
        <p>Your business contact information is used strictly to provide polymer quotations, Technical Data Sheets (TDS), and order dispatch updates.</p>
        <h4>3. Contact Information</h4>
        <p>For privacy questions, contact <strong>Vimal@vimsenterprise.com</strong> or call <strong>+91 99406 60868</strong>.</p>
      `
    },
    terms: {
      title: 'Terms of Service — VIMS Enterprises',
      html: `
        <p><strong>Effective Date:</strong> January 2026</p>
        <h4>1. Polymer Specifications &amp; Rates</h4>
        <p>Displayed polymer rates (per kg) are indicative B2B reference rates. Final commercial pricing depends on order volume (25 kg bags vs. metric ton dispatches) and grade specifications.</p>
        <h4>2. Orders &amp; Dispatches</h4>
        <p>All orders are subject to grade confirmation and formal quotation from VIMS Enterprises (+91 99406 60868 / Vimal@vimsenterprise.com).</p>
      `
    }
  };

  const legalBackdrop = document.getElementById('legal-modal-backdrop');
  const legalTitle = document.getElementById('legal-modal-title');
  const legalBody = document.getElementById('legal-modal-body');
  const legalClose = document.getElementById('legal-modal-close');

  document.querySelectorAll('[data-legal-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-legal-modal');
      const doc = LEGAL_CONTENT[key];
      if (!doc || !legalBackdrop) return;
      legalTitle.textContent = doc.title;
      legalBody.innerHTML = doc.html;
      legalBackdrop.hidden = false;
    });
  });

  if (legalClose && legalBackdrop) {
    legalClose.addEventListener('click', () => {
      legalBackdrop.hidden = true;
    });
    legalBackdrop.addEventListener('click', e => {
      if (e.target === legalBackdrop) legalBackdrop.hidden = true;
    });
  }

  // --------------------------------------------------------------------------
  // 6. TINY ROBOT ICON CHATBOT
  // --------------------------------------------------------------------------
  const chatbotLauncher = document.getElementById('chatbot-launcher');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const quickChips = Array.from(document.querySelectorAll('.chat-quick-chip'));

  let chatInitialized = false;

  function appendChatMessage(role, text) {
    if (!chatbotMessages) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    const formatted = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = `<div>${formatted}</div>`;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return bubble;
  }

  function toggleChatbot() {
    if (!chatbotWindow || !chatbotLauncher) return;
    const willOpen = chatbotWindow.hidden;
    chatbotWindow.hidden = !willOpen;
    chatbotLauncher.setAttribute('aria-expanded', willOpen ? 'true' : 'false');

    if (willOpen && !chatInitialized) {
      chatInitialized = true;
      appendChatMessage(
        'bot',
        `Hi! I'm the **VIMS Polymer Bot**.\nClick any polymer medallion to see its rate & details, or ask me about grades and contact numbers.`
      );
    }
    if (willOpen && chatbotInput) {
      chatbotInput.focus();
    }
  }

  async function sendChatQuery(queryText) {
    const clean = String(queryText || '').trim();
    if (!clean) return;
    appendChatMessage('user', clean);
    if (chatbotInput) chatbotInput.value = '';

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          polymerId: selectedPolymer.id
        })
      });
      const data = await res.json();
      appendChatMessage('bot', data.reply || 'Contact us at +91 99406 60868.');
    } catch (_) {
      appendChatMessage('bot', 'Call or WhatsApp VIMS Enterprises at **+91 99406 60868**.');
    }
  }

  if (chatbotLauncher) chatbotLauncher.addEventListener('click', toggleChatbot);
  if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', toggleChatbot);
  if (chatbotForm) {
    chatbotForm.addEventListener('submit', e => {
      e.preventDefault();
      if (chatbotInput && chatbotInput.value.trim()) {
        sendChatQuery(chatbotInput.value.trim());
      }
    });
  }
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-quick-query');
      if (q) sendChatQuery(q);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (legalBackdrop && !legalBackdrop.hidden) {
        legalBackdrop.hidden = true;
      } else if (modalBackdrop && !modalBackdrop.hidden) {
        closePolymerModal();
      } else if (chatbotWindow && !chatbotWindow.hidden) {
        toggleChatbot();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 7. SCROLL HIGHLIGHTING & MASTER LOOP
  // --------------------------------------------------------------------------
  function updateActiveNavLink() {
    const scrollY = window.scrollY;
    const materialsEl = document.getElementById('our-materials');
    const footerEl = document.getElementById('site-footer');
    const processMarker = document.getElementById('process');

    let activeSection = 'home';
    if (footerEl && scrollY + window.innerHeight >= document.body.scrollHeight - 60) {
      activeSection = 'footer';
    } else if (materialsEl && scrollY + 240 >= materialsEl.offsetTop) {
      activeSection = 'our-materials';
    } else if (processMarker && scrollY + 120 >= processMarker.offsetTop) {
      activeSection = 'process';
    }

    navLinks.forEach(link => {
      const sec = link.getAttribute('data-nav-section');
      link.classList.toggle('active', sec === activeSection);
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener(
    'resize',
    () => {
      syncCanvasDimensions();
      slideToIndex(currentSlideIndex);
      updateActiveNavLink();
    },
    { passive: true }
  );

  function tick(now) {
    updateMasterPlaybackController(now);
    renderLiveContinuousPourOverlay();
    requestAnimationFrame(tick);
  }

  buildPolymerRateCards();
  initSequencePlayer();
  updateActiveNavLink();
  requestAnimationFrame(tick);
})();
