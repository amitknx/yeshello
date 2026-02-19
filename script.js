// ===========================
// YesHello.info — Interactions
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initChatAnimations();
  initCopyButtons();
  initShareButtons();
});

// --- Scroll Reveal ---
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// --- Chat Animations ---
function initChatAnimations() {
  const wrongPanel = document.getElementById('chat-wrong');
  const rightPanel = document.getElementById('chat-right');
  if (!wrongPanel || !rightPanel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animatePanel(wrongPanel, [300, 900, 2000, 3800, 5000, 6200, 7400]);
          animatePanel(rightPanel, [300, 1500]);

          const waiting = wrongPanel.querySelector('.waiting');
          if (waiting) {
            setTimeout(() => waiting.classList.add('visible'), 1400);
            setTimeout(() => waiting.classList.remove('visible'), 3600);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(wrongPanel);
}

function animatePanel(panel, delays) {
  const messages = panel.querySelectorAll('.msg');
  messages.forEach((msg, i) => {
    setTimeout(() => msg.classList.add('visible'), delays[i] || i * 1200);
  });
}

// --- Copy to Clipboard ---
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.tpl-card');
      const text = card?.querySelector('.tpl-msg')?.textContent?.trim();
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✓ Copied';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  });
}

// --- Share ---
function initShareButtons() {
  const url = 'https://yeshello.info';
  const text = 'Say hello the right way 👋 — yeshello.info';

  document.getElementById('share-twitter')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
  });

  document.getElementById('share-linkedin')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420');
  });

  document.getElementById('share-copy')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(url).then(() => {
      e.target.textContent = '✓ Copied!';
      setTimeout(() => e.target.textContent = 'Copy link', 2000);
    });
  });
}
