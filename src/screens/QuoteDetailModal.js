// src/screens/QuoteDetailModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '../utils/formatters';
import { BlurView } from 'expo-blur';

export const QuoteDetailModal = ({
  visible,
  quote,
  onClose,
  onEdit,
  onShare,
  onToggleFavorite,
}) => {
  if (!quote) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={[styles.dimBackground, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
        <Pressable style={styles.pressableArea} onPress={onClose}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
            <Pressable
              style={[styles.modalContent, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={[styles.closeButtonText, { color: quote.textColor }]}>✕</Text>
              </TouchableOpacity>

              {/* 컨텐츠 영역 - ScrollView 제거하고 View로 변경 */}
              <View style={styles.contentContainer}>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.quoteText, { color: quote.textColor }]}>
                    {quote.text}
                  </Text>

                  <View style={styles.metaSection}>
                    {!!quote.source && (
                      <Text style={[styles.source, { color: quote.textColor }]}>
                        {quote.source}
                      </Text>
                    )}

                    {!!(quote.tags && quote.tags.length) && (
                      <Text style={[styles.tags, { color: quote.textColor }]}>
                        #{quote.tags.join(' #')}
                      </Text>
                    )}

                    <Text style={[styles.date, { color: quote.textColor }]}>
                      작성일 {formatDate(quote.createdAt)}
                    </Text>
                  </View>
                </ScrollView>
              </View>

              {/* 하단 액션 버튼 */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/edit.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onShare}>
                  <Image
                    style={styles.actionIcon}
                    source={require('../../assets/share.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onToggleFavorite}>
                  <Text style={[styles.fav, quote.favorite && styles.favOn]}>
                    {quote.favorite ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dimBackground: {
    flex: 1,
    // backgroundColor 삭제 (BlurView가 처리)
  },
  pressableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 10,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 23,
    fontWeight: '300',
  },
  contentContainer: {
    flex: 1,  // 중요!
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    letterSpacing: -0.7
  },
  metaSection: {
    alignItems: 'center',
  },
  source: {
    fontSize: 15,
    letterSpacing: 0.5,
    marginBottom: 8,
    opacity: 0.8,
  },
  tags: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.6,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  actions: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  actionIcon: {
    width: 22,
    height: 22,
    opacity: 0.8,
  },
  fav: {
    fontSize: 20,
    color: '#555',
  },
  favOn: {
    color: '#111',
  },
});
