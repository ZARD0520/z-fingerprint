export const getCanvasFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 240;
  canvas.height = 60;

  // 绘制特征图形
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillStyle = '#f60';
  ctx!.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx!.fillStyle = '#069';
  ctx!.fillText('BrowserFingerprintSDK', 2, 15);
  
  // 添加抗锯齿检测
  ctx!.globalCompositeOperation = 'multiply';
  ctx!.fillStyle = 'rgb(255,0,255)';
  ctx!.beginPath();
  ctx!.arc(50, 50, 50, 0, Math.PI * 2, true);
  ctx!.closePath();
  ctx!.fill();

  // 转换为DataURL并生成哈希
  return canvas.toDataURL();
};