import themeTokens from '../theme.json';
import type { WeatherSnapshot } from '../types';

type ThemeVariables = Record<string, string>;

type ThemeTokens = {
  timeOfDay: Record<'light' | 'dark', ThemeVariables>;
};

type TimeOfDay = keyof ThemeTokens['timeOfDay'];

const tokens = themeTokens as ThemeTokens;

export const resolveThemeVariables = (
  _weather: WeatherSnapshot | null,
): ThemeVariables => {
  const timeBucket = _weather?.isDay ? 'light' : 'dark';
  return tokens.timeOfDay[timeBucket];
};

export const applyThemeVariables = (variables: ThemeVariables) => {
  const root = document.documentElement;

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};
