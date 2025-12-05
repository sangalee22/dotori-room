import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../styles';

/**
 * SectionTitle Component
 * @param {ReactNode} children - Section title text
 * @param {object} style - Additional style overrides
 */
export default function SectionTitle({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    justifyContent: 'center',
  },
  title: {
    ...Typography.body1Medium,
    color: Colors.gray900,
  },
});
