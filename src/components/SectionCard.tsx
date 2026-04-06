import type { PropsWithChildren, ReactNode } from 'react';

type SectionCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  action?: ReactNode;
  caption?: string;
}>;

export function SectionCard({
  eyebrow,
  title,
  action,
  children,
  caption,
}: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      <div className="section-card__body">{children}</div>
      <p className="caption">{caption}</p>
    </section>
  );
}
