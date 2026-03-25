import React from 'react';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';

interface PlanCardProps {
  plan: PlansResponseDto;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => (
  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 mb-2">
    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{plan.name}</h4>
    {plan.description && (
      <p className="text-gray-700 dark:text-gray-300 mb-1">{plan.description}</p>
    )}
    {plan.startDate && (
      <p className="text-xs text-gray-500 dark:text-gray-400">Inicio: {plan.startDate}</p>
    )}
    {plan.endDate && (
      <p className="text-xs text-gray-500 dark:text-gray-400">Fin: {plan.endDate}</p>
    )}
    <p className="text-xs text-gray-500 dark:text-gray-400">Visibilidad: {plan.visibility}</p>
  </div>
);

export default PlanCard; 