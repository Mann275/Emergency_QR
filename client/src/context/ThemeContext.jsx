import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme] = useState('light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('light-theme');
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
            {children}
        </ThemeContext.Provider>
    );
};
