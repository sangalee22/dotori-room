import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../styles';

/**
 * CloseIcon Component
 * X icon for closing/removing items
 */
export default function CloseIcon({ width = 24, height = 24, color = Colors.gray700 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.3994 6.39948C16.7314 6.06753 17.2686 6.06753 17.6006 6.39948C17.9325 6.73143 17.9325 7.26872 17.6006 7.60065L13.2012 12.0001L17.6006 16.3995C17.9325 16.7314 17.9325 17.2687 17.6006 17.6006C17.2687 17.9326 16.7314 17.9325 16.3994 17.6006L12 13.2012L7.60059 17.6006C7.26866 17.9326 6.73136 17.9325 6.39941 17.6006C6.06747 17.2687 6.06747 16.7314 6.39941 16.3995L10.7988 12.0001L6.39941 7.60065C6.06747 7.2687 6.06747 6.73142 6.39941 6.39948C6.73136 6.06753 7.26864 6.06753 7.60059 6.39948L12 10.7989L16.3994 6.39948Z"
        fill={color}
      />
    </Svg>
  );
}
