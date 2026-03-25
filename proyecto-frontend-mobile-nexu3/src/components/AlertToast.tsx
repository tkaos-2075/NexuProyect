import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface AlertToastProps {
  message: string;
  onClose: () => void;
  duration?: number; // Si se quiere autocerrar
}

export default function AlertToast({ 
  message, 
  onClose, 
  duration = 4000 
}: AlertToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    let timeoutRef: number | undefined;
    if (duration) {
      timeoutRef = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onClose());
      }, duration);
    }
    
    return () => {
      if (timeoutRef !== undefined) {
        clearTimeout(timeoutRef);
      }
    };
  }, [duration, onClose, fadeAnim]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#dc2626', // Color rojo para permisos denegados
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9999,
        opacity: fadeAnim,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
        {message}
      </Text>
      <TouchableOpacity onPress={onClose} style={{ marginLeft: 16 }}>
        <Text style={{ color: '#fff', fontSize: 20 }}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
} 