// src/screens/QuotePageScreen.js
import React, { useRef, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../utils/formatters';

export const QuotePageScreen = ({
  quotes,
  currentIndex,
  pageHeight,
  selectionMode,
  selected,
  onSetCurrentIndex,
  onSetPageHeight,
  onCardPress,
  onCardLongPress,
  onEdit,
  onShare,
  onToggleFavorite,
  onToggleSelect,
}) => {
  const pageListRef = useRef(null);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: pageHeight,
      offset: pageHeight * index,
      index,
    }),
    [pageHeight]
  );

  const renderPageItem = ({ item }) => {
    return (
      <View style={{ flex: 1, backgroundColor: item.bgColor }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
          <View
            style={[
              styles.pageWrap,
              {
                width: Dimensions.get('window').width,
                height: pageHeight,
              },
            ]}
          >
            <View style={styles.pageInner}>
              {selectionMode && (
                <Pressable
                  onPress={() => onToggleSelect(item.id)}
                  style={styles.selectRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selected.has(item.id) && styles.checkboxOn,
                    ]}
                  >
                    {selected.has(item.id) && (
                      <Text style={styles.checkboxMark}>✓</Text>
                    )}
                  </View>
                </Pressable>
              )}



              <ScrollView
                style={styles.contentScroll}
                contentContainerStyle={styles.contentScrollInner}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                scrollEventThrottle={16}
              >
                <Pressable
                  onPress={() => onCardPress(item.id)}
                  onLongPress={() => onCardLongPress(item.id)}
                >
                  <Text
                    style={[styles.pageText, { color: item.textColor || '#000' }]}
                  >
                    {item.text}
                  </Text>
                </Pressable>

                <View style={styles.pageFooter}>
                  <View style={styles.flexRow}>
                    {!!item.source && (
                      <Text style={[styles.pageSource, { color: item.textColor || '#000' },]}>
                        {item.source}
                      </Text>
                    )}

                    {!!(item.tags && item.tags.length) && (
                      <Text style={[styles.pageTags, { color: item.textColor || '#000' }]}>#{item.tags.join(' #')}</Text>
                    )}
                  </View>

                  {/* 수정된 날짜로 기록  */}
                  {/* <Text style={[styles.cardMeta, { color: item.textColor || '#000' }]}>{formatDate(item.updatedAt)}</Text> */}

                  {/* 작성된 날짜로 기록 */}
                  <Text style={[styles.cardMeta, { color: item.textColor || '#000' }]}>
                    작성일 {formatDate(item.createdAt)}
                  </Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                      <Image
                        style={styles.cardAction}
                        source={require('../../assets/edit.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onShare(item)}>
                      <Image
                        style={styles.cardAction}
                        source={require('../../assets/share.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
                      <Text style={[styles.fav, item.favorite && styles.favOn]}>
                        {item.favorite ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        if (height > 0) onSetPageHeight(height);
      }}
    >
      {quotes.length > 0 && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1}/{quotes.length}
          </Text>
        </View>
      )}

      <FlatList
        ref={pageListRef}
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={renderPageItem}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x /
            e.nativeEvent.layoutMeasurement.width
          );
          if (
            index !== currentIndex &&
            index >= 0 &&
            index < quotes.length
          ) {
            onSetCurrentIndex(index);
          }
        }}
        ListEmptyComponent={
          <View
            style={[
              styles.pageEmptyWrap,
              {
                width: Dimensions.get('window').width,
                height: pageHeight,
              },
            ]}
          >
            <Text style={styles.emptyText}>
              What's yours?
            </Text>
          </View>
        }
        getItemLayout={getItemLayout}
        initialScrollIndex={
          quotes.length > 0
            ? Math.min(currentIndex, quotes.length - 1)
            : undefined
        }
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            if (pageListRef.current && info.index < quotes.length) {
              pageListRef.current.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }
          }, 100);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    // backgroundColor: '#FFFFFF',
  },
  pageInner: {
    flex: 1,
  },
  pageSource: {
    fontSize: 14,
    letterSpacing: 0.5,
    marginRight: 5,
    opacity: 0.8,
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollInner: {
    flexGrow: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop:-90,
    paddingHorizontal:20,
  },
  pageText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '300',
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  pageTags: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.5,
  },
  pageFooter: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: "absolute",
    bottom: 10,
  },
  cardMeta: {
    marginBottom: 20,
    opacity: 0.5,
    fontSize: 12,
    fontWeight: '400',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  cardAction: {
    width: 18,
    height: 18,
    opacity: 0.8,
  },
  fav: {
    fontSize: 16,
    color: '#555',
  },
  favOn: {
    color: '#111',
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  pageEmptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#ccc',
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: -80,
  },
  pageIndicator: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,

  },
  pageIndicatorText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 2,
  },

  // add

  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});