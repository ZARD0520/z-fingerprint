export const getPlatformData = () => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  languages: navigator.languages,
  hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
  deviceMemory: (navigator as any).deviceMemory || 'unknown',
  touchSupport: 'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 0
});