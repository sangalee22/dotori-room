import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../styles';
import ArrowLeftIcon from './ArrowLeftIcon';
import MenuIcon from './MenuIcon';
import IconButton from './IconButton';

/**
 * DefaultHeader Component
 * Header used in detail screens with back button, title, and right action button
 * @param {function} onBack - Back button press handler
 * @param {function} onMenu - Menu button press handler (or right button press handler)
 * @param {ReactNode} rightButton - Custom right button component (if not provided, uses MenuIcon)
 * @param {string} title - Optional title to display in center
 * @param {Animated.Value} titleOpacity - Optional animated opacity for title
 * @param {Animated.Value} gradientOpacity - Optional animated opacity for gradient background
 * @param {object} gradientStyle - Additional style overrides for gradient
 * @param {string} iconColor - Icon color (default: gray600)
 * @param {object} style - Additional style overrides
 */
export default function DefaultHeader({
  onBack,
  onMenu,
  rightButton,
  title,
  titleOpacity,
  gradientOpacity,
  gradientStyle,
  iconColor = Colors.gray600,
  style,
}) {
  return (
    <>
      {gradientOpacity && (
        <Animated.View style={[styles.gradientContainer, gradientStyle, { opacity: gradientOpacity }]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
            locations={[0, 1]}
            style={styles.gradient}
          />
        </Animated.View>
      )}
      <View style={[styles.header, style]}>
      <IconButton onPress={onBack}>
        <ArrowLeftIcon width={24} height={24} color={iconColor} />
      </IconButton>
      {title && (
        <Animated.Text
          style={[
            styles.title,
            titleOpacity && { opacity: titleOpacity },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Animated.Text>
      )}
      {rightButton ? (
        <IconButton onPress={onMenu}>
          {rightButton}
        </IconButton>
      ) : (
        <IconButton onPress={onMenu}>
          <MenuIcon width={24} height={24} color={iconColor} />
        </IconButton>
      )}
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
    height: 64,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 52,
  },
  title: {
    ...Typography.subtitle1Medium,
    color: Colors.gray900,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
});
