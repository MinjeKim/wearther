import { useEffect, useMemo, useState } from 'react';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { HeroHeader } from './components/HeroHeader';
import { HeroPanel } from './components/HeroPanel';
import { MobileFrame } from './components/MobileFrame';
import { ClothingGuideSection } from './components/sections/ClothingGuideSection';
import { LocationWeatherSection } from './components/sections/LocationWeatherSection';
import { ProductRecommendationSection } from './components/sections/ProductRecommendationSection';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeatherSnapshot } from './hooks/useWeatherSnapshot';
import { applyThemeVariables, resolveThemeVariables } from './utils/theme';
import { getClothingRecommendation, getProductRecommendations } from './utils/recommendation';

const COOKIE_CONSENT_STORAGE_KEY = 'wearther-cookie-consent';

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

    let cancelled = false;

    getProductRecommendations(
      clothingRecommendation,
      cookieConsent === 'accepted',
    ).then((nextProducts) => {
      if (!cancelled) {
        setProducts(nextProducts);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [clothingRecommendation, cookieConsent]);

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
    <MobileFrame
      header={<HeroHeader />}
      footer={
        <button
          type="button"
          className="primary-button primary-button--ghost"
          onClick={requestLocation}
        >
          위치 다시 확인
        </button>
      }
      reserveOverlaySpace={cookieConsent === null}
      floatingOverlay={
        cookieConsent === null ? (
          <CookieConsentBanner onSelect={handleCookieConsentSelect} />
        ) : null
      }
    >
      <HeroPanel loading={loading} error={error} weather={weather} />
      <LocationWeatherSection
        loading={loading}
        error={error}
        weather={weather}
        coordinates={coordinates}
        onRetry={requestLocation}
      />
      <ClothingGuideSection recommendation={clothingRecommendation} />
      <ProductRecommendationSection products={products} />
    </MobileFrame>
  );
}

export default App;
