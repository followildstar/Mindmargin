// src/utils/storage.js
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


// 백업 함수 추가
export const backupQuotes = async (quotes) => {
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
    console.error('Backup failed:', error);
    return { success: false, error: error.message };
  }
};

// 복원 함수 추가
export const restoreQuotes = async () => {
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

    // 백업 데이터 검증
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
    console.error('Restore failed:', error);
    return { success: false, error: error.message };
  }
};