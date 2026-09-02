// src/utils/constants.js

export const STORAGE_KEY = 'yeobaek.quotes.memos.v3';

// “The School of Life” 시리즈에서 따온 따뜻한 파스텔 컬러 팔레트
export const COLOR_PRESETS = {
  bg: [
    // Blue & Cool
    { name: '스카이블루', color: '#76B8E1' }, // 파랑-하늘
    { name: '민트블루', color: '#A7D5C5' },  // 부드러운 민트
    { name: '딥블루', color: '#205072' },    // 감정적 안정감의 딥블루

    // Green & Yellow
    { name: '라임그린', color: '#C6D166' },  // 밝은 라임-노랑
    { name: '올리브그린', color: '#6E8B3D' }, // 묵직한 올리브
    { name: '모스그린', color: '#9BA17B' },  // 부드러운 모스
    // Pink & Coral
    { name: '로즈핑크', color: '#E37B88' },
    { name: '살몬코랄', color: '#E76E51' },

    // Violet & Warm
    { name: '라벤더', color: '#B3A1D1' },
    { name: '토프', color: '#9C8F84' },
    { name: '클레이', color: '#C7B6A1' },

    // Neutral
    { name: '라이트그레이', color: '#E7E7E7' },
    { name: '아이보리', color: '#F9F5E3' },
  ],

  text: [
    // 어두운 배경용
    { name: '화이트', color: '#FFFFFF' },
    { name: '아이보리', color: '#FAFAF0' },
    { name: '연베이지', color: '#F4EBD0' },

    // 밝은 배경용
    { name: '차콜', color: '#2F2F2F' },
    { name: '다크그레이', color: '#4B4B4B' },
    { name: '올리브블랙', color: '#3D3A2E' },
    { name: '네이비블랙', color: '#222E3A' },
  ],
};

export const DEFAULT_QUOTE = {
  bgColor: '#F9F5E3',  // 민트 블루
  textColor: '#2F2F2F', // 차콜
};

export const SORT_MODES = {
  NEWEST: 'updatedAt_desc',
  OLDEST: 'updatedAt_asc',
};

export const VIEW_MODES = {
  LIST: 'list',
  PAGE: 'page',
};

// src/utils/constants.js 맨 아래에 추가
// src/utils/constants.js 맨 아래에 추가

export const SEED_KEY = 'mindmargin_seeded_v2';

export const SAMPLE_QUOTES = [
  {
    text: '여백은 비어 있는 것이 아니라, 아직 채워지지 않은 가능성이다.',
    source: 'Mind Margin',
    tags: ['영감', '여백'],
    bgColor: '#FFFFFF',
    textColor: '#111111',
  },
  {
    text: '검토되지 않은 삶은 살 가치가 없다.',
    source: '소크라테스',
    tags: ['철학', '성찰'],
    bgColor: '#1D2B26',
    textColor: '#F5F3EE',
  },
  {
    text: '우리는 반복하는 존재다. 그러므로 탁월함은 행동이 아니라 습관이다.',
    source: '아리스토텔레스',
    tags: ['습관', '성장'],
    bgColor: '#E8E4DC',
    textColor: '#2B2B2B',
  },
  {
    text: '천 리 길도 한 걸음부터 시작된다.',
    source: '노자',
    tags: ['시작', '용기'],
    bgColor: '#2E4A62',
    textColor: '#FFFFFF',
  },
  {
    text: '오늘 할 수 있는 일을 내일로 미루지 말라.',
    source: '벤자민 프랭클린',
    tags: ['실행', '시간'],
    bgColor: '#F4E9DC',
    textColor: '#3A2F26',
  },
  {
    text: '자기 자신에게 진실하라.',
    source: '셰익스피어, 햄릿',
    tags: ['자존감', '진실'],
    bgColor: '#6B4C57',
    textColor: '#FFF8F5',
  },
  {
    text: '나는 실패한 것이 아니다. 되지 않는 방법을 찾아냈을 뿐이다.',
    source: '토머스 에디슨',
    tags: ['도전', '실패'],
    bgColor: '#DCE5DE',
    textColor: '#1F3329',
  },
  {
    text: '가장 어두운 밤도 끝이 나고 해는 떠오른다.',
    source: '빅토르 위고',
    tags: ['희망', '위로'],
    bgColor: '#3D3A5C',
    textColor: '#F0EDFF',
  },
  {
    text: '문장을 모으는 일은 결국 나를 모으는 일이다.',
    source: '',
    tags: ['기록', '여백'],
    bgColor: '#F9F5F0',
    textColor: '#2A2A2A',
  },
  {
    text: '좋은 생각은 오래 머무는 것이 아니라, 붙잡아 둔 것이다.',
    source: '',
    tags: ['기록', '생각'],
    bgColor: '#8C7B6B',
    textColor: '#FFFDF9',
  },
];
