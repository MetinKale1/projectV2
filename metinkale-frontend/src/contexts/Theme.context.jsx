// src/contexts/Theme.context.jsx
import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { themes } from './theme';

const switchTheme = (theme) =>
  theme === themes.dark ? themes.light : themes.dark;

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    sessionStorage.getItem('themeMode') || themes.dark,
  );

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newThemeValue = switchTheme(theme);
    setTheme(newThemeValue);
    sessionStorage.setItem('themeMode', newThemeValue);
  }, [theme]);

  const value = useMemo(() => ({ theme, textTheme: switchTheme(theme), toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
