type CookieConsentBannerProps = {
  onSelect: (value: 'accepted' | 'rejected') => void;
};

export function CookieConsentBanner({ onSelect }: CookieConsentBannerProps) {
  return (
    <section className="cookie-banner" aria-label="쿠키 사용 동의 배너">
      <div className="cookie-banner__copy">
        <strong>쿠키 사용 여부를 선택해 주세요.</strong>
        <p>
          본 웹사이트는 원활한 서비스 제공, 방문 통계 분석 및 맞춤형 콘텐츠 제공을 위해 쿠키를
          사용합니다. 자세한 내용은 쿠키 정책에서 확인하실 수 있으며, 계속 이용 시 쿠키 사용에
          동의한 것으로 봅니다.
        </p>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-option" onClick={() => onSelect('accepted')}>
          동의
        </button>
        <button type="button" className="cookie-option" onClick={() => onSelect('rejected')}>
          거부
        </button>
      </div>
    </section>
  );
}
