// src/components/QuoteCard.js
import React from 'react';
import { View, Text,  Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { formatDate } from '../utils/formatters';

export const QuoteCard = ({
  item,
  index,
  selectionMode,
  isSelected,
  onPress,
  onLongPress,
  onEdit,
  onShare,
  onToggleFavorite,
  onDelete,
  onToggleSelect,
}) => {
  const RightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={styles.swipeDelete} onPress={onDelete}>
        <Text style={styles.swipeDeleteText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const CardContent = (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: item.bgColor || '#FFFFFF' },
        pressed && { opacity: 0.95 },
      ]}
    >
      {selectionMode && (
        <View style={styles.selectRow}>
          <Pressable
            onPress={onToggleSelect}
            style={[styles.checkbox, isSelected && styles.checkboxOn]}
          >
            {isSelected && <Text style={styles.checkboxMark}>✓</Text>}
          </Pressable>
        </View>
      )}
      
      <Text style={[styles.cardText, { color: item.textColor || '#000' }]}
        numberOfLines={5}
        ellipsizeMode="tail"
      >
        {item.text}
      </Text>
      {/* <View style={styles.flexRow}>
        {!!item.source && (
          <Text style={[styles.cardSource, { color: item.textColor || '#000' }]}
          numberOfLines={4} ellipsizeMode="middle">
            {item.source}
          </Text>
        )}
        {!!(item.tags && item.tags.length) && (
          <Text style={[styles.cardTags, { color: item.textColor || '#000' }]}>#{item.tags.join(' #')}</Text>
        )}
      </View> */}
      <View style={styles.rowBetween}>
        {/* 수정된 날짜로 기록  */}
        {/* <Text style={[styles.cardMeta, { color: item.textColor || '#000' }]}>{formatDate(item.updatedAt)}</Text> */}

        {/* 작성된 날짜로 기록 */}
        {/* <Text style={[styles.cardMeta, { color: item.textColor || '#000' }]}>
          작성일 {formatDate(item.createdAt)}
        </Text> */}
         {!!item.source && (
          <Text style={[styles.cardSource, { color: item.textColor || '#000' }]}
          numberOfLines={4} ellipsizeMode="middle">
            {item.source}
          </Text>
        )}
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={onEdit}>
             <Image style={styles.cardAction} source={require("../../assets/edit.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <Image style={styles.cardAction} source={require("../../assets/share.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleFavorite}>
            <Text style={[styles.fav, item.favorite && styles.favOn]}>
              {item.favorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );

    CardContent
  ) : (
    <Swipeable renderRightActions={RightActions} overshootRight={false}>
      {CardContent}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f5f5',
        width:"auto%",
    
  },
  cardSource: {
    fontSize: 13,
    letterSpacing: 0.5,
    marginRight:5,
    opacity:0.8,

  },
  cardText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 10,
    fontWeight: '300',
    letterSpacing:-0.5,
  },
  cardTags: {
    fontSize: 12,
    fontWeight: '400',
    opacity:0.5,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMeta: {
    opacity:0.5,
    fontSize: 11,
    fontWeight: '400',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  cardAction: {
   width:18,
   height:18,
   opacity:0.8
  },
  fav: {
    fontSize: 16,
    color: '#555',
    opacity:0.8,
  },
  favOn: {
    color: '#111',
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#CED4DA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxOn: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  swipeActions: {
    justifyContent: 'center',
  },
  swipeDelete: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 2,
    marginVertical: 6,
    marginRight: 25,
    alignSelf: 'flex-end',
    height: 60,
  },
  swipeDeleteText: {
    color: '#ee8888ff',
    fontWeight: '500',
    fontSize: 16,
  },
});
