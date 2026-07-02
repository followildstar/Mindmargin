// src/screens/SettingsScreen.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const SettingsScreen = ({ 
  visible, 
  onClose, 
  onBackup, 
  onRestore, 
  onClearAll,
  totalCount 
}) => {
  
  const handleBackup = () => {
    Alert.alert(
      '데이터 백업',
      '현재 데이터를 파일로 저장하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '백업', onPress: onBackup },
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert(
      '데이터 복원',
      '파일에서 데이터를 불러옵니다.\n현재 데이터는 덮어씌워집니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '복원', onPress: onRestore },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      '전체 삭제',
      '모든 데이터가 삭제됩니다.\n정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: onClearAll 
        },
      ]
    );
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
              <Text style={styles.title}>설정</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.body}>
              {/* 데이터 관리 섹션 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>데이터 관리</Text>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleBackup}
                >
                  <Text style={styles.menuIcon}>
                    <Image
                        style={styles.menuIconImg}
                        source={require('../../assets/backup.png')}
                      />
                  </Text>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuTitle}>데이터 백업</Text>
                    <Text style={styles.menuDesc}>JSON 파일로 내보내기</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleRestore}
                >
                  <Text style={styles.menuIcon}>
                    <Image
                        style={styles.menuIconImg}
                        source={require('../../assets/restore_2.png')}
                      />
                  </Text>
                  <View style={styles.menuTextWrap}>
                    <Text style={styles.menuTitle}>데이터 복원</Text>
                    <Text style={styles.menuDesc}>파일에서 가져오기</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleClearAll}
                >
                  <Text style={styles.menuIcon}>
                    <Image
                        style={styles.menuIconImg}
                        source={require('../../assets/delete.png')}
                      />
                  </Text>
                  <View style={styles.menuTextWrap}>
                    <Text style={[styles.menuTitle, styles.menuDanger]}>전체 데이터 삭제</Text>
                    <Text style={styles.menuDesc}>모든 문장 삭제</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 앱 정보 섹션 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>앱 정보</Text>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>버전</Text>
                  <Text style={styles.infoValue}>1.5.0</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>저장된 문장</Text>
                  <Text style={styles.infoValue}>{totalCount}개</Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({

    menuIconImg: {
    width: 25,
    height: 25,
  },
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
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  closeText: {
    fontSize: 16,
    color: '#000',
  },
  body: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#868E96',
    letterSpacing: 0.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    marginBottom: 4,
  },
  menuDanger: {
    color: '#E03131',
  },
  menuDesc: {
    fontSize: 12,
    color: '#868E96',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal:20,
    backgroundColor:"#fafafa",
    borderRadius:10,
    marginBottom:5
  },
  infoLabel: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: '#868E96',
    fontWeight: '400',
  },
});