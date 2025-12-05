import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../styles';

/**
 * BestBook Component
 * @param {number} rank - Book ranking (1, 2, 3, etc.)
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {string} coverImage - Book cover image URL (optional)
 * @param {object} style - Additional style overrides
 */
export default function BestBook({
  rank = 1,
  title = 'Book Title',
  author = 'Author',
  coverImage,
  style,
}) {
  const isFirstPlace = rank === 1;
  const showRank = rank <= 3;

  const isSecondPlace = rank === 2;
  const isThirdPlace = rank === 3;

  return (
    <View style={[
      styles.container,
      !isFirstPlace && styles.containerFixed,
      (isSecondPlace || isThirdPlace) && styles.containerWithRank,
      !showRank && styles.containerNoRank,
      style
    ]}>
      {showRank && (
        <Text style={[
          styles.rank,
          isFirstPlace && styles.rankLarge,
          isSecondPlace && styles.rankSecond,
          isThirdPlace && styles.rankThird,
        ]}>
          {rank}
        </Text>
      )}
      <View style={[
        styles.card,
        isFirstPlace && styles.cardRank1,
        (isSecondPlace || isThirdPlace) && styles.cardRank23,
      ]}>
        <View style={isFirstPlace ? styles.coverLarge : styles.coverMedium}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text
            style={styles.author}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {author}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  containerFixed: {
    width: 106,
  },
  containerWithRank: {
    paddingTop: 8,
  },
  containerNoRank: {
    paddingTop: 33,
  },
  rank: {
    fontFamily: 'Min Sans',
    fontWeight: '800',
    color: Colors.gray800,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  rankLarge: {
    fontSize: 50,
    lineHeight: 48,
    letterSpacing: 0,
    color: Colors.primary900,
    height: 48,
  },
  rankSecond: {
    fontSize: 40,
    lineHeight: 53,
    letterSpacing: 0,
    color: Colors.primary800,
  },
  rankThird: {
    fontSize: 40,
    lineHeight: 53,
    letterSpacing: 0,
    color: Colors.primary500,
  },
  card: {
    alignItems: 'center',
  },
  cardRank1: {
    marginTop: -24,
  },
  cardRank23: {
    marginTop: -28,
  },
  coverLarge: {
    width: 126,
    height: 184,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  coverMedium: {
    width: 106,
    height: 155,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    backgroundColor: Colors.gray200,
  },
  info: {
    width: '100%',
    gap: 2,
  },
  title: {
    ...Typography.body2Medium,
    color: Colors.gray900,
    textAlign: 'center',
  },
  author: {
    ...Typography.body2Regular,
    color: Colors.gray600,
    textAlign: 'center',
  },
});
