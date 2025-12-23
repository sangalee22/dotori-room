import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing } from '../styles';
import Logo from './Logo';
import SearchIcon from './SearchIcon';
import IconButton from './IconButton';

/**
 * MainHeader Component
 * Header used in the main screen with logo, search button, and gradient background
 */
export default function MainHeader({ onSearch }) {
  return (
    <>
      {/* Header Background Gradient */}
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={['#FFFFFF', 'rgba(255,255,255,0.90)', 'rgba(255,255,255,0.00)']}
          locations={[0, 0.5865, 1]}
          style={styles.gradient}
        />
      </View>

      {/* Header Content */}
      <View style={styles.header}>
        <Logo width={87} height={26} />
        <IconButton onPress={onSearch}>
          <SearchIcon width={24} height={24} />
        </IconButton>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
    height: 60,
    position: 'relative',
    zIndex: 1,
  },
});
