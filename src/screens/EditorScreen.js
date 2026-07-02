// src/screens/EditorScreen.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ColorPicker } from '../components/ColorPicker';
import { COLOR_PRESETS, DEFAULT_QUOTE } from '../utils/constants';
import { useKeyboard } from '../hooks/useKeyboard';

export const EditorScreen = ({ visible, quote, onSave, onClose, allTags = [] }) => {
  const keyboardHeight = useKeyboard();
  const [showAllTags, setShowAllTags] = useState(false); 
  const [draft, setDraft] = useState(() => ({
    text: quote?.text || '',
    source: quote?.source || '',
    tagsLine: quote?.tags ? quote.tags.join(', ') : '',
    selectedTags: quote?.tags || [], 
    bgColor: quote?.bgColor || DEFAULT_QUOTE.bgColor,
    textColor: quote?.textColor || DEFAULT_QUOTE.textColor,
  }));
  const displayedTags = showAllTags ? allTags : allTags.slice(0, 7);

  React.useEffect(() => {
    if (quote) {
      setDraft({
        text: quote.text || '',
        source: quote.source || '',
        tagsLine: quote.tags ? quote.tags.join(', ') : '',
        selectedTags: quote.tags || [],
        bgColor: quote.bgColor || DEFAULT_QUOTE.bgColor,
        textColor: quote.textColor || DEFAULT_QUOTE.textColor,
      });
    } else {
      setDraft({
        text: '',
        source: '',
        tagsLine: '',
        selectedTags: [],
        bgColor: DEFAULT_QUOTE.bgColor,
        textColor: DEFAULT_QUOTE.textColor,
      });
    }
  }, [quote, visible]);

  const handleSave = () => {
    const text = draft.text.trim();
    if (!text) {
      Alert.alert('내용 없음', '문장을 입력해 주세요.');
      return;
    }

    const source = draft.source.trim();
    
    // tagsLine과 selectedTags 합치기
    const manualTags = draft.tagsLine
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    const allTagsSet = new Set([...draft.selectedTags, ...manualTags]);
    const tags = Array.from(allTagsSet);

    onSave({
      text,
      source: source || undefined,
      tags,
      bgColor: draft.bgColor,
      textColor: draft.textColor,
    });
  };

  // 태그 토글 함수
  const toggleTag = (tag) => {
    setDraft((d) => {
      const isSelected = d.selectedTags.includes(tag);
      if (isSelected) {
        return {
          ...d,
          selectedTags: d.selectedTags.filter((t) => t !== tag),
        };
      } else {
        return {
          ...d,
          selectedTags: [...d.selectedTags, tag],
        };
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {quote ? '편집' : '추가'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                  <Text style={styles.iconText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={styles.saveText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={[
                styles.bodyContent,
                { paddingBottom: 16 + keyboardHeight },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              <Text style={styles.label}>문장</Text>
              <TextInput
                style={[styles.input, { minHeight: 120 }]}
                multiline
                value={draft.text}
                onChangeText={(t) => setDraft((d) => ({ ...d, text: t }))}
                autoFocus={!quote}
                placeholderTextColor="#ADB5BD"
              />

              <Text style={styles.label}>출처</Text>
              <TextInput
                style={styles.input}
                value={draft.source}
                onChangeText={(t) => setDraft((d) => ({ ...d, source: t }))}
                placeholder="책/영화/사람 등"
                placeholderTextColor="#ADB5BD"
              />

              <Text style={styles.label}>태그 (쉼표로 구분)</Text>
              <TextInput
                style={styles.input}
                value={draft.tagsLine}
                onChangeText={(t) => setDraft((d) => ({ ...d, tagsLine: t }))}
                placeholder="새 태그 입력"
                placeholderTextColor="#ADB5BD"
              />

              {/* 기존 태그 선택 영역 수정 */}
              {allTags.length > 0 && (
                <View style={styles.existingTagsSection}>
                  <Text style={styles.existingTagsLabel}>기존 태그 선택</Text>
                  <View style={styles.existingTagsList}>
                    {displayedTags.map((tag) => {
                      const isSelected = draft.selectedTags.includes(tag);
                      return (
                        <TouchableOpacity
                          key={tag}
                          onPress={() => toggleTag(tag)}
                          style={[
                            styles.existingTagButton,
                            isSelected && styles.existingTagButtonSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.existingTagText,
                              isSelected && styles.existingTagTextSelected,
                            ]}
                          >
                            #{tag}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    
                    {/* 더보기 버튼 추가 */}
                    {allTags.length > 10 && (
                      <TouchableOpacity
                        onPress={() => setShowAllTags(!showAllTags)}
                        style={styles.moreButton}
                      >
                        <Text style={styles.moreButtonText}>
                          {showAllTags ? '접기' : `+ more`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              <ColorPicker
                label="배경 색상"
                colors={COLOR_PRESETS.bg}
                selectedColor={draft.bgColor}
                onSelect={(color) => setDraft((d) => ({ ...d, bgColor: color }))}
              />

              <ColorPicker
                label="글자 색상"
                colors={COLOR_PRESETS.text}
                selectedColor={draft.textColor}
                onSelect={(color) => setDraft((d) => ({ ...d, textColor: color }))}
              />

              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: draft.bgColor, marginTop: 16 },
                ]}
              >
                <Text 
                  style={[styles.previewText, { color: draft.textColor }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {draft.text.trim() || '미리보기'}
                </Text>
              </View>
            </ScrollView>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000000',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 12,
    color: '#868E96',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#000000',
    fontSize: 15,
    fontWeight: '300',
    height: 45,
  },
  // 기존 태그 스타일 추가
  existingTagsSection: {
    marginTop: 16,
  },
  existingTagsLabel: {
    fontSize: 12,
    color: '#868E96',
    marginBottom: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  existingTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  existingTagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  existingTagButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  existingTagText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '400',
  },
  existingTagTextSelected: {
    color: '#FFF',
  },
  previewBox: {
    padding: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 80,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
    },
     moreButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  moreButtonText: {
    fontSize: 13,
    color: '#a7a7a7ff',
    fontWeight: '500',
  },
});