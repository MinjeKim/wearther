import type {
  ClothingCategory,
  ClothingRecommendation,
  ProductRecommendation,
  WeatherSnapshot,
  Mall
} from '../types';
import { fetchDeeplinkUrl } from '../services/deeplinkApi';

const MALLS:Mall[] = [
  {
    merchantId: "gmarket",
    siteName: "G마켓",
    searchUrlTemplate: "https://www.gmarket.co.kr/n/search?keyword={keyword}",
  },
  {
    merchantId: "auction",
    siteName: "옥션",
    searchUrlTemplate: "https://www.auction.co.kr/n/search?keyword={keyword}",
  },
  {
    merchantId: "lotteon",
    siteName: "롯데온",
    searchUrlTemplate: "https://www.lotteon.com/csearch/search/search?render=search&q={keyword}",
  },
];

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

const getUrlForItem = async (item: string, mall: Mall): Promise<string> => {
  return fetchDeeplinkUrl(mall.merchantId, mall.searchUrlTemplate.replace('{keyword}', item));
}

export const getProductRecommendations = async (
  recommendation: ClothingRecommendation,
): Promise<ProductRecommendation[]> => {
  return Promise.all(
    recommendation.items.slice(0, 4).map(async (item, index) => {
      const mall = MALLS[Math.floor(Math.random() * MALLS.length)];
      return ({
        id: `${item}-${index}`,
        title: item,
        subtitle: `${recommendation.headline}에 맞춘 추천 검색 링크`,
        mallName: mall.siteName,
        url: await getUrlForItem(item, mall),
        badge: '추천 의류',
      })
    })
  );
}
