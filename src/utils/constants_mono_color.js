// src/utils/constants.js

export const STORAGE_KEY = 'yeobaek.quotes.memos.v3';

export const COLOR_PRESETS = {
  bg: [
    { name: '화이트', color: '#FFFFFF' },
    { name: '라이트그레이', color: '#F8F9FA' },
    { name: '소프트그레이', color: '#F1F3F5' },
    { name: '미디엄그레이', color: '#E9ECEF' },
    { name: '다크그레이', color: '#DEE2E6' },
    { name: '블랙', color: '#212529' },
    { name: '차콜', color: '#343A40' },
    { name: '슬레이트', color: '#495057' },
  ],
  text: [
    { name: '블랙', color: '#000000' },
    { name: '차콜', color: '#212529' },
    { name: '다크그레이', color: '#495057' },
    { name: '그레이', color: '#6C757D' },
    { name: '라이트그레이', color: '#ADB5BD' },
    { name: '화이트', color: '#FFFFFF' },
    { name: '소프트화이트', color: '#F8F9FA' },
    { name: '오프화이트', color: '#E9ECEF' },
  ],
};

export const DEFAULT_QUOTE = {
  bgColor: '#FFFFFF',
  textColor: '#000000',
};

export const SORT_MODES = {
  NEWEST: 'updatedAt_desc',
  OLDEST: 'updatedAt_asc',
};

export const VIEW_MODES = {
  LIST: 'list',
  PAGE: 'page',
};