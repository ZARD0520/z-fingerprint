import { generateHash } from '../utils/hash';

export const computeStableFingerprint = (components: object): string => {
  // 数据标准化处理
  const normalized = normalizeComponents(components);
  
  // 稳定性处理（排除易变参数）
  delete normalized.screen.resolution; // 排除分辨率
  delete normalized.platform.userAgent; // 排除动态UA
  
  // 生成稳定哈希
  return generateHash(normalized);
};

const normalizeComponents = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(normalizeComponents).sort();
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data)
      .sort()
      .reduce((acc: Record<string, any>, key) => {
        acc[key] = normalizeComponents(data[key]);
        return acc;
      }, {});
  }
  
  return data;
};