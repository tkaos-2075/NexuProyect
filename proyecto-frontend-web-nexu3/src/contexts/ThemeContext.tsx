import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useStorageState } from '@hooks/useStorageState';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [[isLoading, storedTheme], setStoredTheme] = useStorageState('theme');
  const [theme, setThemeState] = useState<Theme>('light');

  // Inicializar tema desde localStorage o preferencia del sistema
  useEffect(() => {
    if (!isLoading) {
      const savedTheme = storedTheme as Theme;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }
  }, [isLoading, storedTheme]);

  // Aplicar tema al documento
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-background', '#15202B');
      root.style.setProperty('--color-primary', '#1DA1F2');
      root.style.setProperty('--color-secondary', '#192734');
      root.style.setProperty('--color-tertiary', '#FFFFFF');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-background', '#FFFFFF');
      root.style.setProperty('--color-primary', '#1DA1F2');
      root.style.setProperty('--color-secondary', '#E1E8ED');
      root.style.setProperty('--color-tertiary', '#14171A');
    }
  };

  // Cambiar tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  // Alternar entre temas
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 