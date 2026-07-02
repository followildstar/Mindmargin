// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Text,  Image, StyleSheet } from 'react-native';

export const SearchBar = ({ 
  expanded, 
  query, 
  onQueryChange, 
  onExpand, 
  onCollapse 
}) => {
  if (!expanded) {
    return (
      <TouchableOpacity onPress={onExpand} style={styles.searchIcon}>
        <Image style={styles.searchIconImg} source={require("../../assets/search.png")} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.expandedContainer}>
      <TextInput
        placeholder="검색"
        value={query}
        onChangeText={onQueryChange}
        style={styles.input}
        placeholderTextColor="#7b858fff"
        autoFocus
      />
      <TouchableOpacity 
        onPress={() => {
          onCollapse();
          onQueryChange('');
        }} 
        style={styles.closeButton}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    padding: 8,
    borderRadius: 6,
  },
  // searchIconText: {
  //   fontSize: 22,
  //   color: '#000000',
  // },
    searchIconImg: {
    width: 24,
    height:24,
  },
  expandedContainer: {
    flexDirection: "row-reverse",
    alignItems: 'center',
    flex: 1,
    height:40,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#000000',
    fontSize: 15,
    borderBottomColor:"#999",
    borderBottomWidth:1,
    marginRight:10,
  },
  closeButton: {
    marginRight: 2,
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: '#555',
  },
});