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

const COOKIE_CONSENT_STORAGE_KEY = 'wearther-cookie-consent';

const categoryLabels: Record<string, string> = {
  light: '가벼운 착장',
  layered: '레이어드',
  warm: '보온 중심',
  'rain-ready': '우천 대비',
  'sun-ready': '자외선 대비',
};

type Range = [number, number];

type MetricHintItem = {
  range: Range;
  label: string;
};

type MetricHints = {
  uvIndex: MetricHintItem[];
  rain: MetricHintItem[];
  pm10: MetricHintItem[];
  pm2_5: MetricHintItem[];
  humidity: MetricHintItem[];
  windSpeed: MetricHintItem[];
};

const formatCoordinate = (value: number) => value.toFixed(3);

const formatObservationTime = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const METRIC_HINTS:MetricHints = {
  uvIndex: [
    { range: [0, 2], label: '비타민 D 도핑 가능' },
    { range: [3, 5], label: '피부 탄력을 위해 썬크림은 필수!' },
    { range: [6, 7], label: '피부 다 죽는다...' },
    { range: [8, 10], label: '죽을지도모름' },
    { range: [11, Infinity], label: '연차쓰세요.' },
  ],
  rain: [
    { range: [0, 20], label: '비 맞으면 로또사셈' },
    { range: [21, 60], label: '홀~짝!' },
    { range: [61, 100], label: '짱큰장우산챙기세요' },
  ],
  pm10: [
    { range: [0, 22], label: '공기 싹싹김치' },
    { range: [23, 45], label: '이정도면 참고 나갈만 해' },
    { range: [46, 100], label: '꼭 나가야 할까요?' },
    { range: [101, Infinity], label: '공기청정기 야근특근' },
  ],
  pm2_5: [
    { range: [0, 9], label: '공기 싹싹김치' },
    { range: [10, 15], label: '이정도면 참고 나갈만 해' },
    { range: [16, 50], label: '꼭 나가야 할까요?' },
    { range: [51, Infinity], label: '공기청정기 야근특근' },
  ],
  humidity: [
    { range: [0, 29], label: '가습기 틀기 (밥솥가능)' },
    { range: [30, 60], label: '쾌적하네요 호호' },
    { range: [61, 80], label: '팡이제로 ㄱㄱ' },
    { range: [81, Infinity], label: '비왔거나, 비오거나' },
  ],
  windSpeed: [
    { range: [0, 1.5], label: '미니선풍기라도 틀어줄까?' },
    { range: [1.6, 5.4], label: '자연풍' },
    { range: [5.5, 10.7], label: '머리말리기 딱 좋다' },
    { range: [10.8, 17.1], label: '머리위를 조심하세요' },
    { range: [17.2, Infinity], label: '죽을지도 모릅니다' },
  ]
};

const getHint = (key: string, value: string | number): string => {
  return METRIC_HINTS[key as keyof MetricHints]?.find((item) => {
    const [min, max] = item.range;
    return Number(value) >= min && Number(value) <= max;
  })?.label ?? '';
};

function App() {
  const [clientNow, setClientNow] = useState(() => new Date());
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'rejected' | null>(null);
  const { coordinates, loading: locationLoading, error: locationError, requestLocation } =
    useGeolocation();
  const { data: weather, loading: weatherLoading, error: weatherError } =
    useWeatherSnapshot(coordinates);

  const clothingRecommendation = useMemo(
    () => (weather ? getClothingRecommendation(weather) : null),
    [weather],
  );
  const [products, setProducts] = useState<import('./types').ProductRecommendation[]>([]);

  useEffect(() => {
    if (!clothingRecommendation) {
      setProducts([]);
      return;
    }
    getProductRecommendations(clothingRecommendation).then(setProducts);
  }, [clothingRecommendation]);

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

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);

    if (storedConsent === 'accepted' || storedConsent === 'rejected') {
      setCookieConsent(storedConsent);
    }
  }, []);

  const handleCookieConsentSelect = (value: 'accepted' | 'rejected') => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    setCookieConsent(value);
  };

  return (
    <>
      <MobileFrame
        header={
          <div className="hero">
            <div>
              <p className="hero__eyebrow">Wearther</p>
              <h1>오늘 뭐 입어야 돼?</h1>
            </div>
          </div>
        }
        footer={
          <button type="button" className="primary-button primary-button--ghost" onClick={requestLocation}>
            위치 다시 확인
          </button>
        }
        reserveOverlaySpace={cookieConsent === null}
        floatingOverlay={
          cookieConsent === null ? (
            <section className="cookie-banner" aria-label="쿠키 사용 동의 배너">
              <div className="cookie-banner__copy">
                <strong>쿠키 사용 여부를 선택해 주세요.</strong>
                <p>본 웹사이트는 원활한 서비스 제공, 방문 통계 분석 및 맞춤형 콘텐츠 제공을 위해 쿠키를 사용합니다. 자세한 내용은 쿠키 정책에서 확인하실 수 있으며, 계속 이용 시 쿠키 사용에 동의한 것으로 봅니다.</p>
              </div>
              <div className="cookie-banner__actions">
                <button
                  type="button"
                  className="cookie-option"
                  onClick={() => handleCookieConsentSelect('accepted')}
                >
                  동의
                </button>
                <button
                  type="button"
                  className="cookie-option"
                  onClick={() => handleCookieConsentSelect('rejected')}
                >
                  거부
                </button>
              </div>
            </section>
          ) : null
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
        </section>

        <SectionCard eyebrow="Location & Weather" title="지금 나는?">
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
                  hint={getHint('rain', Math.round(weather.precipitationProbability))}
                />
                <MetricCard
                  label="자외선"
                  value={weather.uvIndex.toFixed(1)}
                  hint={getHint('uvIndex', weather.uvIndex.toFixed(1))}
                />
                <MetricCard
                  label="미세먼지 PM10"
                  value={`${Math.round(weather.pm10)} ㎍/m³`}
                  hint={getHint('pm10', Math.round(weather.pm10))}
                />
                <MetricCard
                  label="초미세먼지 PM2.5"
                  value={`${Math.round(weather.pm2_5)} ㎍/m³`}
                  hint={getHint('pm2_5', Math.round(weather.pm2_5))}
                />
                <MetricCard
                  label="습도"
                  value={`${Math.round(weather.humidity)}%`}
                  hint={getHint('humidity', weather.humidity)}
                />
                <MetricCard
                  label="풍속"
                  value={`${Math.round(weather.windSpeed)} km/h`}
                  hint={getHint('windSpeed', Math.round(weather.windSpeed))}
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
                  <li key={category}><RecommendationPill>{categoryLabels[category]}</RecommendationPill></li>
                ))}
                {clothingRecommendation.items.map((item) => (
                  <li key={item}><RecommendationPill>{item}</RecommendationPill></li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <p>날씨 데이터를 확인하면 온도와 공기질을 반영해 옷차림을 추천합니다.</p>
            </div>
          )}
        </SectionCard>

        <SectionCard 
          eyebrow="Shopping Link" 
          title="상품 추천" 
          caption='구매링크는 일부 제휴사의 제휴링크로 전환될 수 있으며, 이에 따른 일정액의 광고수수료를 제공받습니다.'>
          {products.length > 0 ? (
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>추천 옷차림이 결정되면 관련 상품 링크를 함께 보여줍니다.</p>
            </div>
          )}
        </SectionCard>
      </MobileFrame>
    </>
  );
}

export default App;
