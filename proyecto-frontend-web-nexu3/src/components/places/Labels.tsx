// Muestra las etiquetas asociadas a un lugar en NexU
interface LabelsProps {
  labels: string[];
}

export default function Labels({ labels }: LabelsProps) {
  if (!labels || labels.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🏷️ Etiquetas
      </h3>
      <div className="flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
} 