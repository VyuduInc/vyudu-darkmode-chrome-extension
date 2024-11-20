export class ElementAnalyzer {
  constructor() {
    this.textElements = new Set(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a']);
    this.buttonElements = new Set(['button', 'input[type="button"]', 'input[type="submit"]']);
    this.backgroundElements = new Set(['div', 'section', 'article', 'main', 'aside', 'nav']);
  }

  analyzeElement(element) {
    if (!element || !element.tagName) return null;

    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const computedStyle = window.getComputedStyle(element);

    // Check for interactive elements
    if (this.buttonElements.has(tagName) || role === 'button') {
      return 'button';
    }

    // Check for text content
    if (this.textElements.has(tagName)) {
      return 'text';
    }

    // Check for background elements
    if (this.backgroundElements.has(tagName)) {
      return 'background';
    }

    // Analyze element characteristics
    if (this.isTextContent(element, computedStyle)) {
      return 'text';
    }

    if (this.isBackgroundElement(element, computedStyle)) {
      return 'background';
    }

    return 'default';
  }

  isTextContent(element, computedStyle) {
    return element.childNodes.length === 1 && 
           element.firstChild.nodeType === Node.TEXT_NODE &&
           computedStyle.display !== 'none' &&
           computedStyle.visibility !== 'hidden';
  }

  isBackgroundElement(element, computedStyle) {
    const hasBackground = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                         computedStyle.backgroundColor !== 'transparent';
    const isContainer = computedStyle.display.includes('flex') ||
                       computedStyle.display.includes('grid') ||
                       computedStyle.display === 'block';
    
    return hasBackground && isContainer;
  }
}</content>