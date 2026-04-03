import { useEffect, useState } from 'react';
import type { Coordinates } from '../types';

type GeolocationState = {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
};

const initialState: GeolocationState = {
  coordinates: null,
  loading: true,
  error: null,
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>(initialState);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: '이 브라우저는 위치 정보를 지원하지 않습니다.',
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.'
            : '위치를 확인하지 못했습니다. 네트워크나 GPS 상태를 확인해주세요.';

        setState({
          coordinates: null,
          loading: false,
          error: message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    ...state,
    requestLocation,
  };
};
