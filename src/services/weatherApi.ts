import type { Coordinates, WeatherSnapshot } from '../types';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const REVERSE_GEOCODING_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

type ForecastResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    is_day: number;
  };
};

type AirQualityResponse = {
  current: {
    uv_index: number;
    pm10: number;
    pm2_5: number;
    us_aqi: number;
  };
};

type ReverseGeocodingResponse = {
  address?: {
    city?: string;
    borough?: string;
    county?: string;
    town?: string;
    suburb?: string;
    state?: string;
  };
};

const toQueryString = (params: Record<string, string | number>) =>
  new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {}),
  ).toString();

export const fetchWeatherSnapshot = async ({
  latitude,
  longitude,
}: Coordinates): Promise<WeatherSnapshot> => {
  const forecastUrl = `${WEATHER_BASE_URL}?${toQueryString({
    latitude,
    longitude,
    current:
      'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,is_day',
    timezone: 'auto',
    forecast_days: 1,
  })}`;

  const airQualityUrl = `${AIR_QUALITY_BASE_URL}?${toQueryString({
    latitude,
    longitude,
    current: 'uv_index,pm10,pm2_5,us_aqi',
    timezone: 'auto',
  })}`;

  const reverseGeocodingUrl = `${REVERSE_GEOCODING_BASE_URL}?${toQueryString({
    lat: latitude,
    lon: longitude,
    format: 'jsonv2',
    'accept-language': 'ko',
  })}`;

  const [forecastResponse, airQualityResponse, reverseGeocodingResponse] = await Promise.all([
    fetch(forecastUrl),
    fetch(airQualityUrl),
    fetch(reverseGeocodingUrl),
  ]);

  if (!forecastResponse.ok || !airQualityResponse.ok) {
    throw new Error('날씨 정보를 불러오지 못했습니다.');
  }

  const forecastData = (await forecastResponse.json()) as ForecastResponse;
  const airQualityData = (await airQualityResponse.json()) as AirQualityResponse;
  const reverseGeocodingData = reverseGeocodingResponse.ok
    ? ((await reverseGeocodingResponse.json()) as ReverseGeocodingResponse)
    : undefined;
  const address = reverseGeocodingData?.address;
  const locationLabel = [
    address?.city ?? address?.state ?? address?.county ?? address?.town,
    address?.borough ?? address?.county ?? address?.suburb ?? address?.town,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    currentTemperature: forecastData.current.temperature_2m,
    apparentTemperature: forecastData.current.apparent_temperature,
    precipitationProbability: forecastData.current.precipitation_probability,
    weatherCode: forecastData.current.weather_code,
    windSpeed: forecastData.current.wind_speed_10m,
    humidity: forecastData.current.relative_humidity_2m,
    uvIndex: airQualityData.current.uv_index,
    pm10: airQualityData.current.pm10,
    pm2_5: airQualityData.current.pm2_5,
    usAqi: airQualityData.current.us_aqi,
    isDay: forecastData.current.is_day === 1,
    locationLabel: locationLabel || '현재 위치',
    observationTime: forecastData.current.time,
  };
};
