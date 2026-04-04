import type { PropsWithChildren, ReactNode } from 'react';

type MobileFrameProps = PropsWithChildren<{
  header: ReactNode;
  footer?: ReactNode;
  floatingOverlay?: ReactNode;
}>;

export function MobileFrame({ header, footer, floatingOverlay, children }: MobileFrameProps) {
  return (
    <div className="app-shell">
      <div className="device-frame">
        <header className="topbar">{header}</header>
        <main className="content">{children}</main>
        {footer ? <footer className="footer">{footer}</footer> : null}
      </div>
      {floatingOverlay ? <div className="floating-overlay">{floatingOverlay}</div> : null}
    </div>
  );
}
