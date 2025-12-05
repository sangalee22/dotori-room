import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, StatusBar, Animated, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../styles';
import DefaultHeader from '../components/DefaultHeader';
import SectionTitle from '../components/SectionTitle';
import MoreButton from '../components/MoreButton';
import Button from '../components/Button';
import RoomCard from '../components/RoomCard';
import SimbolOutlineIcon from '../components/SimbolOutlineIcon';
import SimbolFillIcon from '../components/SimbolFillIcon';
import CommentIcon from '../components/CommentIcon';
import CommentLargeIcon from '../components/CommentLargeIcon';
import ReviewItem from '../components/ReviewItem';
import { useToast } from '../contexts/ToastContext';

/**
 * BookDetail Screen
 * @param {string} bookTitle - Book title
 * @param {string} bookSubtitle - Book subtitle (optional)
 * @param {string} author - Book author
 * @param {string} coverImage - Book cover image URL
 * @param {boolean} initialFavorite - Initial favorite state
 * @param {function} onToggleFavorite - Callback when favorite is toggled
 * @param {function} onBack - Callback when back button is pressed
 * @param {function} onMenu - Callback when menu button is pressed
 * @param {object} style - Additional style overrides
 */
export default function BookDetail({
  bookTitle = '모우어',
  bookSubtitle,
  author = '천선란',
  coverImage,
  initialFavorite = false,
  onToggleFavorite,
  onBack,
  onMenu,
  style,
}) {
  const insets = useSafeAreaInsets();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const [isFavorite, setIsFavorite] = React.useState(initialFavorite);
  const { showToast } = useToast();

  // Slide in animation on mount
  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
  }, []);

  // Update local state when initialFavorite changes
  React.useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Handle back with animation
  const handleBack = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onBack) {
        onBack();
      }
    });
  };

  // Pan responder for swipe to go back
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal swipes from the left edge
        const { pageX } = evt.nativeEvent;
        const { dx, dy } = gestureState;
        return pageX < 50 && dx > 10 && Math.abs(dy) < Math.abs(dx);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const screenWidth = Dimensions.get('window').width;
        // If swiped more than 30% of screen width, go back
        if (gestureState.dx > screenWidth * 0.3) {
          handleBack();
        } else {
          // Otherwise, spring back to original position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Call parent callback to update global state
    if (onToggleFavorite) {
      onToggleFavorite();
    }

    // Show toast only when adding to favorites
    if (newFavoriteState) {
      showToast('읽고 싶은 책장에 추가되었어요.');
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateX: slideAnim }],
        }
      ]}
      {...panResponder.panHandlers}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top Section with Book Cover and Info */}
        <View style={[styles.topSection, { paddingTop: insets.top + 108 }]}>
          {/* Background Image with Blur */}
          <View style={styles.backgroundContainer}>
            {coverImage ? (
              <Image
                source={typeof coverImage === 'string' ? { uri: coverImage } : coverImage}
                style={styles.backgroundImage}
                resizeMode="cover"
                blurRadius={20}
              />
            ) : (
              <View style={styles.backgroundPlaceholder} />
            )}
            <View style={styles.overlay} />
          </View>

          {/* Book Info */}
          <View style={styles.bookInfoContainer}>
            {/* Book Cover */}
            <View style={styles.bookCover}>
              {coverImage ? (
                <Image
                  source={typeof coverImage === 'string' ? { uri: coverImage } : coverImage}
                  style={styles.coverImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.coverPlaceholder} />
              )}
            </View>

            {/* Book Data */}
            <View style={styles.bookData}>
              <Text style={styles.bookTitle}>{bookTitle}</Text>
              {bookSubtitle && <Text style={styles.bookSubtitle}>{bookSubtitle}</Text>}
              <Text style={styles.bookAuthor}>{author}</Text>
            </View>
          </View>
        </View>

        {/* Section Detail */}
        <View style={styles.sectionDetail}>
          {/* Book Summary Section */}
          <View style={styles.bookSummarySection}>
            <View style={styles.bookSummaryContainer}>
              <Text style={styles.bookSummaryText}>
                잿빛 미래 속에서도 서로를 붙잡는 마음만은 끝내 살아남는다는 걸, 아주 고요하게 증명하는 이야기.
              </Text>
              <View style={styles.bookSummaryIcon}>
                <CommentLargeIcon width={60} height={60} />
              </View>
            </View>

            {/* Book Info Details */}
            <View style={styles.bookInfoDetails}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>저자</Text>
                <Text style={styles.infoValue}>천선란</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>출판사</Text>
                <View style={styles.infoValueRow}>
                  <Text style={styles.infoValue}>2025.01.01</Text>
                  <Text style={styles.infoValueSecondary}> 출간</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>카테고리</Text>
                <Text style={styles.infoValue}>소설/시/희곡</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>분량</Text>
                <Text style={styles.infoValue}>523p</Text>
              </View>
            </View>
          </View>

          {/* Book Review Section */}
          <View style={styles.bookReviewSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <SectionTitle style={{ paddingRight: 0 }}>독후감</SectionTitle>
                <Text style={styles.reviewCount}>265</Text>
              </View>
              <MoreButton label="전체" onPress={() => {}} />
            </View>

            <View style={styles.reviewContainer}>
              <ReviewItem
                username="포코어포코"
                date="2025.12.12"
                page={12}
                reviewText="이 책은 독자의 마음을 사로잡는 매력적인 이야기로 가득 차 있습니다. 등장인물들의 깊이 있는 감정선이 돋보이며, 흥미진진한 전개가 계속해서 긴장을 유지합니다. 작가의 섬세한 문체는 독서를 더욱 즐겁게 만들어 줍니다. 전반적으로, 이 책은 꼭 읽어봐야 할 작품입니다."
                numberOfLines={3}
                onMorePress={() => {}}
              />

              <ReviewItem
                username="포코어포코"
                date="2025.12.12"
                page={12}
                reviewText="이 책은 훌륭했습니다! 각 장마다 깊이 있는 통찰과 감동적인 이야기들이 많았습니다."
                numberOfLines={2}
                onMorePress={() => {}}
              />

              <ReviewItem
                username="포코어포코"
                date="2025.12.12"
                page={12}
                reviewText="재미있음"
                numberOfLines={1}
                onMorePress={() => {}}
              />

              {/* Already Read Box */}
              <View style={styles.alreadyReadBox}>
                <View style={styles.alreadyReadContent}>
                  <View style={styles.alreadyReadLeft}>
                    <SimbolOutlineIcon width={20} height={20} color={Colors.gray700} />
                    <Text style={styles.alreadyReadText}>이미 읽으셨나요?</Text>
                  </View>
                  <Button
                    variant="sub"
                    size="medium"
                    style={styles.alreadyReadButton}
                    onPress={() => {}}
                  >
                    독후감 쓰러가기
                  </Button>
                </View>
              </View>
            </View>
          </View>

          {/* Room Section - 같이 읽고 있는 룸 */}
          <View style={styles.roomSection}>
            <View style={styles.sectionHeader}>
              <SectionTitle>같이 읽고 있는 룸</SectionTitle>
            </View>
            <View style={styles.roomList}>
              <RoomCard
                bookTitle="모우어"
                author="천선란"
                progress={41}
                participants={[
                  { id: 1, name: 'User 1' },
                  { id: 2, name: 'User 2' },
                  { id: 3, name: 'User 3' },
                ]}
                onPress={() => {}}
              />
              <RoomCard
                bookTitle="모우어"
                author="천선란"
                progress={41}
                participants={[
                  { id: 1, name: 'User 1' },
                  { id: 2, name: 'User 2' },
                  { id: 3, name: 'User 3' },
                ]}
                moreCount={8}
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Room Section - 같이 읽어요 */}
          <View style={styles.roomSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <SectionTitle style={{ paddingRight: 0 }}>같이 읽어요</SectionTitle>
                <Text style={styles.reviewCount}>55</Text>
              </View>
              <MoreButton label="전체" onPress={() => {}} />
            </View>
            <View style={styles.roomList}>
              <RoomCard
                bookTitle="모우어"
                author="천선란"
                participants={[
                  { id: 1, name: 'User 1' },
                  { id: 2, name: 'User 2' },
                  { id: 3, name: 'User 3' },
                ]}
                onPress={() => {}}
              />
              <RoomCard
                bookTitle="모우어"
                author="천선란"
                participants={[
                  { id: 1, name: 'User 1' },
                  { id: 2, name: 'User 2' },
                ]}
                recruiting={5}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Default Header */}
      <DefaultHeader
        onBack={handleBack}
        onMenu={handleFavoriteToggle}
        title={bookTitle}
        titleOpacity={headerOpacity}
        gradientOpacity={headerOpacity}
        gradientStyle={{ paddingTop: insets.top }}
        rightButton={
          isFavorite ? (
            <SimbolFillIcon width={24} height={24} />
          ) : (
            <SimbolOutlineIcon width={24} height={24} color={Colors.gray600} />
          )
        }
        style={{ top: insets.top + 40, zIndex: 10 }}
      />

      {/* Bottom Buttons */}
      <View style={[styles.bottomButtons, { paddingBottom: insets.bottom + 40 }]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          locations={[0, 1]}
          style={styles.bottomGradient}
        />
        <View style={styles.buttonGroup}>
          <Button
            variant="outline"
            size="xlarge"
            style={styles.readTogetherButton}
            onPress={() => {}}
          >
            같이 읽기
          </Button>
          <Button
            variant="primary"
            size="xlarge"
            style={styles.readButton}
            onPress={() => {}}
          >
            읽기
          </Button>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    position: 'relative',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 108,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray100,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bookInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bookCover: {
    height: 246,
    width: 169,
    borderRadius: BorderRadius.sm,
    borderColor: Colors.gray100,
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray50,
  },
  bookData: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  bookTitle: {
    ...Typography.headline2Bold,
    color: Colors.gray900,
    textAlign: 'center',
  },
  bookSubtitle: {
    ...Typography.headline3Medium,
    color: Colors.gray900,
    textAlign: 'center',
    marginTop: 2,
  },
  bookAuthor: {
    ...Typography.body1Regular,
    color: Colors.gray700,
    textAlign: 'center',
    marginTop: 8,
  },
  contentSection: {
    padding: Spacing.md,
    minHeight: 400,
  },
  sectionPlaceholder: {
    ...Typography.body1Regular,
    color: Colors.gray600,
    textAlign: 'center',
    paddingVertical: 40,
  },
  // Section Detail Styles
  sectionDetail: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 120,
  },
  bookSummarySection: {
    gap: 20,
  },
  bookSummaryContainer: {
    backgroundColor: Colors.bg50,
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: 'relative',
  },
  bookSummaryText: {
    ...Typography.body1Medium,
    color: Colors.gray900,
  },
  bookSummaryIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bookInfoDetails: {
    gap: 8,
    paddingHorizontal: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  infoLabel: {
    ...Typography.body1Regular,
    color: Colors.gray600,
    width: 70,
  },
  infoValue: {
    ...Typography.body1Medium,
    color: Colors.gray900,
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValueSecondary: {
    ...Typography.body1Regular,
    color: Colors.gray900,
  },
  // Book Review Section Styles
  bookReviewSection: {
    marginTop: 40,
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    ...Typography.body1ExtraBold,
    color: Colors.primary900,
  },
  reviewContainer: {
    backgroundColor: Colors.bg50,
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  alreadyReadBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  alreadyReadContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alreadyReadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alreadyReadText: {
    ...Typography.body3Regular,
    color: Colors.gray700,
  },
  alreadyReadButton: {
    width: 115,
    borderRadius: 12,
  },
  // Room Section Styles
  roomSection: {
    marginTop: 40,
    gap: 4,
  },
  roomList: {
    gap: 12,
  },
  // Bottom Buttons Styles
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    maxWidth: 444,
    zIndex: 1,
  },
  readTogetherButton: {
    flex: 1,
  },
  readButton: {
    width: '60%',
  },
});
