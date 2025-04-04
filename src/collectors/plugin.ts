type PluginDetectionOptions = {
  detectPDF?: boolean;
  detectFlash?: boolean;
  detectExtensions?: boolean;
};

export const detectBrowserPlugins = (
  options: PluginDetectionOptions = {}
): string[] => {
  const detectedPlugins = new Set<string>();

  try {
    // 基础插件检测
    if ('plugins' in navigator && navigator.plugins?.length > 0) {
      // 安全遍历插件列表
      for (let i = 0; i < navigator.plugins.length; i++) {
        const plugin = navigator.plugins.item(i);
        if (plugin?.name) {
          detectedPlugins.add(plugin.name.trim());
        }
      }
    }

    // PDF 查看器检测
    if (options.detectPDF !== false) {
      if (typeof navigator.pdfViewerEnabled === 'boolean') {
        detectedPlugins.add(
          navigator.pdfViewerEnabled ? 'PDF Viewer' : 'PDF Viewer Disabled'
        );
      } else if (detectPDFViaMimeType()) {
        detectedPlugins.add('PDF Viewer (Legacy)');
      }
    }

    // Flash 检测
    if (options.detectFlash !== false) {
      const flashVersion = detectFlashVersion();
      if (flashVersion) {
        detectedPlugins.add(`Adobe Flash Player ${flashVersion}`);
      }
    }

    // 浏览器扩展检测
    if (options.detectExtensions !== false) {
      detectBrowserExtensions().forEach(ext => detectedPlugins.add(ext));
    }

    // 特殊MIME类型检测
    detectSpecialMimeTypes().forEach(mime => detectedPlugins.add(mime));

  } catch (e) {
    console.warn('Plugin detection failed:', e);
  }

  return Array.from(detectedPlugins).sort();
};

// 私有辅助方法 --------------------------------------------------
const detectPDFViaMimeType = (): boolean => {
  try {
    return !!navigator.mimeTypes?.['application/pdf']?.enabledPlugin;
  } catch {
    return false;
  }
};

const detectFlashVersion = (): string | null => {
  try {
    // ActiveX 检测 (IE)
    if (typeof window.ActiveXObject !== 'undefined') {
      const flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      return flash.GetVariable('$version') || 'ActiveX';
    }

    // NPAPI 检测 (旧版浏览器)
    if (navigator.plugins?.['Shockwave Flash']) {
      const desc = navigator.plugins['Shockwave Flash'].description;
      const version = desc.match(/\d+\.\d+\.\d+/);
      return version ? version[0] : 'NPAPI';
    }
  } catch (e) {
    // 隐私模式可能抛出异常
  }
  return null;
};

const detectBrowserExtensions = (): string[] => {
  const extensions: string[] = [];

  try {
    // Chrome 扩展检测
    if (typeof chrome?.runtime?.id !== 'undefined') {
      extensions.push('Chrome Extensions');
    }

    // Firefox 扩展检测
    if (typeof InstallTrigger !== 'undefined') {
      extensions.push('Firefox Add-ons');
    }

    // Safari 扩展检测
    if ((window as any).safari?.extension) {
      extensions.push('Safari Extensions');
    }
  } catch (e) {
    console.debug('Extension detection failed:', e);
  }

  return extensions;
};

const detectSpecialMimeTypes = (): string[] => {
  const specialMimeTypes = [
    'application/x-shockwave-flash',
    'application/x-pdf',
    'application/vnd.google-earth.kml+xml'
  ];

  return specialMimeTypes
    .filter(mime => navigator.mimeTypes?.[mime]?.enabledPlugin)
    .map(mime => `${mime.split('/').pop()} Handler`);
};