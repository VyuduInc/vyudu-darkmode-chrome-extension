import { ColorConverter } from '../utils/colorConverter.js';
import { SiteSettings } from '../utils/siteSettings.js';
import { ImageProcessor } from '../utils/imageProcessor.js';
import { ElementAnalyzer } from '../utils/elementAnalyzer.js';

export class DarkMode {
  constructor() {
    this.settings = null;
    this.observer = null;
    this.processedElements = new WeakSet();
    this.imageProcessor = new ImageProcessor();
    this.elementAnalyzer = new ElementAnalyzer();
    this.preservedElements = new Set(['video', 'canvas']);
  }

  async init() {
    const hostname = await SiteSettings.getCurrentSite();
    this.settings = await SiteSettings.getSiteSettings(hostname);
    this.setupMutationObserver();
    this.injectCustomStyles();
    await this.applyDarkMode();
  }

  injectCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
      html[data-dark-mode="enabled"] {
        color-scheme: dark !important;
      }
      
      html[data-dark-mode="enabled"] ::-webkit-scrollbar {
        background-color: #202324 !important;
      }
      
      html[data-dark-mode="enabled"] ::-webkit-scrollbar-thumb {
        background-color: #454a4d !important;
      }
      
      @media (prefers-color-scheme: dark) {
        html[data-dark-mode="enabled"] img:not([data-dark-mode-processed]) {
          filter: brightness(0.85) contrast(1.1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupMutationObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      const elementsToProcess = new Set();

      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          elementsToProcess.add(mutation.target);
        }
        
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            elementsToProcess.add(node);
            node.querySelectorAll('*').forEach(el => elementsToProcess.add(el));
          }
        });
      });

      this.processBatch(Array.from(elementsToProcess));
    });

    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  async processBatch(elements) {
    const batchSize = 50;
    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize);
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          batch.forEach(element => this.processElement(element));
          resolve();
        });
      });
    }
  }

  processElement(element) {
    if (this.processedElements.has(element) || 
        this.preservedElements.has(element.tagName.toLowerCase())) {
      return;
    }

    if (element instanceof HTMLImageElement) {
      this.imageProcessor.processImage(element, this.settings);
      return;
    }

    const elementType = this.elementAnalyzer.analyzeElement(element);
    if (!elementType) return;

    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      const darkColor = this.convertColor(backgroundColor, 'background', elementType);
      element.style.setProperty('background-color', darkColor, 'important');
    }

    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
      const lightColor = this.convertColor(color, 'text', elementType);
      element.style.setProperty('color', lightColor, 'important');
    }

    // Process shadows and borders
    if (computedStyle.boxShadow !== 'none') {
      const darkShadow = this.adjustShadow(computedStyle.boxShadow);
      element.style.setProperty('box-shadow', darkShadow, 'important');
    }

    if (computedStyle.borderColor !== 'rgba(0, 0, 0, 0)') {
      const darkBorder = this.convertColor(computedStyle.borderColor, 'border', elementType);
      element.style.setProperty('border-color', darkBorder, 'important');
    }

    this.processedElements.add(element);
  }

  convertColor(color, type, elementType) {
    const rgb = this.parseColor(color);
    if (!rgb) return color;

    let result = [...rgb];

    switch (this.settings.mode) {
      case 'dynamic':
        result = this.applyDynamicMode(result, type, elementType);
        break;
      case 'contrast':
        result = this.applyContrastMode(result, type);
        break;
      case 'gentle':
        result = this.applyGentleMode(result, type);
        break;
    }

    result = ColorConverter.adjustBrightness(result, this.settings.brightness / 100);
    result = ColorConverter.adjustContrast(result, this.settings.contrast);
    result = ColorConverter.adjustTemperature(result, this.settings.temperature);

    return `rgb(${result.map(Math.round).join(',')})`;
  }

  applyDynamicMode(rgb, type, elementType) {
    const [h, s, l] = ColorConverter.rgbToHsl(...rgb);
    
    switch (type) {
      case 'background':
        return ColorConverter.hslToRgb(h, s * 0.8, 100 - l * 0.8);
      case 'text':
        return ColorConverter.hslToRgb(h, s * 0.7, Math.min(95, l * 1.2));
      case 'border':
        return ColorConverter.hslToRgb(h, s * 0.6, 30);
      default:
        return rgb;
    }
  }

  applyContrastMode(rgb, type) {
    switch (type) {
      case 'background':
        return [0, 0, 0];
      case 'text':
        return [255, 255, 255];
      case 'border':
        return [51, 51, 51];
      default:
        return rgb;
    }
  }

  applyGentleMode(rgb, type) {
    const [h, s, l] = ColorConverter.rgbToHsl(...rgb);
    
    switch (type) {
      case 'background':
        return ColorConverter.hslToRgb(h, s * 0.5, Math.max(15, 100 - l * 0.7));
      case 'text':
        return ColorConverter.hslToRgb(h, s * 0.3, Math.min(85, l * 1.1));
      case 'border':
        return ColorConverter.hslToRgb(h, s * 0.4, 40);
      default:
        return rgb;
    }
  }

  adjustShadow(shadow) {
    return shadow.replace(/rgba?\([^)]+\)/g, match => {
      const rgb = this.parseColor(match);
      if (!rgb) return match;
      
      const darkRgb = this.convertColor(match, 'shadow', 'shadow');
      return match.replace(/\d+, \d+, \d+/, darkRgb.slice(4, -1));
    });
  }

  parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
  }

  async applyDarkMode() {
    if (!this.settings.enabled) return;
    
    document.documentElement.setAttribute('data-dark-mode', 'enabled');
    document.documentElement.setAttribute('data-dark-mode-theme', this.settings.mode);
    
    const elements = document.querySelectorAll('*');
    await this.processBatch(Array.from(elements));
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.processedElements = new WeakSet();
    this.applyDarkMode();
  }
}</content>