import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastProvider } from './contexts/ToastContext';
import MainHeader from './components/MainHeader';
import Button from './components/Button';
import RoomCard from './components/RoomCard';
import BestReviewCard from './components/BestReviewCard';
import ArrowRightIcon from './components/ArrowRightIcon';
import SectionTitle from './components/SectionTitle';
import MoreButton from './components/MoreButton';
import TabElement from './components/TabElement';
import BestBook from './components/BestBook';
import Navigator from './components/Navigator';
import BottomNavigation from './components/BottomNavigation';
import BookDetail from './screens/BookDetail';
import { Colors, Typography, FontWeights, Spacing, BorderRadius } from './styles';

// Book cover images
const bookCoverMower = require('./assets/book-cover-mower.png');

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = React.useState('종합');
  const [activeBestReviewPage, setActiveBestReviewPage] = React.useState(0);
  const [activeBottomTab, setActiveBottomTab] = React.useState('home');
  const [currentView, setCurrentView] = React.useState('home'); // 'home' or 'bookDetail'
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [favoriteBooks, setFavoriteBooks] = React.useState(new Set()); // Store favorite book titles
  const bookListScrollRef = React.useRef(null);

  // Toggle favorite book
  const toggleFavorite = (bookTitle) => {
    setFavoriteBooks((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(bookTitle)) {
        newFavorites.delete(bookTitle);
      } else {
        newFavorites.add(bookTitle);
      }
      return newFavorites;
    });
  };

  // Mock data for each category - will be replaced with API data
  const bestBooksByCategory = {
    '종합': [
      { rank: 1, title: '도시인의 월든', author: '박혜윤' },
      { rank: 2, title: '아침이 달라지는\n저녁 루틴의 힘', author: '류한빈' },
      { rank: 3, title: '트렌드 코리아 2026', author: '김난도' },
      { rank: 4, title: '사피엔스', author: '유발 하라리' },
      { rank: 5, title: '총 균 쇠', author: '재레드 다이아몬드' },
      { rank: 6, title: '습관의 힘', author: '찰스 두히그' },
      { rank: 7, title: '미라클 모닝', author: '할 엘로드' },
      { rank: 8, title: '코스모스', author: '칼 세이건' },
    ],
    '소설': [
      { rank: 1, title: '싯다르타', author: '헤르만 헤세' },
      { rank: 2, title: '모우어', author: '천선란' },
      { rank: 3, title: '혼모노', author: '성해나' },
      { rank: 4, title: '달러구트 꿈 백화점', author: '이미예' },
      { rank: 5, title: '아몬드', author: '손원평' },
      { rank: 6, title: '파쇄', author: '구병모' },
      { rank: 7, title: '사탄탱고', author: '크러스너호르커이 라슬로' },
      { rank: 8, title: '채식주의자', author: '한강' },
    ],
    '경영/경제': [
      { rank: 1, title: '트렌드 코리아 2026', author: '김난도' },
      { rank: 2, title: '돈의 속성', author: '김승호' },
      { rank: 3, title: '부의 추월차선', author: 'MJ 드마코' },
      { rank: 4, title: '넛지', author: '리처드 탈러' },
      { rank: 5, title: '경제학 콘서트', author: '팀 하포드' },
      { rank: 6, title: '생각에 관한 생각', author: '대니얼 카너먼' },
      { rank: 7, title: '마케팅이다', author: '필립 코틀러' },
      { rank: 8, title: '리더의 역할', author: '피터 드러커' },
    ],
    '시/에세이': [
      { rank: 1, title: '도시인의 월든', author: '박혜윤' },
      { rank: 2, title: '달러구트 꿈 백화점', author: '이미예' },
      { rank: 3, title: '아몬드', author: '손원평' },
      { rank: 4, title: '곰팡이꽃', author: '천명관' },
      { rank: 5, title: '불편한 편의점', author: '김호연' },
      { rank: 6, title: '연년세세', author: '황정은' },
      { rank: 7, title: '나는 나로 살기로 했다', author: '김수현' },
      { rank: 8, title: '죽고 싶지만 떡볶이는 먹고 싶어', author: '백세희' },
    ],
    '인문/교양': [
      { rank: 1, title: '사피엔스', author: '유발 하라리' },
      { rank: 2, title: '총 균 쇠', author: '재레드 다이아몬드' },
      { rank: 3, title: '코스모스', author: '칼 세이건' },
      { rank: 4, title: '정의란 무엇인가', author: '마이클 샌델' },
      { rank: 5, title: '이기적 유전자', author: '리처드 도킨스' },
      { rank: 6, title: '문명의 붕괴', author: '재레드 다이아몬드' },
      { rank: 7, title: '역사의 역사', author: '유시민' },
      { rank: 8, title: '지적 대화를 위한 넓고 얕은 지식', author: '채사장' },
    ],
    '취미/실용': [
      { rank: 1, title: '아침이 달라지는\n저녁 루틴의 힘', author: '류한빈' },
      { rank: 2, title: '습관의 힘', author: '찰스 두히그' },
      { rank: 3, title: '미라클 모닝', author: '할 엘로드' },
      { rank: 4, title: '아주 작은 습관의 힘', author: '제임스 클리어' },
      { rank: 5, title: '돈의 심리학', author: '모건 하우절' },
      { rank: 6, title: '나는 4시간만 일한다', author: '팀 페리스' },
      { rank: 7, title: '부자 아빠 가난한 아빠', author: '로버트 기요사키' },
      { rank: 8, title: '1만 시간의 법칙', author: '말콤 글래드웰' },
    ],
  };

  const currentBooks = bestBooksByCategory[activeTab] || bestBooksByCategory['종합'];

  // Best review data - max 6 items
  const bestReviews = [
    {
      bookTitle: '사탄탱고',
      bookSubtitle: '2025 노벨문학상 수상작가',
      author: '크러스너호르커이 라슬로',
      readerCount: 34,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: '잿빛 미래 속에서도 서로를 붙잡는 마음만은 끝내 살아남는다는 걸, 아주 고요하게 증명하는 이야기.',
    },
    {
      bookTitle: '프로젝트 헤일리메리',
      bookSubtitle: '앤디 위어 우주 3부작',
      author: '앤디 위어',
      readerCount: 12,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: '잿빛 미래 속에서도 서로를 붙잡는 마음만은 끝내 살아남는다는 걸, 아주 고요하게 증명하는 이야기. 잿빛 미래 속에서도 서로를 붙잡는 마음만은 끝내 살아남는다는 걸, 아주 고요하게 증명하는 이야기.',
    },
    {
      bookTitle: '지적 생활의 즐거움',
      author: 'P.G.해머튼',
      readerCount: 34,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: '잿빛 미래 속에서도 서로를 붙잡는 마음만은 끝내 살아남는다는 걸, ',
    },
    {
      bookTitle: '싯다르타',
      author: '헤르만 헤세',
      readerCount: 28,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: '영혼의 여정을 따라가며 삶의 본질을 깨닫게 하는 철학적 소설.',
    },
    {
      bookTitle: '모우어',
      author: '천선란',
      readerCount: 19,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: 'SF의 상상력과 인간에 대한 깊은 통찰이 어우러진 작품.',
    },
    {
      bookTitle: '혼모노',
      author: '성해나',
      readerCount: 42,
      reviewerName: 'User name',
      reviewDate: '2025.12.12',
      reviewText: '진짜와 가짜 사이에서 고민하게 만드는 이야기.',
    },
  ];

  // Reset scroll position when tab changes
  React.useEffect(() => {
    if (bookListScrollRef.current) {
      bookListScrollRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [activeTab]);

  // Calculate card width for best review
  const bestReviewCardWidth = windowWidth - Spacing.md * 2; // Subtract section padding
  const snapInterval = bestReviewCardWidth + Spacing.md; // card width + gap

  // Handle best review scroll
  const handleBestReviewScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollX / snapInterval);
    setActiveBestReviewPage(pageIndex);
  };

  const bookTitle = selectedBook?.title || '모우어';

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <View style={styles.wrapper}>
          <StatusBar style="light" />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Now Reading Section */}
            <View style={styles.section}>
              <TouchableOpacity
            style={styles.nowReading}
            onPress={() => {
              setSelectedBook({ title: '모우어', author: '천선란', coverImage: bookCoverMower });
              setCurrentView('bookDetail');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.bookCoverSmall}>
              <Image source={bookCoverMower} style={styles.bookCoverPlaceholder} resizeMode="cover" />
            </View>
            <View style={styles.nowReadingInfo}>
              <View>
                <Text style={styles.bookTitle}>모우어</Text>
                <Text style={styles.bookAuthor}>천선란</Text>
              </View>
              <View style={styles.nowReadingBottom}>
                <View style={styles.progressSection}>
                  <Text style={styles.progressText}>
                    <Text style={styles.progressPercent}>41%</Text> 읽음
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBar, { width: '41%' }]} />
                  </View>
                </View>
                <Button
                  variant="primary"
                  size="medium"
                  onPress={() => console.log('Continue reading')}
                  style={{ alignSelf: 'flex-end' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ color: Colors.white, ...Typography.body2Medium }}>이어 읽기</Text>
                    <ArrowRightIcon width={20} height={20} color={Colors.white} />
                  </View>
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Reading Rooms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionTitle>같이 읽고 있는 룸</SectionTitle>
            <MoreButton onPress={() => console.log('More')} />
          </View>
          <RoomCard
            bookTitle="booktitle"
            author="artist"
            isParticipating={true}
            status="inProgress"
            progress={41}
            participants={[{}, {}, {}]}
            moreCount={8}
            style={{ marginBottom: Spacing.md }}
          />
          <RoomCard
            bookTitle="혼모노"
            author="성해나"
            isParticipating={true}
            status="inProgress"
            progress={41}
            participants={[{}, {}, {}]}
            moreCount={8}
          />
        </View>

        {/* Weekly Best Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { marginBottom: Spacing.sm }]}>
            <SectionTitle>주간 베스트</SectionTitle>
            <MoreButton onPress={() => console.log('More')} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
            style={styles.tabScrollView}
          >
            <TabElement active={activeTab === '종합'} onPress={() => setActiveTab('종합')}>종합</TabElement>
            <TabElement active={activeTab === '소설'} onPress={() => setActiveTab('소설')}>소설</TabElement>
            <TabElement active={activeTab === '경영/경제'} onPress={() => setActiveTab('경영/경제')}>경영/경제</TabElement>
            <TabElement active={activeTab === '시/에세이'} onPress={() => setActiveTab('시/에세이')}>시/에세이</TabElement>
            <TabElement active={activeTab === '인문/교양'} onPress={() => setActiveTab('인문/교양')}>인문/교양</TabElement>
            <TabElement active={activeTab === '취미/실용'} onPress={() => setActiveTab('취미/실용')}>취미/실용</TabElement>
          </ScrollView>
          <ScrollView
            ref={bookListScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bestList}
          >
            {currentBooks.map((book, index) => (
              <BestBook
                key={index}
                rank={book.rank}
                title={book.title}
                author={book.author}
                style={{ marginRight: index < currentBooks.length - 1 ? Spacing.md : 0 }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Hot Rooms Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SectionTitle>뜨고있는 도토리룸</SectionTitle>
            <MoreButton onPress={() => console.log('More')} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={300}
            decelerationRate="fast"
            snapToAlignment="start"
            style={styles.hotRoomsScrollView}
          >
            <View style={styles.hotRoomsList}>
              {/* First Row */}
              <View style={styles.hotRoomsRow}>
                <RoomCard
                  bookTitle="싯타르타"
                  author="헤르만 헤세"
                  status="inProgress"
                  participants={[{}, {}, {}]}
                  moreCount={8}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="파쇄"
                  author="구병모"
                  status="recruiting"
                  recruitCount={5}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="모우어"
                  author="천선란"
                  status="inProgress"
                  participants={[{}, {}, {}]}
                  moreCount={5}
                  style={styles.hotRoomCard}
                />
              </View>
              {/* Second Row */}
              <View style={styles.hotRoomsRow}>
                <RoomCard
                  bookTitle="혼모노"
                  author="성해나"
                  status="inProgress"
                  participants={[{}, {}]}
                  moreCount={3}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="도시인의 월든"
                  author="박혜윤"
                  status="recruiting"
                  recruitCount={3}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="트렌드 코리아 2026"
                  author="김난도"
                  status="inProgress"
                  participants={[{}, {}, {}]}
                  moreCount={12}
                  style={styles.hotRoomCard}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Best Review Section */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { marginBottom: 8 }]}>
            <SectionTitle>베스트 책 리뷰</SectionTitle>
            <MoreButton onPress={() => console.log('More')} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bestReviewList}
            style={styles.bestReviewScrollView}
            snapToInterval={snapInterval}
            decelerationRate="fast"
            snapToAlignment="start"
            onScroll={handleBestReviewScroll}
            scrollEventThrottle={16}
          >
            {bestReviews.map((review, index) => (
              <BestReviewCard
                key={index}
                bookTitle={review.bookTitle}
                bookSubtitle={review.bookSubtitle}
                author={review.author}
                readerCount={review.readerCount}
                reviewerName={review.reviewerName}
                reviewDate={review.reviewDate}
                reviewText={review.reviewText}
              />
            ))}
          </ScrollView>
          <View style={styles.navigatorContainer}>
            <Navigator total={bestReviews.length} active={activeBestReviewPage} />
          </View>
        </View>

        {/* Recruiting Rooms Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <SectionTitle>같이 읽어요! 모집중인 룸</SectionTitle>
            <MoreButton onPress={() => console.log('More')} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={300}
            decelerationRate="fast"
            snapToAlignment="start"
            style={styles.hotRoomsScrollView}
          >
            <View style={styles.hotRoomsList}>
              {/* First Row */}
              <View style={styles.hotRoomsRow}>
                <RoomCard
                  bookTitle="파쇄"
                  author="구병모"
                  status="recruiting"
                  recruitCount={5}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="도시인의 월든"
                  author="박혜윤"
                  status="recruiting"
                  recruitCount={3}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="아침이 달라지는 저녁 루틴의 힘"
                  author="류한빈"
                  status="recruiting"
                  recruitCount={7}
                  style={styles.hotRoomCard}
                />
              </View>
              {/* Second Row */}
              <View style={styles.hotRoomsRow}>
                <RoomCard
                  bookTitle="싯타르타"
                  author="헤르만 헤세"
                  status="inProgress"
                  participants={[{}, {}, {}]}
                  moreCount={8}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="트렌드 코리아 2026"
                  author="김난도"
                  status="inProgress"
                  participants={[{}, {}]}
                  moreCount={5}
                  style={styles.hotRoomCard}
                />
                <RoomCard
                  bookTitle="습관의 힘"
                  author="찰스 두히그"
                  status="recruiting"
                  recruitCount={4}
                  style={styles.hotRoomCard}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Main Header */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <MainHeader onSearch={() => console.log('Search pressed')} />
      </SafeAreaView>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.bottomNavContainer} edges={['bottom']}>
        <BottomNavigation
          activeTab={activeBottomTab}
          onTabPress={(tab) => {
            setActiveBottomTab(tab);
            console.log('Tab pressed:', tab);
          }}
        />
      </SafeAreaView>

      {/* BookDetail overlay */}
      {currentView === 'bookDetail' && (
        <BookDetail
          bookTitle={bookTitle}
          author={selectedBook?.author || '천선란'}
          coverImage={selectedBook?.coverImage}
          initialFavorite={favoriteBooks.has(bookTitle)}
          onToggleFavorite={() => toggleFavorite(bookTitle)}
          onBack={() => {
            setCurrentView('home');
            setSelectedBook(null);
          }}
          onMenu={() => console.log('Menu pressed')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
          }}
        />
      )}
      </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 100,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: 60,
  },
  lastSection: {
    marginBottom: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  nowReading: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  bookCoverSmall: {
    width: 108,
    height: 158,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  bookCoverLarge: {
    width: 126,
    height: 184,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  bookCoverMediumBest: {
    width: 106,
    height: 155,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  bookCoverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray200,
  },
  nowReadingInfo: {
    flex: 1,
    paddingVertical: Spacing.xs,
    gap: Spacing.xl,
  },
  bookTitle: {
    ...Typography.headline1Bold,
    color: Colors.gray900,
  },
  bookAuthor: {
    ...Typography.subtitle1Regular,
    color: Colors.gray600,
  },
  nowReadingBottom: {
    gap: Spacing.md,
  },
  progressSection: {
  },
  progressText: {
    ...Typography.body3Regular,
    color: Colors.gray800,
    marginBottom: Spacing.xs,
  },
  progressPercent: {
    fontWeight: FontWeights.extraBold,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary500,
    borderRadius: 10,
  },
  continueButton: {
    backgroundColor: Colors.primary500,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-end',
  },
  continueButtonText: {
    ...Typography.body2Medium,
    color: Colors.white,
  },
  tabScrollView: {
    marginHorizontal: -Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bestList: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  hotRoomsScrollView: {
    marginHorizontal: -Spacing.md,
  },
  hotRoomsList: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  hotRoomsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  hotRoomCard: {
    width: 300,
    marginRight: 0,
    scrollSnapAlign: 'start',
  },
  bestCard: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  bestRank: {
    fontSize: 50,
    fontWeight: FontWeights.extraBold,
    color: Colors.gray800,
    alignSelf: 'flex-start',
  },
  bestRankSmall: {
    fontSize: 40,
  },
  bestBookTitle: {
    ...Typography.body2Medium,
    color: Colors.gray900,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  bestBookAuthor: {
    ...Typography.body2Regular,
    color: Colors.gray600,
    textAlign: 'center',
  },
  bestReviewScrollView: {
    marginHorizontal: -Spacing.md,
  },
  bestReviewList: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  navigatorContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
});
