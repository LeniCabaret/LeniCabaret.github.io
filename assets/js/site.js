/**
 * Portfolio Léni Cabaret · Dashboard de supervision
 * Scripts d'interaction, animations, calculs dynamiques et visionneuse
 */

(() => {
  'use strict';

  // 1. Détection JS et préférences d'accessibilité
  document.documentElement.classList.add('js');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Calcul dynamique de l'âge (Uptime) et des années de bénévolat
  // RÈGLE ABSOLUE : l'âge est calculé depuis le 20/07/1998, jamais écrit en dur.
  function computeAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function computeYearsSince(startYear) {
    const today = new Date();
    return Math.max(0, today.getFullYear() - startYear);
  }

  const birthDate = new Date(1998, 6, 20); // 20 juillet 1998 (mois indexé à 0)
  const currentAge = computeAge(birthDate);
  const benevolatYears = computeYearsSince(2016);

  // 3. Mise à jour de l'affichage du temps réel « dernier relevé il y a N s » et ping dynamique
  const liveSecElement = document.querySelector('[data-live-seconds]');
  let elapsedSeconds = 0;
  if (liveSecElement) {
    setInterval(() => {
      elapsedSeconds++;
      liveSecElement.textContent = String(elapsedSeconds);
    }, 1000);
  }

  function initPingIndicator() {
    try {
      const pingElements = document.querySelectorAll('[data-live-ping]');
      if (pingElements.length === 0) return;

      setInterval(() => {
        if (document.hidden) return;
        const ms = 10 + Math.floor(Math.random() * 12);
        pingElements.forEach(el => {
          el.textContent = String(ms);
        });
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'indicateur de ping :', err);
    }
  }
  initPingIndicator();

  // 4. Animation des compteurs numériques (montée progressive)
  function animateValue(element, start, end, duration) {
    if (prefersReducedMotion || duration <= 0) {
      element.textContent = String(end);
      return;
    }
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(start + (end - start) * easeOutQuad);
      element.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = String(end);
      }
    }
    requestAnimationFrame(update);
  }

  // 5. Initialisation des tuiles statistiques et compteurs
  const uptimeEl = document.querySelector('[data-stat-uptime]');
  const benevolatEl = document.querySelector('[data-stat-benevolat]');
  const e5El = document.querySelector('[data-stat-e5]');

  function initStatsTiles() {
    try {
      if (uptimeEl) {
        if (prefersReducedMotion) {
          uptimeEl.textContent = String(currentAge);
        } else {
          uptimeEl.textContent = '0';
        }
      }
      if (benevolatEl) {
        if (prefersReducedMotion) {
          benevolatEl.textContent = String(benevolatYears);
        } else {
          benevolatEl.textContent = '0';
        }
      }
      if (e5El) {
        const totalE5 = parseInt(e5El.getAttribute('data-count') || '22', 10);
        if (prefersReducedMotion) {
          e5El.textContent = String(totalE5);
        } else {
          e5El.textContent = '0';
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des tuiles statistiques :', err);
    }
  }
  initStatsTiles();

  // Mini graphique sparkline « temps réel » façon Grafana dans chaque tuile statistique
  function hexToRgba(hex, alpha) {
    if (!hex || !hex.startsWith('#')) return `rgba(79, 179, 201, ${alpha})`;
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function initSparklines() {
    try {
      const tiles = document.querySelectorAll('.stat-tile');
      if (tiles.length === 0) return;

      const sparklines = [];

      tiles.forEach((tile, index) => {
        const statMain = tile.querySelector('.stat-main');
        if (!statMain) return;

        let canvas = statMain.querySelector('.stat-sparkline');
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.className = 'stat-sparkline';
          canvas.width = 120;
          canvas.height = 28;
          canvas.setAttribute('aria-hidden', 'true');
          statMain.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Génération d'une série initiale pseudo-aléatoire lissée de 16 points
        const points = [];
        let val = 0.35 + (index * 0.12) % 0.4;
        for (let i = 0; i < 16; i++) {
          val = Math.max(0.15, Math.min(0.85, val + (Math.random() - 0.5) * 0.18));
          points.push(val);
        }

        sparklines.push({ canvas, ctx, points });
      });

      function drawSparkline(item) {
        const { canvas, ctx, points } = item;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4FB3C9';

        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const x = (i / (points.length - 1)) * w;
          const y = (1 - points[i]) * (h - 6) + 3;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.75;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Remplissage sous la courbe façon Grafana
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, hexToRgba(accentColor, 0.25));
        grad.addColorStop(1, hexToRgba(accentColor, 0.0));
        ctx.fillStyle = grad;
        ctx.fill();
      }

      sparklines.forEach(drawSparkline);

      // Si mouvement réduit, les graphiques restent figés
      if (prefersReducedMotion) return;

      // Défilement continu : mise à jour toutes les 220 ms
      setInterval(() => {
        if (document.hidden) return;
        sparklines.forEach(item => {
          const last = item.points[item.points.length - 1];
          const next = Math.max(0.12, Math.min(0.88, last + (Math.random() - 0.5) * 0.2));
          item.points.shift();
          item.points.push(next);
          drawSparkline(item);
        });
      }, 220);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des sparklines :', err);
    }
  }
  initSparklines();

  // 6. Titre « Léni Cabaret » : apparition lettre par lettre et curseur clignotant
  function initHeroTitleTypewriter() {
    try {
      const heroTitle = document.getElementById('hero-title');
      if (!heroTitle) return;
      const subtitle = document.querySelector('.hero-identity .subtitle');
      if (prefersReducedMotion) return;

      const rawText = heroTitle.textContent.trim();
      if (!rawText) return;

      heroTitle.setAttribute('aria-label', rawText);
      heroTitle.textContent = '';

      const letters = Array.from(rawText);
      letters.forEach((ch, idx) => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(4px)';
        span.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        heroTitle.appendChild(span);

        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'none';
        }, idx * 45);
      });

      // Curseur de terminal qui clignote pendant 3 s après le sous-titre
      if (subtitle) {
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.textContent = ' █';
        cursor.style.display = 'inline-block';
        cursor.style.color = 'var(--accent)';
        cursor.style.animation = 'terminal-blink 0.6s infinite';
        subtitle.appendChild(cursor);

        setTimeout(() => {
          cursor.style.transition = 'opacity 0.5s ease';
          cursor.style.opacity = '0';
          setTimeout(() => {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 500);
        }, 3000);
      }
    } catch (err) {
      console.error('Erreur lors de l\'animation du titre hero :', err);
    }
  }
  initHeroTitleTypewriter();

  // 7. Inclinaison 3D (max 4°) et lueur de bordure suivant la souris
  function initCardTiltAndGlow() {
    try {
      if (prefersReducedMotion) return;

      const elements = document.querySelectorAll('.stat-tile, .panel, .projects-table tbody tr');
      elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y}px`);

          // Inclinaison 3D max 4° sur les tuiles et panneaux
          if (el.classList.contains('stat-tile') || el.classList.contains('panel')) {
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx;
            const dy = (y - cy) / cy;
            const rx = (-dy * 4).toFixed(2);
            const ry = (dx * 4).toFixed(2);
            el.style.setProperty('--rx', `${rx}deg`);
            el.style.setProperty('--ry', `${ry}deg`);
          }
        });

        el.addEventListener('mouseleave', () => {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
          el.style.setProperty('--mx', '-999px');
          el.style.setProperty('--my', '-999px');
        });
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'inclinaison 3D et de la lueur :', err);
    }
  }
  initCardTiltAndGlow();

  // 8. Liens de navigation : section active surlignée au défilement
  function initNavScrollHighlight() {
    try {
      const navLinks = Array.from(document.querySelectorAll('.topbar-nav .nav-btn'));
      const anchorLinks = navLinks.filter(a => {
        const href = a.getAttribute('href') || '';
        return href.startsWith('#') && href.length > 1;
      });
      if (anchorLinks.length === 0) return;

      const sections = anchorLinks.map(a => {
        const targetId = a.getAttribute('href').slice(1);
        return document.getElementById(targetId);
      }).filter(Boolean);

      if ('IntersectionObserver' in window && sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              anchorLinks.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        }, {
          rootMargin: '-20% 0px -65% 0px',
          threshold: 0
        });

        sections.forEach(sec => navObserver.observe(sec));
      }
    } catch (err) {
      console.error('Erreur lors du surlignage de la navigation au défilement :', err);
    }
  }
  initNavScrollHighlight();

  // 9. Effet d'onde (ripple) au clic sur les boutons
  function initButtonRipple() {
    try {
      if (prefersReducedMotion) return;

      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .nav-btn, .theme-fab, .back-to-top');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const diameter = Math.max(rect.width, rect.height) * 2;
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;

        const existing = btn.querySelector('.btn-ripple');
        if (existing) existing.remove();

        btn.appendChild(ripple);
        setTimeout(() => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 600);
      });
    } catch (err) {
      console.error('Erreur lors de l\'effet ripple sur les boutons :', err);
    }
  }
  initButtonRipple();

  // 10. Ligne de balayage radar sur carte de chaleur E5 et Gantt
  function initRadarSweeps() {
    try {
      if (prefersReducedMotion) return;
      const targets = document.querySelectorAll('.heatmap-grid, .gantt-board');
      targets.forEach(target => {
        if (!target.querySelector('.radar-scan-line')) {
          const line = document.createElement('div');
          line.className = 'radar-scan-line';
          line.setAttribute('aria-hidden', 'true');
          target.appendChild(line);
        }
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du balayage radar :', err);
    }
  }
  initRadarSweeps();

  // 11. Bouton « Retour en haut » flottant (apparaît après 600 px de défilement)
  function initBackToTop() {
    try {
      const btn = document.getElementById('back-to-top');
      if (!btn) return;

      function checkScroll() {
        const y = window.scrollY || window.pageYOffset || 0;
        if (y > 600) {
          btn.hidden = false;
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
          if (!btn.classList.contains('is-visible')) {
            setTimeout(() => {
              if ((window.scrollY || window.pageYOffset || 0) <= 600) {
                btn.hidden = true;
              }
            }, 200);
          }
        }
      }

      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      });
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du bouton retour en haut :', err);
    }
  }
  initBackToTop();

  // 12. IntersectionObserver : Apparition au défilement et animations
  if ('IntersectionObserver' in window) {
    try {
      // Animation des panneaux
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // Déclenchement spécifique sur la tuile Uptime
            if (entry.target.contains(uptimeEl) && uptimeEl && uptimeEl.textContent === '0') {
              animateValue(uptimeEl, 0, currentAge, 900);
            }
            // Déclenchement sur le Bénévolat
            if (entry.target.contains(benevolatEl) && benevolatEl && benevolatEl.textContent === '0') {
              animateValue(benevolatEl, 0, benevolatYears, 800);
            }
            // Déclenchement sur le total E5
            if (entry.target.contains(e5El) && e5El && e5El.textContent === '0') {
              const total = parseInt(e5El.getAttribute('data-count') || '22', 10);
              animateValue(e5El, 0, total, 800);
            }

            // Déclenchement des barres d'histogramme
            const bars = entry.target.querySelectorAll('.hist-bar');
            bars.forEach(bar => bar.classList.add('grown'));

            // Déclenchement des barres de Gantt
            const ganttBars = entry.target.querySelectorAll('.gantt-bar');
            ganttBars.forEach(gb => gb.classList.add('grown'));

            // Déclenchement en cascade des cellules de la carte de chaleur E5
            const heatmapCells = entry.target.querySelectorAll('.heatmap-cell.active');
            if (heatmapCells.length > 0 && !prefersReducedMotion) {
              heatmapCells.forEach((cell, idx) => {
                cell.style.opacity = '0';
                cell.style.transform = 'scale(0.5)';
                setTimeout(() => {
                  cell.style.opacity = '1';
                  cell.style.transform = 'scale(1)';
                }, Math.min(idx * 25, 1200));
              });
            }

            obs.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      });

      document.querySelectorAll('.animate-on-scroll, .panel, .stat-tile').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      });
    } catch (err) {
      console.error('Erreur lors de la configuration de l\'IntersectionObserver :', err);
    }
  } else {
    // Repli pour navigateurs anciens ou sans IntersectionObserver
    if (uptimeEl) uptimeEl.textContent = String(currentAge);
    if (benevolatEl) benevolatEl.textContent = String(benevolatYears);
    if (e5El) e5El.textContent = e5El.getAttribute('data-count') || '22';
    document.querySelectorAll('.hist-bar, .gantt-bar').forEach(el => el.classList.add('grown'));
  }

  // 13. Visionneuse <dialog> accessible pour les captures d'écran
  const dialog = document.getElementById('image-viewer');
  const viewerImg = document.getElementById('viewer-img');
  const viewerCaption = document.getElementById('viewer-caption');
  const viewerCounter = document.getElementById('viewer-counter');
  const closeBtn = document.querySelector('[data-viewer-close]');
  const prevBtn = document.querySelector('[data-viewer-prev]');
  const nextBtn = document.querySelector('[data-viewer-next]');

  // Un même visuel peut avoir plusieurs déclencheurs (vignette et lien) : une entrée par image.
  const allTriggers = Array.from(document.querySelectorAll('[data-gallery-src]'));
  const galleryTriggers = allTriggers.filter((t, i) =>
    allTriggers.findIndex((u) => u.getAttribute('data-gallery-src') === t.getAttribute('data-gallery-src')) === i);
  let activeIndex = -1;
  let lastActiveElement = null;

  function showImage(index) {
    if (!dialog || galleryTriggers.length === 0) return;
    try {
      if (index < 0) index = galleryTriggers.length - 1;
      if (index >= galleryTriggers.length) index = 0;
      activeIndex = index;

      const trigger = galleryTriggers[activeIndex];
      const src = trigger.getAttribute('data-gallery-src');
      const alt = trigger.getAttribute('data-gallery-alt') || '';
      const caption = trigger.getAttribute('data-gallery-caption') || alt;

      if (viewerImg) {
        viewerImg.src = src;
        viewerImg.alt = alt;
      }
      if (viewerCaption) {
        viewerCaption.textContent = caption;
      }
      if (viewerCounter) {
        viewerCounter.textContent = `${activeIndex + 1} / ${galleryTriggers.length}`;
      }
    } catch (err) {
      console.error('Erreur lors de l\'affichage de l\'image dans la visionneuse :', err);
    }
  }

  if (dialog && galleryTriggers.length > 0) {
    allTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        lastActiveElement = trigger;
        const src = trigger.getAttribute('data-gallery-src');
        showImage(galleryTriggers.findIndex((t) => t.getAttribute('data-gallery-src') === src));
        dialog.showModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dialog.close();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showImage(activeIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showImage(activeIndex + 1);
      });
    }

    // Gestion au clavier (Échap ferme nativement ; flèches gauche/droite uniquement quand ouvert)
    window.addEventListener('keydown', (e) => {
      if (!dialog.open) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showImage(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showImage(activeIndex + 1);
      }
    });

    dialog.addEventListener('close', () => {
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    });

    // Clic sur le fond pour fermer
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    });
  }

  // 14. Formulaire de contact (Envoi via Web3Forms en JSON)
  // RÈGLE : Aucun vocabulaire de ticket.
  const contactForm = document.querySelector('form[data-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = contactForm.querySelector('[data-form-status]');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!statusEl || !submitBtn) return;

      submitBtn.disabled = true;
      statusEl.textContent = 'Envoi…';
      statusEl.className = 'form-status';

      try {
        const formData = new FormData(contactForm);
        const res = await fetch(contactForm.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await res.json();
        if (res.ok && data.success) {
          statusEl.textContent = 'Merci, votre message est bien parti.';
          statusEl.className = 'form-status success';
          contactForm.reset();
        } else {
          const errorMsg = data.message || 'Une erreur est survenue lors de l\'envoi.';
          statusEl.textContent = `Erreur : ${errorMsg}`;
          statusEl.className = 'form-status error';
          console.error('Erreur API Web3Forms :', data);
        }
      } catch (err) {
        statusEl.textContent = 'Erreur de connexion. Veuillez réessayer ou m\'écrire directement par email.';
        statusEl.className = 'form-status error';
        console.error('Erreur réseau lors de la transmission du message :', err);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
