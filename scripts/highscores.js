(function() {
  let highscores;

  function showHighscores() {
    const gamemode = document.querySelector('select[name="gamemode"]').value,
          difficulty = document.querySelector('select[name="difficulty"]').value,
          table = document.querySelector('#highscores');

    table.querySelectorAll('tr.Score').forEach((score) => {
      score.remove();
    });

    for (let i = 0; i < highscores.length; i++) {
      if (highscores[i].gamemode === gamemode && highscores[i].difficulty === difficulty) {
        const scores = highscores[i].scores;
        for (let k = 0; k < scores.length; k++) {
          const score = `${scores[k].score} ${window.locales.getTranslation('points')}`;
          table.innerHTML += `<tr class="Score"><td>${k+1}</td><td>${scores[k].username}</td><td>${score}</td></tr>`;
        }
        break;
      }
    }
  }

  window.api.get('getHighscores', (result) => {
    highscores = result;
    showHighscores();
    window.dispatchEvent(new CustomEvent('progress:executed'));
  }, (error) => {
    console.error(error);
    window.dispatchEvent(new CustomEvent('progress:executed'));
  });
  const modeSelector = document.querySelector('select[name="gamemode"]'),
        difficultySelector = document.querySelector('select[name="difficulty"]');
  modeSelector.addEventListener('change', showHighscores);
  difficultySelector.addEventListener('change', showHighscores);
})();