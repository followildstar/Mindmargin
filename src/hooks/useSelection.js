// src/hooks/useSelection.js
import { useState, useCallback } from 'react';

export const useSelection = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const exitSelection = useCallback(() => {
    setSelectionMode(false);
    setSelected(new Set());
  }, []);

  const enterSelection = useCallback(() => {
    setSelectionMode(true);
  }, []);

  return {
    selectionMode,
    selected,
    toggleSelect,
    exitSelection,
    enterSelection,
  };
};