import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, useWindowDimensions, TouchableOpacity, Animated, ActivityIndicator, Platform } from 'react-native';
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
import SearchScreen from './screens/SearchScreen';
import CreateReadingRoom from './screens/CreateReadingRoom';
import { Colors, Typography, FontWeights, Spacing, BorderRadius } from './styles';
import { fetchBestsellers, CATEGORY_LIST } from './services/aladinApi';

// 웹에서 Min Sans 폰트 로드
if (Platform.OS === 'web') {
  require('./styles/fonts.css');
}

// Book cover images
const bookCoverMower = require('./assets/book-cover-mower.png');

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = React.useState('종합');
  const [activeBestReviewPage, setActiveBestReviewPage] = React.useState(0);
  const [activeBottomTab, setActiveBottomTab] = React.useState('home');
  const [currentView, setCurrentView] = React.useState('home'); // 'home', 'bookDetail', 'search', or 'createRoom'
  const [previousView, setPreviousView] = React.useState('home'); // Track previous view for back navigation
  const [selectedBook, setSelectedBook] = React.useState(null);
  const [favoriteBooks, setFavoriteBooks] = React.useState(new Set()); // Store favorite book titles
  const [recentBooks, setRecentBooks] = React.useState([]); // Store recently viewed books
  const [recentSearches, setRecentSearches] = React.useState([]); // Store recent search terms
  const [searchText, setSearchText] = React.useState(''); // Search input text
  const [hasSearched, setHasSearched] = React.useState(false); // Whether user has performed a search
  const [searchResults, setSearchResults] = React.useState([]); // Search results
  const bookListScrollRef = React.useRef(null);

  // 알라딘 API 상태 관리
  const [bestBooks, setBestBooks] = React.useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = React.useState(false);
  const [booksError, setBooksError] = React.useState(null);

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

  // Add book to recent books
  const addToRecentBooks = (book) => {
    setRecentBooks((prevBooks) => {
      // Remove duplicate if exists
      const filtered = prevBooks.filter(b => b.isbn !== book.isbn);
      // Add to the beginning and limit to 6 books
      return [book, ...filtered].slice(0, 6);
    });
  };

  // Add search term to recent searches
  const addToRecentSearches = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;

    setRecentSearches((prevSearches) => {
      // Remove duplicate if exists
      const filtered = prevSearches.filter(term => term !== searchTerm.trim());
      // Add to the beginning and limit to 7 terms
      return [searchTerm.trim(), ...filtered].slice(0, 7);
    });
  };

  // Remove a specific search term
  const removeRecentSearch = (searchTerm) => {
    setRecentSearches((prevSearches) =>
      prevSearches.filter(term => term !== searchTerm)
    );
  };

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  // Clear all recent books
  const clearAllRecentBooks = () => {
    setRecentBooks([]);
  };

  // Handle book press from recent books or search results
  const handleRecentBookPress = (book) => {
    setSelectedBook(book);
    addToRecentBooks(book); // Update recent books order
    setPreviousView(currentView); // Store current view before navigating
    setCurrentView('bookDetail');
  };

  // 알라딘 API로 베스트셀러 데이터 가져오기
  React.useEffect(() => {
    const loadBestsellers = async () => {
      setIsLoadingBooks(true);
      setBooksError(null);

      try {
        const books = await fetchBestsellers(activeTab, 8);
        setBestBooks(books);
      } catch (error) {
        console.error('베스트셀러 로딩 오류:', error);
        setBooksError('베스트셀러를 불러오는데 실패했습니다.');
        // 오류 발생 시 빈 배열로 설정
        setBestBooks([]);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    loadBestsellers();
  }, [activeTab]);

  const currentBooks = bestBooks;

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
              const bookData = { title: '모우어', author: '천선란', coverImage: bookCoverMower, isbn: 'K232931529' };
              setSelectedBook(bookData);
              addToRecentBooks(bookData);
              setPreviousView(currentView);
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
            {CATEGORY_LIST.map((category) => (
              <TabElement
                key={category.id}
                active={activeTab === category.name}
                onPress={() => setActiveTab(category.name)}
              >
                {category.label}
              </TabElement>
            ))}
          </ScrollView>
          {isLoadingBooks ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary500} />
              <Text style={styles.loadingText}>베스트셀러를 불러오는 중...</Text>
            </View>
          ) : booksError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{booksError}</Text>
            </View>
          ) : (
            <ScrollView
              ref={bookListScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.bestList}
            >
              {currentBooks.map((book, index) => (
                <BestBook
                  key={book.isbn || index}
                  rank={book.rank}
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  isbn={book.isbn}
                  onPress={() => {
                    console.log('📚 책 선택:', book.title, 'ISBN:', book.isbn);
                    const bookData = {
                      isbn: book.isbn,
                      title: book.title,
                      author: book.author,
                      coverImage: book.coverImage,
                    };
                    setSelectedBook(bookData);
                    addToRecentBooks(bookData);
                    setPreviousView(currentView);
                    setCurrentView('bookDetail');
                  }}
                  style={{ marginRight: index < currentBooks.length - 1 ? Spacing.md : 0 }}
                />
              ))}
            </ScrollView>
          )}
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
        <MainHeader onSearch={() => setCurrentView('search')} />
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

      {/* BookDetail overlay - show when in bookDetail or createRoom view */}
      {(currentView === 'bookDetail' || currentView === 'createRoom') && selectedBook && (
        <BookDetail
          isbn={selectedBook.isbn}
          bookTitle={selectedBook.title || bookTitle}
          author={selectedBook.author || '천선란'}
          coverImage={selectedBook.coverImage}
          initialFavorite={favoriteBooks.has(selectedBook.title || bookTitle)}
          onToggleFavorite={() => toggleFavorite(selectedBook.title || bookTitle)}
          onBack={() => {
            setSelectedBook(null);
            setCurrentView(previousView);
          }}
          onMenu={() => console.log('Menu pressed')}
          onCreateRoom={(bookData) => {
            setSelectedBook(bookData);
            setPreviousView(currentView);
            setCurrentView('createRoom');
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 200,
          }}
        />
      )}

      {/* Search Screen overlay - stays open until closed */}
      {(currentView === 'search' || currentView === 'bookDetail') && previousView === 'search' && (
        <SearchScreen
          onBack={() => {
            setCurrentView('home');
            // 검색 페이지를 벗어날 때 검색 상태 초기화
            setSearchText('');
            setHasSearched(false);
            setSearchResults([]);
          }}
          recentBooks={recentBooks}
          recentSearches={recentSearches}
          onAddSearch={addToRecentSearches}
          onRemoveSearch={removeRecentSearch}
          onClearAllSearches={clearAllRecentSearches}
          onBookPress={handleRecentBookPress}
          onClearAllBooks={clearAllRecentBooks}
          searchText={searchText}
          setSearchText={setSearchText}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
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

      {/* Search Screen overlay - initial search view */}
      {currentView === 'search' && previousView !== 'bookDetail' && (
        <SearchScreen
          onBack={() => {
            setCurrentView('home');
            // 검색 페이지를 벗어날 때 검색 상태 초기화
            setSearchText('');
            setHasSearched(false);
            setSearchResults([]);
          }}
          recentBooks={recentBooks}
          recentSearches={recentSearches}
          onAddSearch={addToRecentSearches}
          onRemoveSearch={removeRecentSearch}
          onClearAllSearches={clearAllRecentSearches}
          onBookPress={handleRecentBookPress}
          onClearAllBooks={clearAllRecentBooks}
          searchText={searchText}
          setSearchText={setSearchText}
          hasSearched={hasSearched}
          setHasSearched={setHasSearched}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
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

      {/* CreateReadingRoom overlay - show on top of BookDetail */}
      {currentView === 'createRoom' && selectedBook && (
        <CreateReadingRoom
          bookTitle={selectedBook.title}
          bookSubtitle={selectedBook.subtitle}
          author={selectedBook.author}
          coverImage={selectedBook.coverImage}
          onBack={() => {
            // Keep selectedBook to show BookDetail when going back
            setCurrentView(previousView);
          }}
          onNext={() => {
            console.log('Next step - room created');
            // Navigate to next step or back to home
            setSelectedBook(null);
            setCurrentView('home');
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 300,
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
    overflow: 'hidden',
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body2Regular,
    color: Colors.gray600,
    marginTop: Spacing.sm,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...Typography.body2Regular,
    color: Colors.error,
  },
});
