import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface SimpleToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
}

const typeColors: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#2563eb',
  warning: '#eab308',
};

export default function SimpleToast({ message, type = 'info', duration = 3000, onHide }: SimpleToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onHide && onHide());
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onHide, fadeAnim]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 32,
        left: 24,
        right: 24,
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        borderLeftColor: typeColors[type],
        borderRadius: 8,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        opacity: fadeAnim,
        zIndex: 9999,
      }}
      pointerEvents="none"
    >
      <Text style={{ color: '#374151', fontSize: 14 }}>{message}</Text>
    </Animated.View>
  );
} 