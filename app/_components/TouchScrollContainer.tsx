import { forwardRef, HTMLAttributes } from 'react';

interface TouchScrollContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TouchScrollContainer = forwardRef<HTMLDivElement, TouchScrollContainerProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${className} overscroll-contain`}
        onTouchStart={(e) => {
          e.currentTarget.style.overflowY = 'auto';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.overflowY = 'hidden';
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchScrollContainer.displayName = 'TouchScrollContainer'; 