export class ImageProcessor {
  constructor() {
    this.processedImages = new WeakSet();
  }

  processImage(img, settings) {
    if (this.processedImages.has(img)) return;

    const adjustments = this.calculateImageAdjustments(settings);
    img.style.setProperty('filter', adjustments, 'important');
    img.setAttribute('data-dark-mode-processed', 'true');
    
    this.processedImages.add(img);
  }

  calculateImageAdjustments(settings) {
    const brightness = 0.85 * (settings.brightness / 100);
    const contrast = 1.1 * (settings.contrast / 100);
    const temperature = this.calculateColorTemperature(settings.temperature);

    return `brightness(${brightness}) contrast(${contrast}) ${temperature}`;
  }

  calculateColorTemperature(temp) {
    const factor = (temp - 6500) / 1000;
    if (factor > 0) {
      return `sepia(${factor * 0.1})`;
    } else {
      return `hue-rotate(${factor * -10}deg)`;
    }
  }
}</content>