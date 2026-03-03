import React from 'react';
import css from './Segment.module.scss';

interface SegmentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Segment: React.FC<SegmentProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`${css.segment} ${className}`}>
      <div className={css.header}>
        <h2 className={css.title}>{title}</h2>
        <div className={css.line} />
      </div>
      <div className={css.content}>{children}</div>
    </div>
  );
};
