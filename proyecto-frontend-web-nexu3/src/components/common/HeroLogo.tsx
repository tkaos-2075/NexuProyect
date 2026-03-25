import { ReactNode } from 'react';

interface HeroLogoProps {
  className?: string;
  children?: ReactNode;
}

export default function HeroLogo({ 
  className = '', 
  children 
}: HeroLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Logo principal con animación de flotación */}
        <img 
          src="/home.png" 
          alt="NexU Logo" 
          className="h-72 md:h-96 lg:h-[28rem] xl:h-[32rem] w-auto animate-airship drop-shadow-2xl"
        />
        
        {/* Efecto de viento/estela */}
        <div className="absolute top-1/2 -right-6 w-12 h-1 bg-gradient-to-r from-blue-400/60 to-transparent rounded-full animate-pulse"></div>
        
        {/* Partículas flotantes muy sutiles */}
        <div className="absolute -top-6 -left-6 w-3 h-3 bg-white/10 rounded-full animate-bounce opacity-20 blur-md"></div>
        <div className="absolute -top-4 -right-4 w-2 h-2 bg-white/8 rounded-full animate-bounce opacity-15 blur-md" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute -bottom-4 -left-6 w-2.5 h-2.5 bg-white/12 rounded-full animate-bounce opacity-18 blur-md" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute -bottom-6 -right-6 w-2 h-2 bg-white/6 rounded-full animate-bounce opacity-12 blur-md" style={{ animationDelay: '2s' }}></div>
        
        {/* Efecto de luz muy sutil */}
        <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-300/20 rounded-full animate-pulse blur-md"></div>
      </div>
      {children}
    </div>
  );
} 