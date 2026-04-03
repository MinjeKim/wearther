import { useEffect, useMemo, useState } from 'react';
import { MetricCard } from './components/MetricCard';
import { MobileFrame } from './components/MobileFrame';
import { Modal } from './components/Modal';
import { ProductCard } from './components/ProductCard';
import { RecommendationPill } from './components/RecommendationPill';
import { SectionCard } from './components/SectionCard';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeatherSnapshot } from './hooks/useWeatherSnapshot';
import { applyThemeVariables, resolveThemeVariables } from './utils/theme';
import { getClothingRecommendation, getProductRecommendations } from './utils/recommendation';

const categoryLabels: Record<string, string> = {
  light: '가벼운 착장',
  layered: '레이어드',
  warm: '보온 중심',
  'rain-ready': '우천 대비',
  'sun-ready': '자외선 대비',
};

const formatCoordinate = (value: number) => value.toFixed(3);

const formatObservationTime = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [clientNow, setClientNow] = useState(() => new Date());
  const { coordinates, loading: locationLoading, error: locationError, requestLocation } =
    useGeolocation();
  const { data: weather, loading: weatherLoading, error: weatherError } =
    useWeatherSnapshot(coordinates);

  const clothingRecommendation = useMemo(
    () => (weather ? getClothingRecommendation(weather) : null),
    [weather],
  );
  const products = useMemo(
    () =>
      clothingRecommendation ? getProductRecommendations(clothingRecommendation) : [],
    [clothingRecommendation],
  );

  const loading = locationLoading || weatherLoading;
  const error = locationError ?? weatherError;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClientNow(new Date());
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    applyThemeVariables(resolveThemeVariables(weather, clientNow));
  }, [clientNow, weather]);

  return (
    <>
      <MobileFrame
        header={
          <div className="hero">
            <div>
              <p className="hero__eyebrow">Wearther</p>
              <h1>오늘 날씨에 맞는 옷차림과 쇼핑 링크</h1>
            </div>
            <button type="button" className="icon-button" onClick={() => setIsInfoOpen(true)}>
              안내
            </button>
          </div>
        }
        footer={
          <button type="button" className="primary-button primary-button--ghost" onClick={requestLocation}>
            위치 다시 확인
          </button>
        }
      >
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
          <p>
            클라이언트 시간 기준{' '}
            {new Intl.DateTimeFormat('ko-KR', {
              hour: 'numeric',
              minute: '2-digit',
            }).format(clientNow)}
            {' '}테마 적용 중
          </p>
        </section>

        <SectionCard eyebrow="Location & Weather" title="위치와 날씨 정보">
          {error ? (
            <div className="empty-state">
              <p>{error}</p>
              <button type="button" className="primary-button" onClick={requestLocation}>
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
                  <p>
                    위도 {formatCoordinate(coordinates.latitude)} / 경도{' '}
                    {formatCoordinate(coordinates.longitude)}
                  </p>
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
                  hint="외출 전 우산 여부"
                />
                <MetricCard
                  label="자외선"
                  value={weather.uvIndex.toFixed(1)}
                  hint="피부 노출 대비"
                />
                <MetricCard
                  label="미세먼지 PM10"
                  value={`${Math.round(weather.pm10)}`}
                  hint="㎍/m³"
                />
                <MetricCard
                  label="초미세먼지 PM2.5"
                  value={`${Math.round(weather.pm2_5)}`}
                  hint="㎍/m³"
                />
                <MetricCard
                  label="습도"
                  value={`${Math.round(weather.humidity)}%`}
                  hint="체감 쾌적도"
                />
                <MetricCard
                  label="풍속"
                  value={`${Math.round(weather.windSpeed)} km/h`}
                  hint="바람 영향"
                />
              </div>
            </>
          ) : null}
        </SectionCard>

        <SectionCard eyebrow="Clothing Guide" title="추천 옷차림">
          {clothingRecommendation ? (
            <div className="recommendation-layout">
              <div className="recommendation-copy">
                <strong>{clothingRecommendation.headline}</strong>
                <p>{clothingRecommendation.summary}</p>
                <small>{clothingRecommendation.caution}</small>
              </div>
              <ul className="pill-list">
                {clothingRecommendation.categories.map((category) => (
                  <RecommendationPill key={category}>
                    {categoryLabels[category]}
                  </RecommendationPill>
                ))}
                {clothingRecommendation.items.map((item) => (
                  <RecommendationPill key={item}>{item}</RecommendationPill>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <p>날씨 데이터를 확인하면 온도와 공기질을 반영해 옷차림을 추천합니다.</p>
            </div>
          )}
        </SectionCard>

        <SectionCard eyebrow="Shopping Link" title="상품 추천">
          {products.length > 0 ? (
            <div className="product-list">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>추천 옷차림이 결정되면 관련 상품 링크를 함께 보여줍니다.</p>
            </div>
          )}
        </SectionCard>
      </MobileFrame>

      <Modal title="서비스 안내" open={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
        <div className="modal-copy">
          <p>이 페이지는 브라우저 위치 권한을 기반으로 현재 위치의 날씨와 공기질 정보를 조회합니다.</p>
          <p>조회된 데이터는 Open-Meteo 공개 API를 기준으로 불러오며, 추천 로직은 체감온도, 강수확률, 자외선, 공기질을 함께 반영합니다.</p>
          <p>설정 페이지 대신 모달 안에서 권한 흐름과 동작 방식을 설명하도록 구성했습니다.</p>
        </div>
      </Modal>
    </>
  );
}

export default App;
