// Galería simple de imágenes para un lugar en NexU
import { ImagePreview } from '@components/common';

interface GalleryProps {
  title: string;
  urls: string[];
  onImageClick: (url: string) => void;
  start?: number;
  end?: number;
}

export default function Gallery({ title, urls, onImageClick, start = 0, end = 6 }: GalleryProps) {
  if (!urls || urls.length === 0) return null;
  
  const displayUrls = urls.slice(start, end);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📸 {title}
      </h3>
      <ImagePreview
        images={displayUrls}
        onImageClick={onImageClick}
        maxDisplay={end - start}
        showCount={false}
      />
    </div>
  );
} 