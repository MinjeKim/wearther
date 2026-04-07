import { MetricCard } from '../MetricCard';
import { SectionCard } from '../SectionCard';
import type { Coordinates, WeatherSnapshot } from '../../types';
import { getMetricHint } from '../../utils/weatherPresentation';

type LocationWeatherSectionProps = {
  loading: boolean;
  error: string | null;
  weather: WeatherSnapshot | null;
  coordinates: Coordinates | null;
  onRetry: () => void;
};

export function LocationWeatherSection({
  loading,
  error,
  weather,
  coordinates,
  onRetry,
}: LocationWeatherSectionProps) {
  return (
    <SectionCard eyebrow="Location & Weather" title="지금 나는?">
      {error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : loading ? (
        <div className="empty-state">
          <p>현재 위치와 날씨 데이터를 가져오는 중입니다.</p>
        </div>
      ) : weather && coordinates ? (
        <>
          <div className="location-row">
            <div>
              <strong>{weather.locationLabel}</strong>
            </div>
            <div className="temperature-chip">
              <strong>{Math.round(weather.currentTemperature)}°</strong>
              <span>체감 {Math.round(weather.apparentTemperature)}°</span>
            </div>
          </div>
          <div className="metric-grid">
            <MetricCard
              label="강수확률"
              value={`${Math.round(weather.precipitationProbability)}%`}
              hint={getMetricHint('rain', Math.round(weather.precipitationProbability))}
            />
            <MetricCard
              label="자외선"
              value={weather.uvIndex.toFixed(1)}
              hint={getMetricHint('uvIndex', weather.uvIndex.toFixed(1))}
            />
            <MetricCard
              label="미세먼지 PM10"
              value={`${Math.round(weather.pm10)} ㎍/m³`}
              hint={getMetricHint('pm10', Math.round(weather.pm10))}
            />
            <MetricCard
              label="초미세먼지 PM2.5"
              value={`${Math.round(weather.pm2_5)} ㎍/m³`}
              hint={getMetricHint('pm2_5', Math.round(weather.pm2_5))}
            />
            <MetricCard
              label="습도"
              value={`${Math.round(weather.humidity)}%`}
              hint={getMetricHint('humidity', weather.humidity)}
            />
            <MetricCard
              label="풍속"
              value={`${Math.round(weather.windSpeed)} km/h`}
              hint={getMetricHint('windSpeed', Math.round(weather.windSpeed))}
            />
          </div>
        </>
      ) : null}
    </SectionCard>
  );
}
