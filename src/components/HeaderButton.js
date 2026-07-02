// src/components/HeaderButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const HeaderButton = ({
  label,
  onPress,
  disabled,
  variant = 'default',
  textStyle,
  style,
  children, 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label} // 시각적으로 안 보여도 스크린리더용으로 읽어줌
      style={[
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        disabled && styles.buttonDisabled,
        style, // 외부 스타일 오버라이드 가능
      ]}
    >
      {/* children(이미지)이 있으면 children을, 아니면 label을 표시 */}
      {children ? (
        children
      ) : (
        <Text style={[styles.text, variant === 'primary' && styles.textPrimary, textStyle]}>
         {label}
       </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  buttonPrimary: {
    backgroundColor: '#222',
    borderRadius: 100,
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 60,
    height: 60,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    // opacity: 0.8,
  },
  text: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  textPrimary: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
  },
});
