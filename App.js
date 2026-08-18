// App.js
import 'react-native-gesture-handler';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, Dimensions, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HeaderButton } from './src/components/HeaderButton';
import { SearchBar} from './src/components/SearchBar';
import { SettingsScreen } from './src/screens/SettingsScreen'; 
import { TagFilterModal } from './src/screens/TagFilterModal';
import { QuoteListScreen } from './src/screens/QuoteListScreen';
import { QuotePageScreen } from './src/screens/QuotePageScreen';
import { EditorScreen } from './src/screens/EditorScreen';
import { backupQuotes, restoreQuotes, loadQuotes, deleteAllQuotes } from './src/utils/storage';

import { useQuotes } from './src/hooks/useQuotes';
import { useSelection } from './src/hooks/useSelection';
import { SORT_MODES, VIEW_MODES } from './src/utils/constants';
import { QuoteDetailModal } from './src/screens/QuoteDetailModal';
import IntroScreen from './src/screens/IntroScreen';

import { useFonts } from 'expo-font';

export default function App() {

  const [loaded] = useFonts({
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
  });

  const {
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
    allTags, // 추가
    selectedTags, // 추가
    toggleTagFilter, // 추가
    clearTagFilter, // 추가
  } = useQuotes();

  const {
    selectionMode,
    selected,
    toggleSelect,
    exitSelection,
    enterSelection,
  } = useSelection();

  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [pageHeight, setPageHeight] = useState(Dimensions.get('window').height);

  const [editorVisible, setEditorVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  
  const [tagModalVisible, setTagModalVisible] = useState(false); // 추가

  const [settingsVisible, setSettingsVisible] = useState(false); // 추가
  const [detailVisible, setDetailVisible] = useState(false);
const [selectedQuote, setSelectedQuote] = useState(null);

  const pageListRef = useRef(null);
  const viewModeRef = useRef(viewMode);


  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    if (filtered.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (currentIndex > filtered.length - 1) {
      setCurrentIndex(filtered.length - 1);
    }
  }, [filtered.length, currentIndex]);

  const openCreate = () => {
    setEditingQuote(null);
    setEditorVisible(true);
  };

  const openEdit = (item) => {
    setEditingQuote(item);
    setEditorVisible(true);
  };

  const handleEditorSave = (quoteData) => {
    if (editingQuote) {
      updateQuote(editingQuote.id, quoteData);
    } else {
      addQuote(quoteData);
      setCurrentIndex(0);
    }
    setEditorVisible(false);
    setEditingQuote(null);
  };

  const handleEditorClose = () => {
    setEditorVisible(false);
    setEditingQuote(null);
  };

  const handleCardPress = (id) => {
    if (selectionMode) {
      toggleSelect(id);
    }
  };

  const handleCardLongPress = (id) => {
    if (selectionMode) {
      toggleSelect(id);
      return;
    }

    const item = filtered.find((q) => q.id === id);
    if (!item) return;

    Alert.alert('수정', '이 항목을 수정하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '수정', onPress: () => openEdit(item) },
    ]);
  };

  const handleDeleteSelected = () => {
    if (selected.size === 0) return;
    deleteMultiple(selected);
    exitSelection();
    setCurrentIndex(0);
  };

  // 리스트에서 카드 클릭 핸들러
const handleListCardPress = (item, index) => {
  if (selectionMode) {
    toggleSelect(item.id);
    return;
  }
  
  // 모달 팝업
  setSelectedQuote(item);
  setDetailVisible(true);
};

// 모달에서 수정
const handleDetailEdit = () => {
  setDetailVisible(false);
  if (selectedQuote) {
    openEdit(selectedQuote);
  }
};

// 모달에서 공유
const handleDetailShare = () => {
  if (selectedQuote) {
    shareQuote(selectedQuote);
  }
};

// 모달에서 즐겨찾기
const handleDetailToggleFavorite = () => {
  if (selectedQuote) {
    toggleFavorite(selectedQuote.id);
    const updated = filtered.find(q => q.id === selectedQuote.id);
    if (updated) {
      setSelectedQuote(updated);
    }
  }
};
// 인트로 상태값 + 타이머 추가
const [showIntro, setShowIntro] = useState(true);

useEffect(() => {
  const t = setTimeout(() => setShowIntro(false), 1600); // 1.6초
  return () => clearTimeout(t);
}, []);

 QuoteListScreen 

  const switchViewMode = (targetIndex = null) => {
  const nextMode = viewMode === VIEW_MODES.LIST ? VIEW_MODES.PAGE : VIEW_MODES.LIST;
  
  if (nextMode === VIEW_MODES.PAGE && filtered.length > 0) {
    const indexToScroll = targetIndex !== null ? targetIndex : currentIndex;
    
    // 먼저 currentIndex 업데이트
    if (targetIndex !== null && targetIndex !== currentIndex) {
      setCurrentIndex(indexToScroll);
    }
    
    // viewMode 변경
    setViewMode(nextMode);
    
    // 스크롤은 viewMode 변경 후 실행
    setTimeout(() => {
      if (pageListRef.current && indexToScroll < filtered.length) {
        try {
          pageListRef.current.scrollToIndex({
            index: indexToScroll,
            animated: false,
          });
        } catch (e) {
          console.log('ScrollToIndex failed:', e);
        }
      }
    }, 150); // 100 -> 150으로 증가
  } else {
    setViewMode(nextMode);
  }
};

const onViewableItemsChanged = useRef(({ viewableItems }) => {
  if (
    viewableItems &&
    viewableItems.length > 0 &&
    viewModeRef.current === VIEW_MODES.LIST // PAGE가 아닌 LIST일 때만
  ) {
    const idx = viewableItems[0].index ?? 0;
    if (typeof idx === 'number') {
      setCurrentIndex(idx);
    }
  }
}).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;


 // 백업 함수 추가
  const handleBackup = async () => {
    const result = await backupQuotes(quotes);
    if (result.success) {
      Alert.alert('백업 완료', `${result.fileName} 파일이 생성되었습니다.`);
    } else {
      Alert.alert('백업 실패', result.error || '백업 중 오류가 발생했습니다.');
    }
  };

  // 복원 함수 추가
  const handleRestore = async () => {
    const result = await restoreQuotes();
    if (result.success) {
      const restored = await loadQuotes();
      setQuotes(restored);
      setSettingsVisible(false);
      Alert.alert(
        '복원 완료',
        `${result.count}개의 문장이 복원되었습니다.`
      );
    } else if (!result.canceled) {
      Alert.alert('복원 실패', result.error || '복원 중 오류가 발생했습니다.');
    }
  };
// 여기에 추가!
const toggleViewMode = () => {
  const nextMode = viewMode === VIEW_MODES.LIST ? VIEW_MODES.PAGE : VIEW_MODES.LIST;
  
  if (nextMode === VIEW_MODES.PAGE && filtered.length > 0) {
    // 무조건 첫 번째 항목으로 이동
    setCurrentIndex(0);
    setViewMode(nextMode);
    
    setTimeout(() => {
      if (pageListRef.current) {
        try {
          pageListRef.current.scrollToIndex({
            index: 0,
            animated: false,
          });
        } catch (e) {
          console.log('ScrollToIndex failed:', e);
        }
      }
    }, 100);
  } else {
    setViewMode(nextMode);
  }
};
  // 전체 삭제 함수 수정
const handleClearAll = async () => {
  const result = await deleteAllQuotes();  // ← 추가!
  if (result.success) {
    clearAll();  // 그다음 메모리 초기화
    setSettingsVisible(false);
    Alert.alert('완료', '모든 데이터가 삭제되었습니다.');
  } else {
    Alert.alert('실패', result.error || '삭제 중 오류가 발생했습니다.');
  }
};

  if (showIntro) return <IntroScreen />;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {viewMode === VIEW_MODES.LIST && (
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <SearchBar
                  expanded={searchExpanded}
                  query={query}
                  onQueryChange={setQuery}
                  onExpand={() => setSearchExpanded(true)}
                  onCollapse={() => setSearchExpanded(false)}
                />
                 {/* 설정 버튼 추가 */}
                <HeaderButton 
                    onPress={() => setSettingsVisible(true)}
                    style={{ marginTop: 15 }}  // 여기에 직접
                  >
                  <Text style={styles.settingsBtnText}>⋮</Text>
                </HeaderButton>
              </View>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { fontFamily: 'Montserrat-Bold' }]}>
                  <Text style={{ opacity: 0.3 }}>Exploring Minds,{"\n"}Inspiring </Text>
                  Sentences.{"\n"}
                  {/* What's yours? */}
                </Text>
              </View>

              <View style={styles.headerBtns}>
                {!selectionMode ? (
                  <>
                    <View style={styles.buttonRow}>
                      <View style={styles.buttonwrap}>
                        <HeaderButton onPress={() => switchViewMode()}>
                          {viewMode === VIEW_MODES.LIST ? (
                            <Image
                              style={styles.pageIconImg}
                              source={require('./assets/view_page.png')}
                            />
                          ) : (
                            <Image
                              style={styles.listIconImg}
                              source={require('./assets/view_list.png')}
                            />
                          )}
                        </HeaderButton>
                        <HeaderButton
                          label={onlyFav ? '★' : '☆'}
                          onPress={() => setOnlyFav((v) => !v)}
                          textStyle={onlyFav ? styles.starOn : styles.starOff}
                        />
                        {/* 태그 버튼 또는 선택된 태그 표시 */}
                        {selectedTags.length > 0 ? (
                        <View style={styles.tagFilterActive}>
                          <Text style={styles.tagFilterText} numberOfLines={1}>
                            {selectedTags.map(tag => tag.length > 4 ? `${tag.slice(0, 4)}..` : tag).join(', ')}
                          </Text>
                          <HeaderButton 
                            label="✕" 
                            onPress={clearTagFilter}
                            textStyle={styles.tagClearBtn}
                          />
                        </View>
                      ) : (
                        <HeaderButton onPress={() => setTagModalVisible(true)}>
                          <Text style={styles.tagBtnText}>#</Text>
                        </HeaderButton>
                      )}
                        
                      </View>
                      <View style={styles.buttonwrap}>
                       
                        <HeaderButton
                          label={sortMode === SORT_MODES.NEWEST ? 'Newest' : 'Oldest'}
                          onPress={toggleSort}
                        />
                        <HeaderButton onPress={enterSelection} label="선택">
                          <Image
                            style={styles.checklistIconImg}
                            source={require('./assets/checklist.png')}
                          />
                        </HeaderButton>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <HeaderButton
                      label={`삭제(${selected.size})`}
                      onPress={handleDeleteSelected}
                    />
                    <HeaderButton label="취소" onPress={exitSelection} />
                  </>
                )}
              </View>
            </View>
          )}

          {viewMode === VIEW_MODES.PAGE && (
            <View style={styles.headerMinimal}>
              <View style={styles.headerBtns}>
                {!selectionMode ? (
                  <>
                    <View style={styles.buttonRow}>
                      <View style={styles.buttonwrap}>
                        <HeaderButton onPress={() => switchViewMode()}>
                          <Image
                            style={styles.listIconImg}
                            source={require('./assets/view_list.png')}
                          />
                        </HeaderButton>
                        <HeaderButton
                          label={onlyFav ? '★' : '☆'}
                          onPress={() => setOnlyFav((v) => !v)}
                          textStyle={onlyFav ? styles.starOn : styles.starOff}
                        />
                        {/* 태그 버튼 또는 선택된 태그 표시 */}
                        {selectedTags.length > 0 ? (
                        <View style={styles.tagFilterActive}>
                          <Text style={styles.tagFilterText} numberOfLines={1}>
                            {selectedTags.map(tag => tag.length > 4 ? `${tag.slice(0, 4)}..` : tag).join(', ')}
                          </Text>
                          <HeaderButton 
                            label="✕" 
                            onPress={clearTagFilter}
                            textStyle={styles.tagClearBtn}
                          />
                        </View>
                      ) : (
                        <HeaderButton onPress={() => setTagModalVisible(true)}>
                          <Text style={styles.tagBtnText}>#</Text>
                        </HeaderButton>
                      )}
                        
                      </View>
                      <View style={styles.buttonwrap}>
                       
                        <HeaderButton
                          label={sortMode === SORT_MODES.NEWEST ? 'Newest' : 'Oldest'}
                          onPress={toggleSort}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <HeaderButton
                      label={`삭제(${selected.size})`}
                      onPress={handleDeleteSelected}
                    />
                    <HeaderButton label="취소" onPress={exitSelection} />
                  </>
                )}
              </View>
            </View>
          )}

          {viewMode === VIEW_MODES.LIST ? (
           <QuoteListScreen
              quotes={filtered}
              selectionMode={selectionMode}
              selected={selected}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              onCardPress={handleListCardPress}
              onCardLongPress={handleCardLongPress}
              onEdit={openEdit}
              onShare={shareQuote}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteQuote}
              onToggleSelect={toggleSelect}
              setCurrentIndex={setCurrentIndex}
              switchViewMode={switchViewMode}
            />
          ) : (
            <QuotePageScreen
                quotes={filtered}
                currentIndex={currentIndex}
                pageHeight={pageHeight}
                selectionMode={selectionMode}
                selected={selected}
                pageListRef={pageListRef}  // 이 줄 확인 (이미 있어야 함)
                onSetCurrentIndex={setCurrentIndex}
                onSetPageHeight={setPageHeight}
                onCardPress={(id) => {
                  if (selectionMode) {
                    handleCardPress(id);
                  } else {
                    // 페이지 뷰에서 누르면 리스트로 전환
                    const index = filtered.findIndex(q => q.id === id);
                    if (index !== -1) {
                      setCurrentIndex(index);
                      switchViewMode(index);
                    }
                  }
                }}
                onCardLongPress={handleCardLongPress}
                onEdit={openEdit}
                onShare={shareQuote}
                onToggleFavorite={toggleFavorite}
                onToggleSelect={toggleSelect}
              />
          )}

          <HeaderButton
            label="+"
            onPress={openCreate}
            variant="primary"
          />

          <EditorScreen
            visible={editorVisible}
            quote={editingQuote}
            allTags={allTags} 
            onSave={handleEditorSave}
            onClose={handleEditorClose}
          />

           {/* 설정 화면 추가 */}
          <SettingsScreen
            visible={settingsVisible}
            onClose={() => setSettingsVisible(false)}
            onBackup={handleBackup}
            onRestore={handleRestore}
            onClearAll={handleClearAll}
            totalCount={quotes.length}
          />

          {/* 태그 필터 모달 추가 */}
          <TagFilterModal
            visible={tagModalVisible}
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={toggleTagFilter}
            onClose={() => setTagModalVisible(false)}
          />

          
{/* 이 부분 추가! */}
<QuoteDetailModal
  visible={detailVisible}
  quote={selectedQuote}
  onClose={() => setDetailVisible(false)}
  onEdit={handleDetailEdit}
  onShare={handleDetailShare}
  onToggleFavorite={handleDetailToggleFavorite}
/>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  settingsBtnText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    fontWeight: '800',
    color: '#555'
  },
  starOn: {
    color: '#111',
    fontSize: 19,
  },
  starOff: {
    color: '#555',
    fontSize: 19,
  },
  pageIconImg: {
    width: 22,
    height: 22,
  },
  listIconImg: {
    width: 22,
    height: 22,
  },
  checklistIconImg: {
    width: 22,
    height: 22,
    tintColor: '#1D2B26',
  },
  // 태그 버튼 스타일 추가
  tagBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#555',
  },
  tagFilterActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingLeft: 10,
    paddingRight:5,
    height:30,
    borderRadius: 16,
    marginLeft: 3,
    marginTop:2,
    marginBotton:0,
  },
  tagFilterText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginRight: 3,
  },
  tagClearBtn: {
    fontSize: 12,
    color: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  headerMinimal: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontWeight: '700',
    color: '#111',
    lineHeight: 32,
    letterSpacing:-1.5,
    paddingLeft:5,
  },
  headerBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonwrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    height:30,
  },
});
