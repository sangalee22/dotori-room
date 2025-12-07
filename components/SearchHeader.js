import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../styles';
import IconButton from './IconButton';
import ArrowLeftIcon from './ArrowLeftIcon';
import TextField from './TextField';

/**
 * SearchHeader Component
 * Header with back button and search input field
 */
export default function SearchHeader({
  searchText,
  onSearchTextChange,
  onBack,
  onSearch,
  placeholder = '책 또는 저자를 검색해주세요',
}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.84)',
          'rgba(255, 255, 255, 0.75)',
          'rgba(255, 255, 255, 0)',
        ]}
        locations={[0, 0.67, 1]}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <IconButton onPress={onBack} style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} />
        </IconButton>

        <TextField
          value={searchText}
          onChangeText={onSearchTextChange}
          placeholder={placeholder}
          showClearButton={true}
          autoFocus
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
});
