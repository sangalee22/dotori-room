import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

// Home Icon
function HomeIcon({ active }) {
  const color = active ? Colors.gray900 : Colors.gray500;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10L12 3L21 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21V16C9 15.4477 9.44772 15 10 15H14C14.5523 15 15 15.4477 15 16V21M9 21H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Dotori Room Icon (simbol_outline)
function DotoriRoomIcon({ active }) {
  const color = active ? Colors.gray900 : Colors.gray500;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z"
        fill={color}
      />
      <Path
        d="M12 12V16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Bookshelf Icon
function BookshelfIcon({ active }) {
  const color = active ? Colors.gray900 : Colors.gray500;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 19H21M3 19V6C3 5.44772 3.44772 5 4 5H8C8.55228 5 9 5.44772 9 6V19M3 19H9M21 19V9C21 8.44772 20.5523 8 20 8H16C15.4477 8 15 8.44772 15 9V19M21 19H15M9 19H15M9 19V12C9 11.4477 9.44772 11 10 11H14C14.5523 11 15 11.4477 15 12V19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Chat Icon
function ChatIcon({ active }) {
  const color = active ? Colors.gray900 : Colors.gray500;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// My/Profile Icon
function MyIcon({ active }) {
  const color = active ? Colors.gray900 : Colors.gray500;
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="4"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * BottomNavigation Component
 * @param {string} activeTab - Currently active tab ('home', 'dotoriRoom', 'bookshelf', 'chat', 'my')
 * @param {function} onTabPress - Callback when tab is pressed, receives tab name
 * @param {object} style - Additional style overrides
 */
export default function BottomNavigation({ activeTab = 'home', onTabPress, style }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: 'home', label: '홈', Icon: HomeIcon },
    { id: 'dotoriRoom', label: '도토리룸', Icon: DotoriRoomIcon },
    { id: 'bookshelf', label: '나의 책장', Icon: BookshelfIcon },
    { id: 'my', label: 'my', Icon: MyIcon },
  ];

  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.84)', '#FFFFFF']}
      locations={[0, 0.4451, 1]}
      style={[styles.container, { paddingBottom: insets.bottom }, style]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress && onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <tab.Icon active={isActive} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontFamily: 'Min Sans',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.gray500,
    textAlign: 'center',
  },
  activeLabel: {
    color: Colors.gray900,
  },
});
