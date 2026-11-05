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

  // 3. Mise à jour de l'affichage du temps réel « dernier relevé il y a N s »
  const liveSecElement = document.querySelector('[data-live-seconds]');
  let elapsedSeconds = 0;
  if (liveSecElement) {
    setInterval(() => {
      elapsedSeconds++;
      liveSecElement.textContent = String(elapsedSeconds);
    }, 1000);
  }

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

  // 6. IntersectionObserver : Apparition au défilement et animations
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

  // 7. Visionneuse <dialog> accessible pour les captures d'écran
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

  // 8. Formulaire de contact (Envoi via Web3Forms en JSON)
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
