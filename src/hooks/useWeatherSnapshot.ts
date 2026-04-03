import { useEffect, useState } from 'react';
import { fetchWeatherSnapshot } from '../services/weatherApi';
import type { Coordinates, WeatherSnapshot } from '../types';

type WeatherState = {
  data: WeatherSnapshot | null;
  loading: boolean;
  error: string | null;
};

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

export const useWeatherSnapshot = (coordinates: Coordinates | null) => {
  const [state, setState] = useState<WeatherState>(initialState);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await fetchWeatherSnapshot(coordinates);

        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : '날씨 데이터를 가져오는 중 문제가 발생했습니다.',
          });
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [coordinates]);

  return state;
};
