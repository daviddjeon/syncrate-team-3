import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface AppColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  divider: string;
  icon: string;
  inputBg: string;
  modalBackdrop: string;
  buttonBg: string;
  buttonText: string;
  activeSort: string;
  activeSortText: string;
}

const lightColors: AppColors = {
  background: '#F2F2F2',
  surface: '#E8E8E8',
  surfaceAlt: '#E0E0E0',
  card: '#C8C8C8',
  text: '#000',
  textSecondary: '#555',
  border: '#CCC',
  borderLight: '#DDD',
  divider: '#999',
  icon: '#000',
  inputBg: '#D3D3D3',
  modalBackdrop: 'rgba(0,0,0,0.3)',
  buttonBg: '#C8C8C8',
  buttonText: '#000',
  activeSort: '#333',
  activeSortText: '#FFF',
};

const darkColors: AppColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2A2A2A',
  card: '#2A2A2A',
  text: '#E0E0E0',
  textSecondary: '#999',
  border: '#444',
  borderLight: '#333',
  divider: '#444',
  icon: '#E0E0E0',
  inputBg: '#2A2A2A',
  modalBackdrop: 'rgba(0,0,0,0.6)',
  buttonBg: '#333',
  buttonText: '#E0E0E0',
  activeSort: '#E0E0E0',
  activeSortText: '#121212',
};

interface ThemeContextType {
  isDark: boolean;
  colors: AppColors;
  toggleTheme: () => void;
  setDark: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  setDark: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);
  const setDark = useCallback((val: boolean) => setIsDark(val), []);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
