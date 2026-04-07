import { ProductCard } from '../ProductCard';
import { SectionCard } from '../SectionCard';
import type { ProductRecommendation } from '../../types';

type ProductRecommendationSectionProps = {
  products: ProductRecommendation[];
};

export function ProductRecommendationSection({
  products,
}: ProductRecommendationSectionProps) {
  return (
    <SectionCard
      eyebrow="Shopping Link"
      title="상품 추천"
      caption="구매링크는 일부 제휴사의 제휴링크로 전환될 수 있으며, 이에 따른 일정액의 광고수수료를 제공받습니다."
    >
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
  );
}
