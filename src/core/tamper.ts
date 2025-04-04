export class TamperDetector {
  private observer: MutationObserver;

  constructor() {
    this.observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.target === document.documentElement)) {
        console.warn('DOM root element modified!');
      }
    });
  }

  startMonitoring() {
    this.observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  checkAPIPrototypes() {
    const apis = ['navigator', 'screen', 'CanvasRenderingContext2D'];
    return apis.map(api => {
      const proto = (window as any)[api]?.prototype;
      return proto && Object.keys(proto).join(',');
    });
  }
}