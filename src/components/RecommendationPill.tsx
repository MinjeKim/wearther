import React from 'react';

type RecommendationPillProps = {
  children: string;
};

export const RecommendationPill: React.FC<RecommendationPillProps> = ({ children }) => {
  return <span className="pill">{children}</span>;
};
