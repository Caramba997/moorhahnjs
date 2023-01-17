(function() {
  let highscores;

  function showHighscores() {
    const mode = document.querySelector('select[name="mode"]').value,
          difficulty = document.querySelector('select[name="difficulty"]').value,
          table = document.querySelector('#highscores');

    table.querySelectorAll('tr.Score').forEach((score) => {
      score.remove();
    });

    if (level === 'none') return;

    for (let i = 0; i < highscores.length; i++) {
      if (highscores[i].mode === mode) {
        const scores = highscores[i][difficulty];
        for (let k = 0; k < scores.length; k++) {
          const score = `${scores[k].score} ${window.locales.getTranslation('points')}`;
          table.innerHTML += `<tr class="Score"><td>${k+1}</td><td>${scores[k].user}</td><td>${score}</td></tr>`;
        }
        break;
      }
    }
  }

  window.api.get('getHighscores', (result) => {
    highscores = result;
  }, (error) => {
    console.error(error);
    window.dispatchEvent(new CustomEvent('progress:executed'));
  });
  const modeSelector = document.querySelector('select[name="mode"]'),
        difficultySelector = document.querySelector('select[name="difficulty"]');
  modeSelector.addEventListener('change', showHighscores);
  difficultySelector.addEventListener('change', showHighscores);
})();