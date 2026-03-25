import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlansResponseDto } from '@interfaces/plans/PlansResponseDto';
import PlanCard from '@components/plans/PlanCard';

interface ProfilePlansProps {
  plans: PlansResponseDto[];
}

const ProfilePlans: React.FC<ProfilePlansProps> = ({ plans }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mis Planes</Text>
      {plans.length === 0 ? (
        <Text style={styles.text}>No tienes planes aún.</Text>
      ) : (
        <View style={styles.listContent}>
          {plans.map(plan => (
            <PlanCard key={plan.id.toString()} plan={plan} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 18,
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  text: {
    color: '#64748b',
    fontSize: 15,
  },
  listContent: {
    gap: 8,
  },
});

export default ProfilePlans; 