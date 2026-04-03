type RecommendationPillProps = {
  children: string;
};

export function RecommendationPill({ children }: RecommendationPillProps) {
  return <li className="pill">{children}</li>;
}
