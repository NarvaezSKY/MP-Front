import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__body">{children}</div>
    </div>
  );
}

export function Loader({ label = 'Cargando...' }: { label?: string }) {
  return <div className="loader">{label}</div>;
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="error-box">Error: {message}</div>;
}

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="dashboard-section">
      {title && <h2 className="dashboard-section__title">{title}</h2>}
      {children}
    </section>
  );
}
