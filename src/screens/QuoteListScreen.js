// src/screens/QuoteListScreen.js
import React, { useRef } from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { QuoteCard } from '../components/QuoteCard';

export const QuoteListScreen = ({
  quotes,
  selectionMode,
  selected,
  onCardPress,
  onCardLongPress,
  onEdit,
  onShare,
  onToggleFavorite,
  onDelete,
  onToggleSelect,
}) => {
  const listRef = useRef(null);

  const renderItem = ({ item, index }) => (
    <QuoteCard
      item={item}
      index={index}
      selectionMode={selectionMode}
      isSelected={selected.has(item.id)}
      onPress={() => onCardPress(item, index)}
      onLongPress={() => onCardLongPress(item.id)}
      onEdit={() => onEdit(item)}
      onShare={() => onShare(item)}
      onToggleFavorite={() => onToggleFavorite(item.id)}
      onDelete={() => onDelete(item.id)}
      onToggleSelect={() => onToggleSelect(item.id)}
    />
  );

  return (
    <FlatList
      ref={listRef}
      data={quotes}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={
        quotes.length === 0 ? styles.listEmpty : { paddingBottom: 80 }
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>What's yours?</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listEmpty: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#ccc',
    fontSize: 25,
    fontWeight: '500',
    textAlign: "center",
    marginTop: -80,
  },
});