// Utilidades para categorías de lugares: emoji, color y nombre legible

export function getCategoryEmoji(category: string) {
  const emojis: Record<string, string> = {
    'RESTAURANT': '🍽️',
    'PARK': '🌳',
    'GAMES': '🎮',
    'COFFEE': '☕'
  };
  return emojis[category] || '🍽️';
}

export function getTooltipColor(category: string) {
  const colors: Record<string, string> = {
    'RESTAURANT': '#ef4444',
    'PARK': '#10b981',
    'GAMES': '#06b6d4',
    'COFFEE': '#f59e0b'
  };
  return colors[category] || '#ef4444';
}

export function getCategoryName(category: string) {
  const names: Record<string, string> = {
    'RESTAURANT': 'Restaurante',
    'PARK': 'Parque',
    'GAMES': 'Juegos',
    'COFFEE': 'Café'
  };
  return names[category] || category;
} 