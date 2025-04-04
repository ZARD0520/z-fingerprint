export const getAudioFingerprint = async (): Promise<string> => {
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    
    oscillator.connect(analyser);
    analyser.connect(context.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, context.currentTime);
    
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    
    await new Promise(resolve => {
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        context.close().then(resolve);
      }, 100);
    });
    
    return hashFloatArray(buffer);
  } catch (e) {
    return 'audio_not_supported';
  }
};

const hashFloatArray = (data: Float32Array): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data[i];
    hash |= 0;
  }
  return (hash >>> 0).toString(36);
};