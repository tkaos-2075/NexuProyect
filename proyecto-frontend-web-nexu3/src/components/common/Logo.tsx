import { ReactNode } from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
}

export default function Logo({ 
  className = '', 
  onClick, 
  size = 'md',
  children 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-14 w-auto', 
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const containerClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div className={`flex items-center ${containerClasses} ${className}`} onClick={onClick}>
      <img 
        src="/logo-nexu.png" 
        alt="NexU Logo" 
        className={sizeClasses[size]}
      />
      {children}
    </div>
  );
} 