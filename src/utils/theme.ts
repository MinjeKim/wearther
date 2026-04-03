import themeTokens from '../theme.json';
import type { WeatherSnapshot } from '../types';

type ThemeVariables = Record<string, string>;

type ThemeTokens = {
  timeOfDay: Record<'morning' | 'day' | 'evening' | 'night', ThemeVariables>;
  weather: Record<'clear' | 'cloudy' | 'rainy' | 'snowy', ThemeVariables>;
};

type TimeOfDay = keyof ThemeTokens['timeOfDay'];
type WeatherTheme = keyof ThemeTokens['weather'];

const tokens = themeTokens as ThemeTokens;

export const getClientTimeBucket = (date: Date): TimeOfDay => {
  const hours = date.getHours();

  if (hours >= 6 && hours < 11) return 'morning';
  if (hours >= 11 && hours < 17) return 'day';
  if (hours >= 17 && hours < 21) return 'evening';
  return 'night';
};

export const getWeatherTheme = (weather: WeatherSnapshot | null): WeatherTheme => {
  if (!weather) {
    return 'clear';
  }

  const code = weather.weatherCode;

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'snowy';
  }

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      code,
    ) ||
    weather.precipitationProbability >= 40
  ) {
    return 'rainy';
  }

  if ([1, 2, 3, 45, 48].includes(code)) {
    return 'cloudy';
  }

  return 'clear';
};

export const resolveThemeVariables = (
  weather: WeatherSnapshot | null,
  now: Date,
): ThemeVariables => {
  const timeBucket = getClientTimeBucket(now);
  const weatherTheme = getWeatherTheme(weather);

  return {
    ...tokens.timeOfDay[timeBucket],
    ...tokens.weather[weatherTheme],
  };
};

export const applyThemeVariables = (variables: ThemeVariables) => {
  const root = document.documentElement;

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
