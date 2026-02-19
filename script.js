// ===========================
// YesHello.info — Interactions
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initLanguagePicker();
  initScrollReveal();
  initChatAnimations();
  initCopyButtons();
  initShareButtons();
});

// --- Language Picker ---
let currentLang = localStorage.getItem('yeshello-lang') || 'en';

function initLanguagePicker() {
  const toggle = document.getElementById('lang-toggle');
  const dropdown = document.getElementById('lang-dropdown');
  if (!toggle || !dropdown) return;

  // Build dropdown items
  const langs = Object.keys(TRANSLATIONS);
  dropdown.innerHTML = langs.map((code) => {
    const t = TRANSLATIONS[code];
    return `<button class="lang-option" data-lang="${code}">${t.flag} ${t.lang}</button>`;
  }).join('');

  // Toggle dropdown
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', () => dropdown.classList.remove('open'));
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  // Select language
  dropdown.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      currentLang = lang;
      localStorage.setItem('yeshello-lang', lang);
      applyTranslations(lang);
      dropdown.classList.remove('open');
    });
  });

  // Apply saved language
  applyTranslations(currentLang);
}

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  // update picker button
  document.getElementById('lang-current-flag').textContent = t.flag;
  document.getElementById('lang-current-name').textContent = lang.toUpperCase();

  // update html lang
  document.documentElement.lang = lang;

  // update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // rebuild chat messages
  rebuildChat('chat-bad-body', t.chat_bad, true);
  rebuildChat('chat-good-body', t.chat_good, false);

  // rebuild tips
  rebuildTips(t.tips);

  // highlight active language in dropdown
  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function rebuildChat(containerId, messages, includeWaiting) {
  const container = document.getElementById(containerId);
  if (!container || !messages) return;

  const avatars = ['a', 'b'];
  let html = '';

  messages.forEach((msg, i) => {
    const isFirst = msg.sender !== 'Keith';
    const avatarClass = isFirst ? 'a' : 'b';
    const letter = isFirst ? 'Y' : 'K';

    html += `<div class="msg visible">
      <div class="msg-avatar msg-avatar--${avatarClass}">${letter}</div>
      <div>
        <div class="msg-name">${msg.sender} <span class="msg-time">${msg.time}</span></div>
        <div class="msg-text">${msg.text}</div>
      </div>
    </div>`;

    // Insert waiting indicator after second message in bad chat
    if (includeWaiting && i === 1) {
      const t = TRANSLATIONS[currentLang];
      html += `<div class="waiting" id="chat-waiting">
        <span class="waiting-dots"><span></span><span></span><span></span></span>
        <span data-i18n="chat_waiting">${t.chat_waiting}</span>
      </div>`;
    }
  });

  container.innerHTML = html;
}

function rebuildTips(tips) {
  if (!tips) return;
  tips.forEach((tip, i) => {
    const titleEl = document.querySelector(`[data-i18n="tip_${i}_title"]`);
    const descEl = document.querySelector(`[data-i18n="tip_${i}_desc"]`);
    if (titleEl) titleEl.textContent = tip.title;
    if (descEl) descEl.textContent = tip.desc;
  });
}

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
  // Use event delegation so dynamically updated buttons still work
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    const card = btn.closest('.tpl-card');
    const text = card?.querySelector('.tpl-msg')?.textContent?.trim();
    if (!text) return;

    const t = TRANSLATIONS[currentLang];

    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.textContent = t.copied_btn;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = t.copy_btn;
      }, 2000);
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
    const t = TRANSLATIONS[currentLang];
    navigator.clipboard.writeText(url).then(() => {
      e.target.textContent = '✓ Copied!';
      setTimeout(() => e.target.textContent = t.share_copy, 2000);
    });
  });
}
