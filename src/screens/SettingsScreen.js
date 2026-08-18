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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SettingsScreen = ({ 
  visible, 
  onClose, 
  onBackup, 
  onRestore, 
  onClearAll,
  totalCount 
}) => {

  const isWeb = Platform.OS === 'web';

  // 웹에서는 확인창 없이 즉시 실행 (사용자 클릭 제스처가 끊기면
  // 파일 다운로드/선택창이 브라우저에서 막힐 수 있기 때문)
  const handleBackup = () => {
    if (isWeb) {
      onBackup();
      return;
    }
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
    if (isWeb) {
      onRestore();
      return;
    }
    Alert.alert(
      '데이터 복원',
      '파일에서 데이터를 불러옵니다.\n현재 데이터는 덮어씌워집니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '복원', onPress: onRestore },
      ]
    );
  };

  // 삭제는 AsyncStorage만 사용하므로 제스처 체인과 무관 -> 확인창 유지
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
              activeOpacity={0.6}
            >
              <View style={styles.menuIcon}>
                <Image
                  style={styles.menuIconImg}
                  source={require('../../assets/backup.png')}
                />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuTitle}>데이터 백업</Text>
                <Text style={styles.menuDesc}>JSON 파일로 내보내기</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleRestore}
              activeOpacity={0.6}
            >
              <View style={styles.menuIcon}>
                <Image
                  style={styles.menuIconImg}
                  source={require('../../assets/restore_2.png')}
                />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={styles.menuTitle}>데이터 복원</Text>
                <Text style={styles.menuDesc}>파일에서 가져오기</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleClearAll}
              activeOpacity={0.6}
            >
              <View style={styles.menuIcon}>
                <Image
                  style={styles.menuIconImg}
                  source={require('../../assets/delete.png')}
                />
              </View>
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
    width: 22,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 20,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 5,
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
