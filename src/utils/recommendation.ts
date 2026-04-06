import type {
  ClothingCategory,
  ClothingRecommendation,
  ProductRecommendation,
  WeatherSnapshot,
  Mall
} from '../types';

const MALLS:Mall[] = [
  {id: "", name: "", url: "",}
];

const mallSearchUrls: Record<string, string> = {
  '반팔 티셔츠': 'https://www.musinsa.com/search/goods?keyword=%EB%B0%98%ED%8C%94%20%ED%8B%B0%EC%85%94%EC%B8%A0',
  '린넨 셔츠': 'https://www.29cm.co.kr/search?keyword=%EB%A6%B0%EB%84%A8%20%EC%85%94%EC%B8%A0',
  가디건: 'https://www.wconcept.co.kr/Search?keyword=%EA%B0%80%EB%94%94%EA%B1%B4',
  후드집업: 'https://www.musinsa.com/search/goods?keyword=%ED%9B%84%EB%93%9C%EC%A7%91%EC%97%85',
  트렌치코트: 'https://www.29cm.co.kr/search?keyword=%ED%8A%B8%EB%A0%8C%EC%B9%98%20%EC%BD%94%ED%8A%B8',
  경량패딩: 'https://www.wconcept.co.kr/Search?keyword=%EA%B2%BD%EB%9F%89%ED%8C%A8%EB%94%A9',
  우산: 'https://www.coupang.com/np/search?q=%EC%9A%B0%EC%82%B0',
  선글라스: 'https://www.musinsa.com/search/goods?keyword=%EC%84%A0%EA%B8%80%EB%9D%BC%EC%8A%A4',
  모자: 'https://www.29cm.co.kr/search?keyword=%EB%AA%A8%EC%9E%90',
};

const getAirQualityText = (aqi: number) => {
  if (aqi <= 50) return '공기질이 좋아 가벼운 외출에 무리가 없습니다.';
  if (aqi <= 100) return '공기질이 보통 수준이라 장시간 야외 활동은 조금만 조심하면 됩니다.';
  if (aqi <= 150) return '미세먼지가 다소 높아 마스크나 가벼운 보호 아이템이 있으면 좋습니다.';
  return '공기질이 좋지 않아 야외 활동 시간을 줄이는 편이 좋습니다.';
};

export const getClothingRecommendation = (
  weather: WeatherSnapshot,
): ClothingRecommendation => {
  const items = new Set<string>();
  const categories = new Set<ClothingCategory>();
  const feelsLike = weather.apparentTemperature;
  let headline = '쾌적하게 입기 좋은 날씨';
  let summary = '너무 두껍지 않은 기본 레이어 조합이 적당합니다.';

  if (feelsLike >= 27) {
    headline = '한여름에 가까운 체감 온도';
    summary = '통풍이 잘 되는 가벼운 소재 위주로 구성하는 편이 좋습니다.';
    categories.add('light');
    items.add('반팔 티셔츠');
    items.add('린넨 셔츠');
  } else if (feelsLike >= 20) {
    headline = '가볍게 입기 좋은 온도';
    summary = '얇은 상의나 셔츠 하나만으로도 충분할 가능성이 높습니다.';
    categories.add('light');
    categories.add('layered');
    items.add('반팔 티셔츠');
    items.add('가디건');
  } else if (feelsLike >= 12) {
    headline = '레이어드가 잘 맞는 날씨';
    summary = '낮과 저녁 차이를 고려해 얇은 겉옷을 챙기는 편이 좋습니다.';
    categories.add('layered');
    items.add('가디건');
    items.add('후드집업');
  } else if (feelsLike >= 5) {
    headline = '쌀쌀하게 느껴질 수 있는 날씨';
    summary = '보온이 되는 아우터가 필요합니다.';
    categories.add('warm');
    items.add('트렌치코트');
    items.add('후드집업');
  } else {
    headline = '강한 보온이 필요한 날씨';
    summary = '바람과 체감 온도를 고려하면 따뜻한 외투를 우선으로 보는 편이 좋습니다.';
    categories.add('warm');
    items.add('경량패딩');
    items.add('후드집업');
  }

  if (weather.precipitationProbability >= 45) {
    categories.add('rain-ready');
    items.add('우산');
    summary = `${summary} 비 가능성이 있어 방수나 우산 준비를 권장합니다.`;
  }

  if (weather.uvIndex >= 6) {
    categories.add('sun-ready');
    items.add('선글라스');
    items.add('모자');
  }

  return {
    headline,
    summary,
    categories: [...categories],
    items: [...items],
    caution: getAirQualityText(weather.usAqi),
  };
};

export const getProductRecommendations = (
  recommendation: ClothingRecommendation,
): ProductRecommendation[] =>
  recommendation.items.slice(0, 4).map((item, index) => ({
    id: `${item}-${index}`,
    title: item,
    subtitle: `${recommendation.headline}에 맞춘 추천 검색 링크`,
    mallName:
      item === '우산' ? 'Coupang' : item === '가디건' || item === '경량패딩' ? 'W Concept' : index % 2 === 0 ? 'MUSINSA' : '29CM',
    url: mallSearchUrls[item] ?? 'https://www.musinsa.com/',
    badge:
      item === '우산' || item === '선글라스' || item === '모자'
        ? '액세서리'
        : '추천 의류',
  }));
