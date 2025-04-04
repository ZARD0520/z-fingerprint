export const getWebGLFingerprint = (): Record<string, any> => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl')/* || canvas.getContext('experimental-webgl'); */
  
  if (!gl) return {};

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  return {
    vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
    renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
    extensions: gl.getSupportedExtensions(),
    parameters: {
      MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      MAX_RENDERBUFFER_SIZE: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
    }
  };
};