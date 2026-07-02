// src/hooks/useKeyboard.js
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const showSubscription = Keyboard.addListener(show, (e) => {
      const height = e?.endCoordinates?.height ?? 0;
      setKeyboardHeight(height);
    });
    
    const hideSubscription = Keyboard.addListener(hide, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};