// src/components/ColorPicker.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ColorPicker = ({ colors, selectedColor, onSelect, label }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.grid}>
        {colors.map((preset) => (
          <TouchableOpacity
            key={preset.color}
            onPress={() => onSelect(preset.color)}
            style={[
              styles.chip,
              { backgroundColor: preset.color },
              selectedColor === preset.color && styles.chipSelected,
            ]}
          >
            {selectedColor === preset.color && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#868E96',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
  },
});