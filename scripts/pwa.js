import { AssetLoader } from "./assetloader.js";

class PWA {
  constructor() {
    this.loadingContainer = document.getElementById('loading');
    this.loadingBar = this.loadingContainer.querySelector('.Loading__Bar--Inner');
    this.loadingStep = this.loadingContainer.querySelector('.Loading__Step');
    this.contentContainer = document.getElementById('content');
    this.textureContainer = document.getElementById('textures');
    this.soundsContainer = document.getElementById('sounds');
    this.assetLoader = new AssetLoader();

    window.locales.translatePage(document);

    // if (window.ps.load('apiVersion') !== window.api.version) {
    //   window.ps.reset();
    //   window.ps.save('apiVersion', window.api.version);
    // }
  
    window.addEventListener('progress:changed', (e) => {
      this.updateProgress(e.detail);
    });
    
    if (window.location.search) {
      const search = new URLSearchParams(window.location.search);
      if (search.has('page')) {
        this.loadPage(search.get('page'));
      }
      else {
        this.loadPage('menu');
      }
    }
    else {
      this.loadPage('menu');
    }

    window.addEventListener('fullscreenchange', () => {
      const fullscreenToggle = document.querySelector('[data-action="toggle-fullscreen"]');
      if (document.fullscreenElement && window.ps.load('fullscreen') === 'off') {
        window.ps.save('fullscreen', 'on');
        if (fullscreenToggle) fullscreenToggle.setAttribute('data-fullscreen', 'on');
      }
      else if (!document.fullscreenElement && window.ps.load('fullscreen') === 'on') {
        window.ps.save('fullscreen', 'off');
        if (fullscreenToggle) fullscreenToggle.setAttribute('data-fullscreen', 'off');
      }
    });
  }

  toggleFullscreen(fullscreen) {
    if (fullscreen) {
      if (this.contentContainer.requestFullscreen) {
        this.contentContainer.requestFullscreen();
      }
      else if (this.contentContainer.webkitRequestFullscreen) { // Safari
        this.contentContainer.webkitRequestFullscreen();
      }
      else if (this.contentContainer.mozRequestFullScreen) { // Firefox
        this.contentContainer.mozRequestFullScreen();
      }
    }
    else {
      if (!document.fullscreenElement) return;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      }
      else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      }
    }
  }

  updateProgress() {
    const keys = Object.keys(this.progress);
    let percentage = 0,
        step = null,
        ready = true;
    keys.forEach((key) => {
      const part = this.progress[key];
      percentage += part.current / part.steps / keys.length;
      if (part.current < part.steps) {
        if (!step) step = key;
        ready = false;
      }
    });
    this.loadingBar.style.width = '' + Math.round(percentage * 100) + '%';
    if (step) {
      this.loadingStep.innerText = window.locales.getTranslation(this.progress[step].t);
    }
    else {
      this.loadingStep.innerText = window.locales.getTranslation('statusLoaded');
    }
    if (step === 'execution') {
      switch (this.page) {
        case 'game': {
          import('./game.js').then(({ Game }) => {
            this.game = new Game();
          });
          break;
        }
      }
    }
    else if (ready) {
      this.contentContainer.style.display = '';
      setTimeout(() => {
        this.loadingContainer.setAttribute('data-visible', 'false');
      }, 500);
    }
  }

  initLinks() {
    this.contentContainer.querySelectorAll('a[data-href]:not([data-link-initialized])').forEach((link) => {
      link.href = 'javascript:void(0);';
      link.addEventListener('click', (e) => {
        const a = e.target.tagName === 'A' ? e.target : e.target.closest('a'),
              href = a.getAttribute('data-href'),
              hrefArr = href.split('/'),
              page = hrefArr[hrefArr.length - 1].split('?')[0];
        this.loadPage(page);
      });
      link.setAttribute('data-link-initialized', 'true');
    });
  }

  loadPage(page) {
    // Init loading
    this.contentContainer.style.display = 'none';
    this.loadingContainer.setAttribute('data-visible', 'true');
    this.loadingBar.style.width = '0%';
    this.page = page;
    this.progress = {
      init: {
        t: 'statusInit',
        current: 0,
        steps: 3
      },
      textures: {
        t: 'statusTextures',
        current: 0,
        steps: 1 
      },
      sounds: {
        t: 'statusSounds',
        current: 0,
        steps: 1 
      },
      scripts: {
        t: 'statusScripts',
        current: 0,
        steps: 1
      },
      execution: {
        t: 'statusExecution',
        current: 0,
        steps: 1
      }
    };

    // Unload old page
    if (this.game) {
      this.game.unload();
      this.game = undefined;
    }
    document.head.querySelectorAll('[data-dynamic]').forEach((element) => {
      element.remove();
    });
    this.contentContainer.innerHTML = '';
    this.progress.init.current += 1;
    this.updateProgress();

    // Listener for finished script execution
    window.addEventListener('progress:executed', () => {
      this.initLinks();
      this.progress.execution.current = 1;
      this.updateProgress();
    }, { once: true });

    // Download new page
    fetch('html/' + page + '.html').then(response => response.text()).then(html => {
      this.progress.init.current += 1;
      this.updateProgress();
      const temp = document.createElement('div');
      temp.innerHTML = html;

      // Load new page content
      const tempContent = temp.querySelector('#content');
      Array.from(tempContent.children).forEach((element) => {
        this.contentContainer.appendChild(element);
      });
      window.locales.translatePage(this.contentContainer);
      this.progress.init.current += 1;
      this.updateProgress();

      // Load assets
      if (this.textureContainer.getAttribute('data-initialized') === 'false' && ['game', 'editor'].includes(page)) {
        this.assetLoader.loadTextures(this.textureContainer, this.progress);
      }
      else {
        this.progress.textures.current = 1;
        this.updateProgress();
      }
      if (this.soundsContainer.getAttribute('data-initialized') === 'false' && page === 'game') {
        this.assetLoader.loadSounds(this.soundsContainer, this.progress);
      }
      else {
        this.progress.sounds.current = 1;
        this.updateProgress();
      }

      // Load new scripts and styles
      const tempHead = temp.querySelector('#head');
      this.progress.scripts.steps = tempHead.children.length;
      Array.from(tempHead.children).forEach((element) => {
        let clone = document.createElement(element.tagName);
        clone.addEventListener('load', () => {
          this.progress.scripts.current += 1;
          this.updateProgress();
        });
        clone.setAttribute('data-dynamic', 'true');
        element.getAttributeNames().forEach((attribute) => {
          clone.setAttribute(attribute, element.getAttribute(attribute));
        });
        document.head.appendChild(clone);
      });
    });
  }
}

window.pwa = new PWA();