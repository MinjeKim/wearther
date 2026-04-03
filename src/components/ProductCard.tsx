import type { ProductRecommendation } from '../types';

type ProductCardProps = {
  product: ProductRecommendation;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      className="product-card"
      href={product.url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="product-card__badge">{product.badge}</span>
      <strong>{product.title}</strong>
      <p>{product.subtitle}</p>
      <span className="product-card__footer">
        <em>{product.mallName}</em>
        <span>보러가기</span>
      </span>
    </a>
  );
}
