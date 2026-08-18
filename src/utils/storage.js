// src/utils/storage.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { STORAGE_KEY } from './constants';
import { tryParse, migrateArray } from './formatters';

export const loadQuotes = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const json = tryParse(raw);
    return json ? migrateArray(json) : [];
  } catch (error) {
    console.error('Failed to load quotes:', error);
    return [];
  }
};

export const saveQuotes = async (quotes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    return true;
  } catch (error) {
    console.error('Failed to save quotes:', error);
    return false;
  }
};

// ============================================
// 백업 (Backup)
// ============================================

// 웹 전용: Blob + <a download> 로 파일 다운로드
const backupQuotesWeb = async (quotes) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `quotes_backup_${timestamp}.json`;

    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      count: quotes.length,
      data: quotes,
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, fileName };
  } catch (error) {
    console.error('Web backup failed:', error);
    return { success: false, error: error.message };
  }
};

// 네이티브 전용: FileSystem + Sharing
const backupQuotesNative = async (quotes) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `quotes_backup_${timestamp}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      count: quotes.length,
      data: quotes,
    };
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(backupData, null, 2)
    );
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: '백업 파일 저장',
        UTI: 'public.json',
      });
    }
    return { success: true, fileName };
  } catch (error) {
    console.error('Native backup failed:', error);
    return { success: false, error: error.message };
  }
};

// 진입점: 플랫폼에 따라 자동 분기
export const backupQuotes = async (quotes) => {
  if (Platform.OS === 'web') {
    return backupQuotesWeb(quotes);
  }
  return backupQuotesNative(quotes);
};

// ============================================
// 복원 (Restore)
// ============================================

// 웹 전용: <input type="file"> 트리거해서 파일 읽기
const restoreQuotesWeb = async () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    // 파일 선택 없이 취소한 경우 감지용
    let resolved = false;

    input.onchange = async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        resolved = true;
        resolve({ success: false, canceled: true });
        return;
      }

      try {
        const text = await file.text();
        const backupData = JSON.parse(text);

        if (!backupData.data || !Array.isArray(backupData.data)) {
          throw new Error('잘못된 백업 파일 형식입니다.');
        }

        const restoredQuotes = migrateArray(backupData.data);
        await saveQuotes(restoredQuotes);

        resolved = true;
        resolve({
          success: true,
          count: restoredQuotes.length,
          timestamp: backupData.timestamp,
        });
      } catch (error) {
        console.error('Web restore failed:', error);
        resolved = true;
        resolve({ success: false, error: error.message });
      }
    };

    // 파일 선택창을 취소(다이얼로그만 닫음)했을 때는 change 이벤트가 안 뜨므로
    // window에 focus가 돌아오는 시점을 기준으로 취소 여부를 판단
    window.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve({ success: false, canceled: true });
          }
        }, 500);
      },
      { once: true }
    );

    input.click();
  });
};

// 네이티브 전용: DocumentPicker + FileSystem
const restoreQuotesNative = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });
    if (result.canceled) {
      return { success: false, canceled: true };
    }
    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const backupData = JSON.parse(fileContent);

    if (!backupData.data || !Array.isArray(backupData.data)) {
      throw new Error('잘못된 백업 파일 형식입니다.');
    }

    const restoredQuotes = migrateArray(backupData.data);
    await saveQuotes(restoredQuotes);
    return {
      success: true,
      count: restoredQuotes.length,
      timestamp: backupData.timestamp,
    };
  } catch (error) {
    console.error('Native restore failed:', error);
    return { success: false, error: error.message };
  }
};

// 진입점: 플랫폼에 따라 자동 분기
export const restoreQuotes = async () => {
  if (Platform.OS === 'web') {
    return restoreQuotesWeb();
  }
  return restoreQuotesNative();
};

// ============================================
// 전체 삭제 (Delete All)
// ============================================
// AsyncStorage 자체가 웹/네이티브 공통 API라 분기 불필요
export const deleteAllQuotes = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: error.message };
  }
};
