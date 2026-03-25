import { ReactNode } from 'react';

interface FeatureLogoProps {
  className?: string;
  children?: ReactNode;
}

export default function FeatureLogo({ 
  className = '', 
  children 
}: FeatureLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Logo para características con animación de flotación */}
        <img 
          src="/logo-nexu.png" 
          alt="NexU Logo" 
          className="h-16 w-auto animate-airship drop-shadow-lg"
        />
        
        {/* Efecto de viento/estela más sutil */}
        <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-400/40 to-transparent rounded-full animate-pulse"></div>
        
        {/* Partículas flotantes más pequeñas */}
        <div className="absolute -top-2 -left-2 w-2 h-2 bg-white/20 rounded-full animate-bounce opacity-30 blur-sm"></div>
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white/15 rounded-full animate-bounce opacity-25 blur-sm" style={{ animationDelay: '0.8s' }}></div>
      </div>
      {children}
    </div>
  );
} 