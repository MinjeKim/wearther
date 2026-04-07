import type { WeatherSnapshot } from '../types';
import { formatObservationTime } from '../utils/weatherPresentation';

type HeroPanelProps = {
  loading: boolean;
  error: string | null;
  weather: WeatherSnapshot | null;
};

export function HeroPanel({ loading, error, weather }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <p className="status-badge">
        {loading ? '데이터를 불러오는 중' : error ? '확인이 필요함' : '실시간 추천 준비 완료'}
      </p>
      <strong>
        {weather ? weather.locationLabel : '위치 정보를 확인하면 맞춤 추천이 시작됩니다.'}
      </strong>
      <p>
        {weather
          ? `${weather.isDay ? '주간' : '야간'} 기준 ${formatObservationTime(
              weather.observationTime,
            )} 관측값`
          : '브라우저 위치 권한을 허용하면 현재 위치에 맞는 날씨와 추천 정보를 표시합니다.'}
      </p>
    </section>
  );
}
