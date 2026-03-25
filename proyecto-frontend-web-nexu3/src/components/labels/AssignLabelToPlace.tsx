import React, { useEffect, useState } from 'react';
import { getAllLabels } from '@services/labels/getAllLabels';
import { assignLabelToPlace } from '@services/labels/assignLabelToPlace';
import { LabelsResponseDto } from '@interfaces/labels/LabelsResponseDto';
import { useToast } from '@components/ui/SimpleToast';

interface AssignLabelToPlaceProps {
  placeId: number;
  onAssigned?: () => void;
}

export default function AssignLabelToPlace({ placeId, onAssigned }: AssignLabelToPlaceProps) {
  const [labels, setLabels] = useState<LabelsResponseDto[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    getAllLabels().then(res => setLabels(res.data)).catch(() => setLabels([]));
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabel) return;
    setLoading(true);
    try {
      await assignLabelToPlace(Number(selectedLabel), placeId);
      showToast('Etiqueta asignada correctamente.', 'success');
      setSelectedLabel('');
      if (onAssigned) onAssigned();
    } catch (error) {
      showToast('Error al asignar la etiqueta. Intenta de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleAssign}
        className="flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-md"
      >
        <label
          htmlFor="label-select"
          className="font-medium text-gray-900 dark:text-white"
        >
          Asignar etiqueta:
        </label>
        <select
          id="label-select"
          value={selectedLabel}
          onChange={e => setSelectedLabel(e.target.value ? Number(e.target.value) : '')}
          className="border rounded px-2 py-1 text-gray-900 dark:text-white dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="" className="text-gray-500 dark:text-gray-300 dark:bg-gray-900">Selecciona una etiqueta</option>
          {labels.map(label => (
            <option key={label.id} value={label.id} className="text-gray-900 dark:text-white dark:bg-gray-900">
              {label.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition dark:bg-gray-900 dark:border dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
          disabled={loading || !selectedLabel}
        >
          {loading ? 'Asignando...' : 'Asignar'}
        </button>
      </form>
      <ToastContainer />
    </>
  );
} 