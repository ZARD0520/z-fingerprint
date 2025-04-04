import { getCanvasFingerprint } from './collectors/canvas';
import { getWebGLFingerprint } from './collectors/webgl';
import { getFontsFingerprint } from './collectors/fonts';
import { computeStableFingerprint } from './core/fingerprint';
import { getPlatformData } from './utils/platform';
import { StorageManager } from './core/storage';

type FingerprintOptions = {
  canvas?: boolean;
  webgl?: boolean;
  fonts?: boolean;
  audio?: boolean;
  webrtc?: boolean;
  plugins?: boolean;
  persistent?: boolean;
  storageKey?: string;
};

export class BrowserFingerprint {
  private readonly options: FingerprintOptions;
  private storage!: StorageManager;

  constructor(options?: FingerprintOptions) {
    this.options = {
      canvas: true,
      webgl: true,
      fonts: true,
      persistent: true,
      storageKey: 'browser_fingerprint',
      ...options
    };
  }

  private async collectComponents() {
    const components: Record<string, any> = {
      platform: getPlatformData(),
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sessionStorage: !!window.sessionStorage,
      localStorage: !!window.localStorage
    };

    if (this.options.canvas) {
      components.canvas = getCanvasFingerprint();
    }

    if (this.options.webgl) {
      components.webgl = getWebGLFingerprint();
    }

    if (this.options.fonts) {
      components.fonts = await getFontsFingerprint();
    }

    return components;
  }

  async getFingerprint(): Promise<string> {
    if (this.options.persistent) {
      const stored = this.storage.get(this.options.storageKey!);
      if (stored) return stored;
    }

    const components = await this.collectComponents();
    const fingerprint = computeStableFingerprint(components);

    if (this.options.persistent) {
      this.storage.set(this.options.storageKey!, fingerprint);
    }

    return fingerprint;
  }
}

export default BrowserFingerprint;