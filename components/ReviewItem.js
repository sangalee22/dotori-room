import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../styles';
import UserProfile from './UserProfile';

/**
 * ReviewItem Component
 * @param {string} username - Reviewer's name
 * @param {string} userImage - Reviewer's profile image URL
 * @param {string} date - Review date
 * @param {number} page - Page number
 * @param {string} reviewText - Review content
 * @param {function} onMorePress - Callback when more button is pressed
 * @param {number} numberOfLines - Number of lines to show (default: 3)
 * @param {object} style - Additional style overrides
 */
export default function ReviewItem({
  username = '포코어포코',
  userImage,
  date = '2025.12.12',
  page = 12,
  reviewText = '',
  onMorePress,
  numberOfLines = 3,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userInfoLeft}>
          <UserProfile imageUri={userImage} size={32} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Review Content */}
      <View style={styles.reviewContent}>
        {/* Page Number */}
        <View style={styles.pageNumber}>
          <Text style={styles.pageNumberText}>{page}</Text>
          <Text style={styles.pageNumberText}>p</Text>
        </View>

        {/* Review Text */}
        <Text style={styles.reviewText} numberOfLines={numberOfLines}>
          {reviewText}
        </Text>

        {/* More Button */}
        {onMorePress && (
          <TouchableOpacity onPress={onMorePress}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  username: {
    ...Typography.body2Regular,
    color: Colors.gray900,
  },
  date: {
    ...Typography.caption1Regular,
    color: Colors.gray500,
  },
  reviewContent: {
    marginLeft: 40,
    gap: 0,
  },
  pageNumber: {
    flexDirection: 'row',
    gap: 0,
  },
  pageNumberText: {
    ...Typography.body1ExtraBold,
    color: Colors.gray600,
  },
  reviewText: {
    ...Typography.body1Regular,
    color: Colors.gray900,
  },
  moreText: {
    ...Typography.body2Regular,
    color: Colors.gray500,
    textAlign: 'right',
  },
});
