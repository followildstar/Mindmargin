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
// iOS Safari는 <a download>를 무시하고 새 탭에서 여는 경우가 많아서
// data URL 방식으로 폴백 처리
const backupQuotesWeb = async (quotes) => {
  try {
    if (typeof document === 'undefined') {
      return { success: false, error: 'document 객체를 찾을 수 없습니다 (웹 환경 아님).' };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `quotes_backup_${timestamp}.json`;

    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      count: quotes.length,
      data: quotes,
    };

    const jsonString = JSON.stringify(backupData, null, 2);

    // Safari는 Blob URL보다 data: URL을 더 안정적으로 처리함
    const dataUrl =
      'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString);

    const link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, fileName };
  } catch (error) {
    console.error('Web backup failed:', error);
    return { success: false, error: String(error && error.message ? error.message : error) };
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
// input을 실제 DOM에 붙여야 iOS Safari에서 안정적으로 동작함
const restoreQuotesWeb = async () => {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve({ success: false, error: 'document 객체를 찾을 수 없습니다 (웹 환경 아님).' });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.style.position = 'fixed';
    input.style.top = '-1000px';
    input.style.left = '-1000px';

    let resolved = false;

    const cleanup = () => {
      window.removeEventListener('focus', onFocus);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    const onFocus = () => {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve({ success: false, canceled: true });
        }
      }, 500);
    };

    input.onchange = async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        resolved = true;
        cleanup();
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
        cleanup();
        resolve({
          success: true,
          count: restoredQuotes.length,
          timestamp: backupData.timestamp,
        });
      } catch (error) {
        console.error('Web restore failed:', error);
        resolved = true;
        cleanup();
        resolve({ success: false, error: String(error && error.message ? error.message : error) });
      }
    };

    document.body.appendChild(input);
    window.addEventListener('focus', onFocus, { once: true });
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
