import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing } from '../styles';

/**
 * Toast Component
 * @param {boolean} visible - Whether the toast is visible
 * @param {string} message - Toast message
 * @param {number} duration - Duration in milliseconds (default: 2000)
 * @param {function} onHide - Callback when toast hides
 */
export default function Toast({ visible, message, duration = 2000, onHide }) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          pointerEvents: visible ? 'auto' : 'none',
        },
      ]}
    >
      {Platform.OS === 'web' ? (
        <Animated.View style={styles.webBlurContainer}>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      ) : (
        <BlurView intensity={100} tint="dark" style={styles.blurContainer}>
          <Animated.View style={styles.backgroundOverlay}>
            <Text style={styles.message}>{message}</Text>
          </Animated.View>
        </BlurView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    marginLeft: -150, // Half of width (300px / 2)
    width: 300,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 5,
    zIndex: 1000,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  backgroundOverlay: {
    backgroundColor: 'rgba(93, 81, 108, 0.8)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  webBlurContainer: {
    backgroundColor: 'rgba(93, 81, 108, 0.8)',
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }),
  },
  message: {
    ...Typography.body1Medium,
    color: Colors.white,
    textAlign: 'center',
  },
});
