const locales = {
  DE: {
    undefined: '???',
    fps: 'FPS',
    level: 'Level',
    time: 'Zeit',
    points: 'Punkte',
    play: 'Spielen',
    player: 'Spieler',
    confirm: 'Bestätigen',
    backToStart: 'Zurück zum Hauptmenü',
    backToMainMenu: 'Möchtest du zum Hauptmenü zurückkehren?',
    mainMenu: 'Hauptmenü',
    gameOver: 'Game over',
    gameOverText: 'Möchtest du es erneut versuchen?',
    replay: 'Neustart',
    pause: 'Pause',
    loading: 'Lade...',
    statusInit: 'Initialisierung',
    statusTextures: 'Lade Texturen',
    statusSounds: 'Lade Sounds',
    statusScripts: 'Lade Scripte',
    statusExecution: 'Scripts ausführen',
    statusLoaded: 'Laden erfolgreich',
    login: 'Anmelden',
    profile: 'Profil',
    enterUserData: 'Nutzerdaten eingeben',
    username: 'Nutzername',
    password: 'Passwort',
    id: 'ID',
    noAccountYet: 'Du hast noch keinen Account? Gebe oben Nutzername und Passwort ein und registriere dich mit dem folgenden Button.',
    register: 'Registrieren',
    logout: 'Abmelden',
    errorMissingUserData: 'Du musst Nutzername und Passwort eingeben',
    errorUsernameTaken: 'Der Nutzername ist bereits vergeben, versuche einen anderen',
    errorLoginFailed: 'Anmeldung fehlgeschlagen. Überprüfe deine Eingaben oder versuche es später erneut',
    errorRegisterFailed: 'Registrierung fehlgeschlagen. Überprüfe deine Eingaben oder versuche es später erneut',
    errorInvalidCredentials: 'Anmeldung fehlgeschlagen. Password nicht korrekt',
    loginForMore: 'Melde dich an, um an Bestenlisten teilzunehmen',
    help: 'Hilfe',
    highscores: 'Bestenliste',
    score: 'Score',
    settings: 'Einstellungen',
    language: 'Sprache',
    sounds: 'Sounds',
    generalSettings: 'Allgemein',
    advancedSettings: 'Erweitert',
    countdownSetting: 'Countdown bevor Spiel startet',
    gameStart: 'Los!',
    exit: 'Beenden',
    gameSettings: 'Spielkonfiguration',
    difficulty: 'Schwierigkeit',
    gameMode: 'Spielmodus',
    easy: 'Leicht',
    normal: 'Normal',
    hard: 'Schwer',
    pro: 'Moorhahn',
    classic: 'Klassisch',
    deluxe: 'Deluxe',
    fullscreen: 'Vollbild',
    levelCompleteText: 'Die Zeit ist um. Gib deinen Namen ein um deinen Score in der Bestenliste zu speichern.',
    or: 'oder',
    name: 'Name',
    save: 'Speichern',
    saveSuccess: 'Speichern erfolgreich',
    saveError: 'Speichern fehlgeschlagen',
    reload: 'Nachladen',
    reloadHint: 'Hinweis: Nachladen mit Leertaste.'
  },
  EN: {
    undefined: '???',
    fps: 'FPS',
    level: 'Level',
    time: 'Time',
    points: 'Points',
    play: 'Play',
    player: 'Player',
    confirm: 'Confirm',
    backToStart: 'Back to main menu',
    backToMainMenu: 'Do you want to return to main menu?',
    mainMenu: 'Main menu',
    gameOver: 'Game over',
    gameOverText: 'Do you want to try again?',
    replay: 'Play again',
    pause: 'Pause',
    loading: 'Loading...',
    statusInit: 'Initialization',
    statusTextures: 'Loading textures',
    statusSounds: 'Loading sounds',
    statusScripts: 'Loading scripts',
    statusExecution: 'Executing scripts',
    statusLoaded: 'Loading successfull',
    login: 'Login',
    profile: 'Profile',
    enterUserData: 'Enter user data',
    username: 'Username',
    password: 'Password',
    id: 'ID',
    noAccountYet: 'You don\'t have an account yet? Enter your credentials above and register with the following button.',
    register: 'Register',
    logout: 'Logout',
    errorMissingUserData: 'You need to fill in your username and password',
    errorUsernameTaken: 'Username is already taken, try another one',
    errorLoginFailed: 'Login failed. Check your credentials or try again later',
    errorRegisterFailed: 'Registration failed. Check your credentials or try again later',
    errorInvalidCredentials: 'Login failed. Invalid password',
    loginForMore: 'Login to  join highscore lists',
    help: 'Help',
    highscores: 'Highscores',
    score: 'Score',
    settings: 'Settings',
    language: 'Language',
    sounds: 'Sounds',
    generalSettings: 'General',
    advancedSettings: 'Advanced Settings',
    countdownSetting: 'Countdown before game starts',
    gameStart: 'Go!',
    exit: 'Exit',
    gameSettings: 'Game settings',
    difficulty: 'Difficulty',
    gameMode: 'Gamemode',
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    pro: 'Moorhahn',
    classic: 'Classic',
    deluxe: 'Deluxe',
    fullscreen: 'Fullscreen',
    levelCompleteText: 'Time is up. Enter your name to save your score.',
    or: 'or',
    name: 'Name',
    save: 'Save',
    saveSuccess: 'Successfully saved',
    saveError: 'Score could not be saved',
    reload: 'Reload',
    reloadHint: 'Hint: Press space to reload.'
  }
}

class Locales {
  constructor() {
    this.locales = locales;
    this.language = window.ps.load('language');
    this.t = this.locales[this.language];
  }

  /**
   * Changes the languages
   * @param {String} language Language
   */
  changeLanguage(language) {
    window.ps.save('language', language);
    this.language = language;
    this.t = this.locales[this.language];
  }

  /**
   * Translates all the [data-t] elements of a given container
   * @param {Element} container The Element where all recursive children are translated
   */
  translatePage(container) {
    container.querySelectorAll('[data-t]').forEach((element) => {
      element.innerText = this.getTranslation(element.getAttribute('data-t'));
    });
  }

  /**
   * Translates a HTML String by replacing all {{example}} occurences
   * @param {String} raw HTML String to be translated
   * @returns Translated HTML String
   */
  translateRaw(raw) {
    const shortcodes = raw.match(/{{\s*t:\w+\s*}}/g);
    let result = raw;
    if (shortcodes) {
      shortcodes.forEach((shortcode) => {
        const word = shortcode.replace(/{{\s*t:/, '').replace(/\s*}}/, '');
        result = result.replace(shortcode, this.getTranslation(word));
      });
    }
    return result;
  }

  /**
   * Translates a single word or String
   * @param {String} word ID of the text to be translated
   * @returns Translated String
   */
  getTranslation(word) {
    return this.t[word] ? this.t[word] : this.t['undefined'];
  }
}

window.locales = new Locales();