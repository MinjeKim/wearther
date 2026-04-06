export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WeatherSnapshot = {
  currentTemperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  pm10: number;
  pm2_5: number;
  usAqi: number;
  isDay: boolean;
  locationLabel: string;
  observationTime: string;
};

export type ClothingCategory =
  | 'light'
  | 'layered'
  | 'warm'
  | 'rain-ready'
  | 'sun-ready';

export type ClothingRecommendation = {
  headline: string;
  summary: string;
  categories: ClothingCategory[];
  items: string[];
  caution: string;
};

export type ProductRecommendation = {
  id: string;
  title: string;
  subtitle: string;
  mallName: string;
  url: string;
  badge: string;
};

export type ThemeMode = 'morning' | 'day' | 'evening' | 'night';
export type ThemeWeather = 'clear' | 'cloudy' | 'rainy' | 'snowy';

export type Mall = {
  merchantId: string;
  siteName: string;
  searchUrlTemplate: string;
  // sub_category: string[];
  // note: string;
}

export type Item = {
  name: string;
  category: string;
  gender: ('male'|'female'|'unisex'); // 남성, 여성, 공용
  range: number[]; // 기온 범위, 기온과 관계 없을 때는 빈 배열
  special: ('rain'|'snow'|'dust'|'uv')[]; // 특별한 상황 (rain: 비, snow: 눈, dust: 미세먼지, uv: 자외선). 관계 없으면 빈 배열ㄴ
};
