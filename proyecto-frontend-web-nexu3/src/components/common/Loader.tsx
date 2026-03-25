
interface LoaderProps {
  text?: string;
  size?: string; // e.g. 'text-2xl', 'text-4xl'
  colorClass?: string; // e.g. 'text-blue-600'
  className?: string;
}

export default function Loader({ text = "Cargando...", size = "text-2xl", colorClass = "text-blue-600", className = "" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin ${size} ${colorClass} mb-2`}>⏳</div>
      {text && <span className="text-gray-600 dark:text-gray-400 text-sm">{text}</span>}
    </div>
  );
} 