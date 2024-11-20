// Dark mode conversion algorithm
const DarkMode = {
  settings: null,

  async init() {
    this.settings = await this.loadSettings();
    this.setupMutationObserver();
    this.applyDarkMode();
    this.setupMessageListener();
  },

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({
        enabled: false,
        brightness: 100,
        contrast: 100,
        temperature: 6500,
        mode: 'dynamic'
      }, (settings) => {
        resolve(settings);
      });
    });
  },

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'UPDATE_SETTINGS') {
        this.settings = message.settings;
        this.applyDarkMode();
      }
    });
  },

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      if (this.settings?.enabled) {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            this.applyDarkMode();
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  applyDarkMode() {
    if (!this.settings?.enabled) {
      this.removeDarkMode();
      return;
    }

    document.documentElement.style.setProperty('--dark-mode-enabled', '1');
    
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      if (element.nodeType === 1) {
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;

        if (backgroundColor !== 'rgba(0, 0, 0, 0)') {
          const darkColor = this.convertToDarkMode(backgroundColor);
          element.style.setProperty('background-color', darkColor, 'important');
        }

        if (color !== 'rgba(0, 0, 0, 0)') {
          const lightColor = this.convertToLightMode(color);
          element.style.setProperty('color', lightColor, 'important');
        }
      }
    });

    // Apply to images
    document.querySelectorAll('img').forEach(img => {
      const brightness = this.settings.brightness / 100;
      const contrast = this.settings.contrast / 100;
      img.style.setProperty('filter', `brightness(${brightness}) contrast(${contrast})`, 'important');
    });
  },

  removeDarkMode() {
    document.documentElement.style.removeProperty('--dark-mode-enabled');
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      element.style.removeProperty('background-color');
      element.style.removeProperty('color');
      if (element.tagName === 'IMG') {
        element.style.removeProperty('filter');
      }
    });
  },

  convertToDarkMode(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return color;

    const brightness = this.settings.brightness / 100;
    const contrast = this.settings.contrast / 100;

    let [r, g, b] = rgb;
    
    switch (this.settings.mode) {
      case 'dynamic':
        r = Math.round((255 - r) * 0.8 * brightness * contrast);
        g = Math.round((255 - g) * 0.8 * brightness * contrast);
        b = Math.round((255 - b) * 0.8 * brightness * contrast);
        break;
      case 'contrast':
        r = g = b = 0;
        break;
      case 'gentle':
        r = Math.round((255 - r) * 0.6 * brightness * contrast);
        g = Math.round((255 - g) * 0.6 * brightness * contrast);
        b = Math.round((255 - b) * 0.6 * brightness * contrast);
        break;
    }

    return `rgb(${r}, ${g}, ${b})`;
  },

  convertToLightMode(color) {
    const rgb = this.parseColor(color);
    if (!rgb) return color;

    const brightness = this.settings.brightness / 100;
    const contrast = this.settings.contrast / 100;

    let [r, g, b] = rgb;
    
    switch (this.settings.mode) {
      case 'dynamic':
        r = Math.round(r * 1.2 * brightness * contrast);
        g = Math.round(g * 1.2 * brightness * contrast);
        b = Math.round(b * 1.2 * brightness * contrast);
        break;
      case 'contrast':
        r = g = b = 255;
        break;
      case 'gentle':
        r = Math.round(r * 1.1 * brightness * contrast);
        g = Math.round(g * 1.1 * brightness * contrast);
        b = Math.round(b * 1.1 * brightness * contrast);
        break;
    }

    return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
  },

  parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
  }
};

// Initialize dark mode
DarkMode.init();