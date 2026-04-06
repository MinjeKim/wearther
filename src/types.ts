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
  id: string,
  name: string,
  url: string,
}