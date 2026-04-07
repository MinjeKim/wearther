import { RecommendationPill } from '../RecommendationPill';
import { SectionCard } from '../SectionCard';
import type { ClothingRecommendation } from '../../types';
import { categoryLabels } from '../../utils/weatherPresentation';

type ClothingGuideSectionProps = {
  recommendation: ClothingRecommendation | null;
};

export function ClothingGuideSection({ recommendation }: ClothingGuideSectionProps) {
  return (
    <SectionCard eyebrow="Clothing Guide" title="추천 옷차림">
      {recommendation ? (
        <div className="recommendation-layout">
          <div className="recommendation-copy">
            <strong>{recommendation.headline}</strong>
            <p>{recommendation.summary}</p>
            <small>{recommendation.caution}</small>
          </div>
          <ul className="pill-list">
            {recommendation.categories.map((category) => (
              <li key={category}>
                <RecommendationPill>{categoryLabels[category]}</RecommendationPill>
              </li>
            ))}
            {recommendation.items.map((item) => (
              <li key={item}>
                <RecommendationPill>{item}</RecommendationPill>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty-state">
          <p>날씨 데이터를 확인하면 온도와 공기질을 반영해 옷차림을 추천합니다.</p>
        </div>
      )}
    </SectionCard>
  );
}
