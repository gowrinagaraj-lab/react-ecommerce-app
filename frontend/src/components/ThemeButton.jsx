// ThemeButton.js
import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

export default function ThemeButton() {
    // Directly extract context value without receiving props
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button
            style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            Current Theme: {theme}
        </button>
    );
}