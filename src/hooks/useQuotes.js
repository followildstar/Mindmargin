// src/hooks/useQuotes.js
import { useState, useEffect, useMemo } from 'react';
import { Alert, Share } from 'react-native';
import { loadQuotes, saveQuotes } from '../utils/storage';
import { uuid, now, formatDate } from '../utils/formatters';
import { SORT_MODES } from '../utils/constants';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [query, setQuery] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);
  const [sortMode, setSortMode] = useState(SORT_MODES.NEWEST);
  const [selectedTags, setSelectedTags] = useState([]); // 추가

  // Load quotes on mount
  useEffect(() => {
    loadQuotes().then(setQuotes);
  }, []);

  // Save quotes whenever they change
  useEffect(() => {
    if (quotes.length > 0) {
      saveQuotes(quotes);
    }
  }, [quotes]);

  // 전체 태그 목록 추출 (추가)
  const allTags = useMemo(() => {
    const tagSet = new Set();
    quotes.forEach((quote) => {
      if (quote.tags && Array.isArray(quote.tags)) {
        quote.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [quotes]);

  // Filter and sort quotes
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

    // 태그 필터 추가
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
  }, [quotes, query, onlyFav, selectedTags, sortMode]); // selectedTags 의존성 추가

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
    Alert.alert('전체 비우기', '모든 항목을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setQuotes([]) },
    ]);
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

  // 태그 필터 관련 함수 추가
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
    // 태그 필터 추가
    allTags,
    selectedTags,
    toggleTagFilter,
    clearTagFilter,
  };
};