/**
 * Aladin Open API Service
 * API 문서: http://www.aladin.co.kr/ttb/api/ItemList.aspx
 */

const ALADIN_API_KEY = 'ttbsang_a0_01255001';
const BASE_URL = 'http://www.aladin.co.kr/ttb/api';

// CORS 프록시 사용 (웹 개발 시에만 필요)
const USE_PROXY = true;
const PROXY_URL = 'https://corsproxy.io/?';

/**
 * 알라딘 공식 카테고리 매핑
 * 참고: http://www.aladin.co.kr/shop/common/wbest.aspx
 *
 * 카테고리별 주간 베스트셀러를 조회하기 위한 CategoryId
 * QueryType=Bestseller와 함께 사용
 */
const CATEGORY_MAP = {
  // 탭 표시 카테고리 (CATEGORY_LIST와 매칭)
  '종합': 0,          // 전체 카테고리
  '소설': 1,          // 소설
  '시/에세이': 50929, // 시/에세이
  '자기계발': 336,    // 자기계발
  '경제/경영': 170,   // 경제경영
  '인문': 656,        // 인문
  '건강/뷰티': 55889, // 건강/뷰티

  // 추가 카테고리 (필요시 CATEGORY_LIST에 추가 가능)
  '과학': 987,        // 과학
  '예술': 55890,      // 예술/대중문화
  '여행': 798,        // 여행
  '청소년': 1383,     // 청소년
  '요리': 1196,       // 요리
  // ❌ 제외: 어린이(1108), 종교(1237) - 서비스에서 사용하지 않음
};

/**
 * 카테고리 목록 (탭에 표시될 순서)
 * 대중적 인기도 순서로 정렬
 */
export const CATEGORY_LIST = [
  { id: 0, name: '종합', label: '종합' },              // 전체
  { id: 1, name: '소설', label: '소설' },              // 가장 인기
  { id: 50929, name: '시/에세이', label: '시/에세이' }, // 감성
  { id: 336, name: '자기계발', label: '자기계발' },     // 실용
  { id: 170, name: '경제/경영', label: '경제/경영' },   // 재테크
  { id: 656, name: '인문', label: '인문' },            // 교양
  { id: 55889, name: '건강/뷰티', label: '건강/뷰티' }, // 건강
];

/**
 * 저자명 정리 (목록 표시용)
 * - 괄호와 괄호 안 내용 제거: (지은이), (엮은이), (옮긴이) 등
 * - 쉼표로 구분된 여러 저자 중 첫 번째만 표시
 * @param {string} authorString - 원본 저자 문자열
 * @returns {string} 정리된 저자명
 */
function cleanAuthorName(authorString) {
  if (!authorString) return '';

  // 쉼표로 구분된 첫 번째 저자만 추출
  const firstAuthor = authorString.split(',')[0];

  // 괄호와 괄호 안의 내용 제거
  const cleanedAuthor = firstAuthor.replace(/\s*\([^)]*\)/g, '').trim();

  return cleanedAuthor;
}

/**
 * 저자명 정리 (상세페이지 표시용)
 * - (지은이)는 완전히 제거
 * - (엮은이), (원작), (번역) 등은 각 저자와 매칭하여 반환
 * @param {string} authorString - 원본 저자 문자열 (예: "홍길동 (엮은이), 김철수 (원작)")
 * @returns {Array} [{ name: '저자명', role: '역할' }, ...]
 */
export function formatAuthorForDetail(authorString) {
  if (!authorString) return [];

  const authors = [];

  // 쉼표로 구분된 각 저자 처리
  const authorParts = authorString.split(',').map(part => part.trim());

  authorParts.forEach(part => {
    // 저자명과 역할 추출
    const roleMatch = part.match(/\(([^)]+)\)/);
    const name = part.replace(/\s*\([^)]*\)/g, '').trim();
    const role = roleMatch ? roleMatch[1] : null;

    // 지은이가 아닌 경우에만 역할 포함
    if (role && role !== '지은이') {
      authors.push({ name, role });
    } else if (!role || role === '지은이') {
      // 역할이 없거나 지은이인 경우 이름만
      authors.push({ name, role: null });
    }
  });

  return authors;
}

/**
 * 베스트셀러 목록 조회
 * @param {string|number} category - 카테고리 이름 또는 CategoryId
 * @param {number} maxResults - 최대 결과 개수 (기본: 10)
 * @returns {Promise<Array>} 베스트셀러 목록
 */
export async function fetchBestsellers(category = '종합', maxResults = 10) {
  try {
    // categoryId 또는 category 이름으로 ID 찾기
    const categoryId = typeof category === 'number'
      ? category
      : (CATEGORY_MAP[category] || 0);

    console.log(`📚 베스트셀러 조회 - 카테고리: ${category} (ID: ${categoryId})`);

    const params = new URLSearchParams({
      ttbkey: ALADIN_API_KEY,
      QueryType: 'Bestseller',
      MaxResults: maxResults.toString(),
      start: '1',
      SearchTarget: 'Book',
      output: 'JS', // JSON 형식
      Version: '20131101',
      CategoryId: categoryId.toString(),
      Cover: 'Big', // 큰 이미지 (200px)
    });

    const apiUrl = `${BASE_URL}/ItemList.aspx?${params.toString()}`;
    const url = USE_PROXY ? `${PROXY_URL}${encodeURIComponent(apiUrl)}` : apiUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    // API 응답 데이터를 앱에서 사용하는 형식으로 변환
    if (data && data.item && Array.isArray(data.item)) {
      console.log(`✅ 베스트셀러 ${data.item.length}권 조회 성공`);

      const books = data.item.map((book, index) => ({
        rank: index + 1,
        title: book.title,
        author: cleanAuthorName(book.author), // 저자명 정리 (목록용)
        coverImage: book.cover,
        isbn: book.isbn13 || book.isbn,
        publisher: book.publisher,
        pubDate: book.pubDate,
        description: book.description,
        priceStandard: book.priceStandard,
        priceSales: book.priceSales,
        link: book.link,
        categoryId: categoryId, // 디버깅용
      }));

      // 첫 번째 책 정보 로그
      if (books.length > 0) {
        console.log(`📖 1위: ${books[0].title} - ${books[0].author}`);
      }

      return books;
    }

    console.warn('⚠️ API 응답에 데이터가 없습니다:', data);
    return [];
  } catch (error) {
    console.error('알라딘 API 호출 오류:', error);
    throw error;
  }
}

/**
 * 특정 도서 상세 정보 조회
 * @param {string} itemId - 도서 ISBN 또는 ItemId
 * @returns {Promise<Object>} 도서 상세 정보
 */
export async function fetchBookDetail(itemId) {
  try {
    const params = new URLSearchParams({
      ttbkey: ALADIN_API_KEY,
      itemIdType: 'ISBN13',
      ItemId: itemId,
      output: 'JS',
      Version: '20131101',
      OptResult: 'ebookList,usedList,reviewList',
      Cover: 'Big',
    });

    const apiUrl = `${BASE_URL}/ItemLookUp.aspx?${params.toString()}`;
    const url = USE_PROXY ? `${PROXY_URL}${encodeURIComponent(apiUrl)}` : apiUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.item && data.item.length > 0) {
      return data.item[0];
    }

    return null;
  } catch (error) {
    console.error('알라딘 도서 상세 조회 오류:', error);
    throw error;
  }
}

/**
 * 도서 검색
 * @param {string} query - 검색어
 * @param {string} queryType - 검색 타입 ('Keyword', 'Title', 'Author', 'Publisher')
 * @param {number} maxResults - 최대 결과 개수
 * @returns {Promise<Array>} 검색 결과
 */
export async function searchBooks(query, queryType = 'Keyword', maxResults = 20) {
  try {
    const params = new URLSearchParams({
      ttbkey: ALADIN_API_KEY,
      Query: query,
      QueryType: queryType,
      MaxResults: (maxResults * 2).toString(), // 필터링 후 충분한 결과를 위해 2배 요청
      start: '1',
      SearchTarget: 'Book',
      output: 'JS',
      Version: '20131101',
      Cover: 'Big',
    });

    const apiUrl = `${BASE_URL}/ItemSearch.aspx?${params.toString()}`;
    const url = USE_PROXY ? `${PROXY_URL}${encodeURIComponent(apiUrl)}` : apiUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.item && Array.isArray(data.item)) {
      // 제외할 카테고리 (만화책, 어린이)
      const excludedCategories = ['만화', '어린이', '코믹'];
      
      const filteredBooks = data.item
        .filter((book) => {
          // 카테고리명에 제외 키워드가 포함되어 있으면 필터링
          const categoryName = book.categoryName || '';
          return !excludedCategories.some(keyword => 
            categoryName.includes(keyword)
          );
        })
        .slice(0, maxResults) // 원래 요청한 개수만 반환
        .map((book) => ({
          title: book.title,
          author: cleanAuthorName(book.author), // 저자명 정리 (목록용)
          coverImage: book.cover,
          isbn: book.isbn13 || book.isbn,
          publisher: book.publisher,
          pubDate: book.pubDate,
          description: book.description,
          priceStandard: book.priceStandard,
          priceSales: book.priceSales,
          link: book.link,
        }));
      
      return filteredBooks;
    }

    return [];
  } catch (error) {
    console.error('알라딘 도서 검색 오류:', error);
    throw error;
  }
}
