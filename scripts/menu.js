(function() {
  // Popup openers
  function openPopup(name) {
    const popup = document.querySelector('[data-popup="' + name + '"]'),
          overlay = document.querySelector('.PageOverlay');
    popup.setAttribute('data-visible', true);
    overlay.setAttribute('data-visible', true);
  }
  document.querySelectorAll('[data-action="open-popup"]').forEach((opener) => {
    opener.addEventListener('click', (e) => {
      openPopup(e.target.getAttribute('data-control'));
    });
  });

  // Popup closers
  function closePopup(name, doActions) {
    const popup = document.querySelector('[data-popup="' + name + '"]'),
          overlay = document.querySelector('.PageOverlay');
    popup.setAttribute('data-visible', false);
    overlay.setAttribute('data-visible', false);
  }
  document.querySelectorAll('[data-action="close-popup"]').forEach((opener) => {
    opener.addEventListener('click', (e) => {
      closePopup(e.target.closest('.Popup').getAttribute('data-popup'), true);
    });
  });

  // Game settings
  const difficulty = window.ps.load('difficulty'),
        mode = window.ps.load('gamemode');
  document.querySelector(`[data-action="set-difficulty"][data-value="${difficulty}"]`).classList.add('selected');
  document.querySelector(`[data-action="set-gamemode"][data-value="${mode}"]`).classList.add('selected');
  document.querySelectorAll('[data-action="set-difficulty"]').forEach((button) => {
    button.addEventListener('click', (e) => {
      if (e.target.classList.contains('selected')) return;
      document.querySelector('[data-action="set-difficulty"].selected').classList.remove('selected');
      window.ps.save('difficulty', e.target.getAttribute('data-value'));
      e.target.classList.add('selected');
    });
  });
  document.querySelectorAll('[data-action="set-gamemode"]').forEach((button) => {
    button.addEventListener('click', (e) => {
      if (e.target.classList.contains('selected')) return;
      document.querySelector('[data-action="set-gamemode"].selected').classList.remove('selected');
      window.ps.save('gamemode', e.target.getAttribute('data-value'));
      e.target.classList.add('selected');
    });
  });

  // General settings
  const sounds = window.ps.load('sounds'),
        language = window.ps.load('language');
  const soundButton = document.querySelector('[data-action="toggle-sound"]');
  soundButton.setAttribute('data-sounds', sounds);
  soundButton.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-sounds') === 'on') {
      window.ps.save('sounds', 'off');
      e.target.setAttribute('data-sounds', 'off');
    }
    else {
      window.ps.save('sounds', 'on');
      e.target.setAttribute('data-sounds', 'on');
    }
  });
  const languageSelector = document.querySelector('select[name="language"]');
  if (language !== languageSelector.value) {
    languageSelector.value = language;
  }
  languageSelector.addEventListener('change', (e) => {
    if (e.target.value !== window.ps.load('language')) {
      window.locales.changeLanguage(e.target.value);
      window.locales.translatePage(document);
    }
  });
  const fullscreenButton = document.querySelector('[data-action="toggle-fullscreen"]');
  if (window.ps.load('fullscreen')) fullscreenButton.setAttribute('data-fullscreen', window.ps.load('fullscreen'));
  fullscreenButton.addEventListener('click', (e) => {
    if (e.target.getAttribute('data-fullscreen') === 'on') {
      window.ps.save('fullscreen', 'off');
      e.target.setAttribute('data-fullscreen', 'off');
      window.pwa.toggleFullscreen(false);
    }
    else {
      window.ps.save('fullscreen', 'on');
      e.target.setAttribute('data-fullscreen', 'on');
      window.pwa.toggleFullscreen(true);
    }
  });

  window.dispatchEvent(new CustomEvent('progress:executed'));
})();