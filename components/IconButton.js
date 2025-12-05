import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function IconButton({ children, onPress, size = 48, ...props }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size },
        pressed && styles.pressed,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
