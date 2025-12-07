import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../styles';

/**
 * DeleteIcon Component
 * X icon inside a circle for deleting/removing items
 */
export default function DeleteIcon({ width = 20, height = 20, color = Colors.gray500 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="10" fill={color} />
      <Path
        d="M13 7L7 13M7 7L13 13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
