import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InteractiveMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>El mapa no está disponible en la versión web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 8,
  },
  text: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
}); 