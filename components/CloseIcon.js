import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../styles';

/**
 * CloseIcon Component
 * X icon for closing/removing items
 */
export default function CloseIcon({ width = 20, height = 20, color = Colors.gray700 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M15 5L5 15M5 5L15 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
