const FONT_LIST = [
  'Arial', 'Helvetica', 'Times New Roman', 
  'Courier New', 'Verdana', 'Comic Sans MS'
];

const createFontDetector = () => {
  const baseWidth: Record<string, number> = {};
  const baseHeight: Record<string, number> = {};
  const spans: HTMLElement[] = [];
  
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';

  FONT_LIST.forEach(font => {
    const span = document.createElement('span');
    span.style.fontFamily = `'${font}'`;
    span.textContent = 'abcdefghijklmnopqrstuvwxyz';
    container.appendChild(span);
    spans.push(span);
  });

  return { container, spans };
};

export const getFontsFingerprint = (): Promise<string[]> => {
  return new Promise(resolve => {
    const { container, spans } = createFontDetector();
    document.body.appendChild(container);

    const baseMeasurements = FONT_LIST.map((_, i) => ({
      width: spans[i].offsetWidth,
      height: spans[i].offsetHeight
    }));

    setTimeout(() => {
      const availableFonts = FONT_LIST.filter((_, i) => {
        return spans[i].offsetWidth !== baseMeasurements[i].width ||
               spans[i].offsetHeight !== baseMeasurements[i].height;
      });

      document.body.removeChild(container);
      resolve(availableFonts);
    }, 100);
  });
};