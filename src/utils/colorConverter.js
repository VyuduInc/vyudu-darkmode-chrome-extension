// Color conversion utilities
export class ColorConverter {
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  static hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  static adjustBrightness(rgb, brightness) {
    const [h, s, l] = this.rgbToHsl(...rgb);
    const newL = Math.max(0, Math.min(100, l * brightness));
    return this.hslToRgb(h, s, newL);
  }

  static adjustContrast(rgb, contrast) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    return rgb.map(channel => 
      Math.max(0, Math.min(255, factor * (channel - 128) + 128))
    );
  }

  static adjustTemperature(rgb, temperature) {
    const tempFactor = (temperature - 6500) / 1000;
    const rFactor = 1 + (0.1 * tempFactor);
    const bFactor = 1 - (0.1 * tempFactor);
    return [
      Math.min(255, rgb[0] * rFactor),
      rgb[1],
      Math.min(255, rgb[2] * bFactor)
    ];
  }
}