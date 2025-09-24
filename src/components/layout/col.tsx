import React, { ReactNode } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const widthMap: Record<number, string> = {
  1: 'w-1/12',
  2: 'w-2/12',
  3: 'w-1/4',
  4: 'w-1/3',
  5: 'w-5/12',
  6: 'w-1/2',
  7: 'w-7/12',
  8: 'w-2/3',
  9: 'w-3/4',
  10: 'w-5/6',
  11: 'w-11/12',
  12: 'w-full',
};

interface ColProps {
  children: ReactNode;
  className?: string;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const Col: React.FC<ColProps> = ({ children, className = '', xs, sm, md, lg, xl }) => {
    const colClasses: string[] = [];

    const breakpoints: Record<Breakpoint, number | undefined> = { xs, sm, md, lg, xl };

    Object.entries(breakpoints).forEach(([bp, span]) => {
        if (span && span >= 1 && span <= 12) {
        const twClass = widthMap[span] ?? 'w-full';
        const prefix = bp === 'xs' ? '' : `${bp}:`;
        colClasses.push(`${prefix}${twClass}`);
        }
    });

    return (
        <div className={`${colClasses.join(' ')} ${className}`}>
            {children}
        </div>
    );
};

export default Col;
