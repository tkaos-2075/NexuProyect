import React from 'react';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';
import PlanCard from './PlanCard';

interface ProfilePlansProps {
  plans: PlansResponseDto[];
  loading?: boolean;
}

const ProfilePlans: React.FC<ProfilePlansProps> = ({ plans, loading }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mis Planes</h2>
    {loading ? (
      <p className="text-gray-600 dark:text-gray-300">Cargando planes...</p>
    ) : plans.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-300">No tienes planes aún.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    )}
  </div>
);

export default ProfilePlans; 