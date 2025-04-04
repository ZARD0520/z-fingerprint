export {};

declare global {
  // 扩展Window接口
  interface Window {
    ActiveXObject: new (type: string) => any;
    InstallTrigger?: unknown;
    chrome?: {
      runtime?: {
        id?: string;
      };
    };
  }

  // 扩展Navigator接口
  interface Navigator {
    pdfViewerEnabled?: boolean;
    connection?: {
      downlink: number;
      effectiveType: string;
    };
  }
}