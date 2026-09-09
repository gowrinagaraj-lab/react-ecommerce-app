// ThemeButton.js
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

export default function ThemeButton() {
    // Directly extract context value without receiving props
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}