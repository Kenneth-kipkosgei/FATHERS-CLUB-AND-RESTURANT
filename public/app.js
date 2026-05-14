// Simple frontend JS for reservation form and admin fetch
async function postReservation(form) {
  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    date: form.date.value,
    time: form.time.value,
    guests: form.guests.value,
    notes: form.notes.value.trim()
  };
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Hook reservation form if present
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle: apply stored preference or system preference
  const THEME_KEY = 'fc_theme';
  const themeToggle = document.querySelector('#theme-toggle');

  function applyTheme(theme) {
    if (!theme) return;
    // set data-theme for CSS selectors and toggle Tailwind 'dark' class
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    // update toggle button if present
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Initialize theme
  (function initTheme(){
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') { applyTheme(stored); return; }
    // fallback to prefers-color-scheme
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  })();

  // Toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  const form = document.querySelector('#reservation-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submit = form.querySelector('button[type=submit]');
      submit.disabled = true;
      submit.textContent = 'Sending...';
      try {
        const result = await postReservation(form);
        if (result && result.ok) {
          form.reset();
          alert('Reservation received! We will contact you to confirm.');
        } else if (result && result.error) {
          alert('Error: ' + result.error);
        } else {
          alert('Unexpected response.');
        }
      } catch (err) {
        alert('Network error.');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Send Reservation';
      }
    });
  }

  // Admin page: load reservations
  const adminList = document.querySelector('#admin-list');
  if (adminList) {
    fetch('/api/reservations')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) { adminList.textContent = 'No reservations'; return; }
        adminList.innerHTML = data.map(r => `
          <li class="res-item">
            <strong>${r.name}</strong> — ${r.date} ${r.time} • ${r.guests} guests<br>
            ${r.phone}<br>
            <small>${r.notes || ''}</small>
          </li>
        `).join('\n');
      })
      .catch(() => { adminList.textContent = 'Could not load reservations.'; });
  }
});
