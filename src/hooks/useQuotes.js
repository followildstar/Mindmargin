// src/hooks/useQuotes.js
import { useState, useEffect, useMemo, useRef } from 'react';
import { Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadQuotes, saveQuotes } from '../utils/storage';
import { uuid, now, formatDate } from '../utils/formatters';
import { SORT_MODES, SAMPLE_QUOTES, SEED_KEY } from '../utils/constants';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [query, setQuery] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);
  const [sortMode, setSortMode] = useState(SORT_MODES.NEWEST);
  const [selectedTags, setSelectedTags] = useState([]);

  // 최초 로드가 끝나기 전에는 저장하지 않도록 막는 플래그
  const isLoaded = useRef(false);

  // 최초 로드 + 첫 실행 시 더미 데이터 주입
  useEffect(() => {
    const init = async () => {
      const loadedQuotes = await loadQuotes();

      if (loadedQuotes.length > 0) {
        setQuotes(loadedQuotes);
        isLoaded.current = true;
        return;
      }

      // 이미 한 번 시드를 넣었으면 다시 넣지 않음 (사용자가 전체 삭제한 경우)
      const seeded = await AsyncStorage.getItem(SEED_KEY);
      if (seeded) {
        setQuotes([]);
        isLoaded.current = true;
        return;
      }

      const seedQuotes = SAMPLE_QUOTES.map((s) => ({
        id: uuid(),
        text: s.text,
        source: s.source || undefined,
        tags: s.tags || [],
        favorite: false,
        bgColor: s.bgColor,
        textColor: s.textColor,
        createdAt: now(),
        updatedAt: now(),
      }));

      setQuotes(seedQuotes);
      await AsyncStorage.setItem(SEED_KEY, 'true');
      isLoaded.current = true;
    };

    init();
  }, []);

  // 변경될 때마다 저장 (빈 배열도 저장되어야 전체 삭제가 유지됨)
  useEffect(() => {
    if (!isLoaded.current) return;
    saveQuotes(quotes);
  }, [quotes]);

  // 전체 태그 목록 추출
  const allTags = useMemo(() => {
    const tagSet = new Set();
    quotes.forEach((quote) => {
      if (quote.tags && Array.isArray(quote.tags)) {
        quote.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [quotes]);

  // 필터링 + 정렬
  const filtered = useMemo(() => {
    let list = quotes;
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((item) => {
        const text = item.text?.toLowerCase() ?? '';
        const src = item.source?.toLowerCase() ?? '';
        const tags = (item.tags ?? []).join(',').toLowerCase();
        return text.includes(q) || src.includes(q) || tags.includes(q);
      });
    }

    if (onlyFav) {
      list = list.filter((item) => item.favorite);
    }

    if (selectedTags.length > 0) {
      list = list.filter((item) => {
        if (!item.tags || item.tags.length === 0) return false;
        return selectedTags.some((tag) => item.tags.includes(tag));
      });
    }

    list = [...list].sort((a, b) => {
      const au = Number(a.updatedAt) || 0;
      const bu = Number(b.updatedAt) || 0;
      return sortMode === SORT_MODES.NEWEST ? bu - au : au - bu;
    });

    return list;
  }, [quotes, query, onlyFav, selectedTags, sortMode]);

  const addQuote = (quoteData) => {
    const newQuote = {
      id: uuid(),
      text: quoteData.text,
      source: quoteData.source || undefined,
      tags: quoteData.tags || [],
      favorite: false,
      bgColor: quoteData.bgColor,
      textColor: quoteData.textColor,
      createdAt: now(),
      updatedAt: now(),
    };
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const updateQuote = (id, quoteData) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              text: quoteData.text,
              source: quoteData.source,
              tags: quoteData.tags,
              bgColor: quoteData.bgColor,
              textColor: quoteData.textColor,
              updatedAt: now(),
            }
          : q
      )
    );
  };

  const deleteQuote = (id) => {
    Alert.alert('삭제', '이 항목을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setQuotes((prev) => prev.filter((q) => q.id !== id)),
      },
    ]);
  };

  const deleteMultiple = (ids) => {
    Alert.alert('선택 삭제', `${ids.size}개 항목을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setQuotes((prev) => prev.filter((q) => !ids.has(q.id))),
      },
    ]);
  };

  const clearAll = () => {
    setQuotes([]);
  };

  const toggleFavorite = (id) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, favorite: !q.favorite, updatedAt: now() } : q
      )
    );
  };

  const shareQuote = async (item) => {
    const text = [
      item.text,
      item.source ? `- ${item.source}` : '',
      formatDate(item.updatedAt),
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await Share.share({ message: text });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const toggleSort = () => {
    setSortMode((prev) =>
      prev === SORT_MODES.NEWEST ? SORT_MODES.OLDEST : SORT_MODES.NEWEST
    );
  };

  const toggleTagFilter = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const clearTagFilter = () => {
    setSelectedTags([]);
  };

  return {
    quotes,
    filtered,
    query,
    setQuery,
    onlyFav,
    setOnlyFav,
    sortMode,
    toggleSort,
    addQuote,
    updateQuote,
    deleteQuote,
    deleteMultiple,
    clearAll,
    toggleFavorite,
    shareQuote,
    allTags,
    selectedTags,
    toggleTagFilter,
    clearTagFilter,
  };
};
