// src/screens/TagFilterModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const TagFilterModal = ({ 
  visible, 
  allTags, 
  selectedTags, 
  onToggleTag, 
  onClose 
}) => {
  const canSelectMore = selectedTags.length < 3;

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
              <Text style={styles.title}>태그 선택</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity onPress={onClose} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                  <Text style={styles.iconText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.subtitle}>
              최대 3개까지 선택({selectedTags.length}/3)
            </Text>

            <ScrollView 
              style={styles.body}
              contentContainerStyle={styles.tagList}
            >
              {allTags.length === 0 ? (
                <Text style={styles.emptyText}>사용 가능한 태그가 없습니다</Text>
              ) : (
                allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isDisabled = !isSelected && !canSelectMore;

                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => onToggleTag(tag)}
                      disabled={isDisabled}
                      style={[
                        styles.tagButton,
                        isSelected && styles.tagButtonSelected,
                        isDisabled && styles.tagButtonDisabled,
                      ]}
                    >
                      <Text 
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextSelected,
                          isDisabled && styles.tagTextDisabled,
                        ]}
                      >
                        #{tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
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
    color: '#000',
    letterSpacing: 1,
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000000',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 13,
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#000',
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 12,
    color: '#868E96',
    fontWeight: '500',
  },
  body: {
    flex: 1,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap:7,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  tagButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tagButtonDisabled: {
    opacity: 0.3,
  },
  tagText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '400',
  },
  tagTextSelected: {
    color: '#FFF',
  },
  tagTextDisabled: {
    color: '#ADB5BD',
  },
  emptyText: {
    fontSize: 14,
    color: '#ADB5BD',
    textAlign: 'center',
    marginTop: 40,
  },
});