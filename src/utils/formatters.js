// src/utils/formatters.js

export const uuid = () => 
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const now = () => Date.now();

export const formatDate = (ts) => {
  const n = Number(ts);
  if (!Number.isFinite(n) || n <= 0) return '';
  const d = new Date(n);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

export const tryParse = (str) => {
  try { 
    return JSON.parse(str); 
  } catch { 
    return null; 
  }
};

export const migrateArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((x) => ({
    id: x.id || uuid(),
    text: String(x.text ?? '').trim(),
    source: x.source ? String(x.source) : undefined,
    tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
    favorite: !!x.favorite,
    bgColor: x.bgColor || '#FFFFFF',
    textColor: x.textColor || '#000000',
    createdAt: Number(x.createdAt) > 0 ? Number(x.createdAt) : now(),
    updatedAt: Number(x.updatedAt) > 0 ? Number(x.updatedAt) : now(),
  })).filter((q) => q.text.length > 0);
};

// 여기부터 추가!
export const getColorBrightness = (hexColor) => {
  if (!hexColor) return 255;
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const isDarkColor = (hexColor) => {
  return getColorBrightness(hexColor) < 128;
};