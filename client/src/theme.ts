import { ThemeOptions } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#ec4899', // Pink 500
        },
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0a0f1d',
            paper: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
        },
        action: {
            hover: mode === 'light' ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.08)',
        }
    },
    typography: {
        fontFamily: '"Outfit", "Inter", "system-ui", sans-serif',
        h1: {
            fontWeight: 900,
            letterSpacing: '-0.03em',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            lineHeight: 1.1
        },
        h2: {
            fontWeight: 900,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            lineHeight: 1.2
        },
        h3: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: 1.2
        },
        h4: {
            fontWeight: 800,
            letterSpacing: '-0.01em',
            fontSize: 'clamp(1.25rem, 3vw, 2rem)'
        },
        subtitle1: {
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            fontWeight: 500
        },
        body1: {
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
            lineHeight: 1.6
        },
        button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 24px',
                    borderRadius: 4, // equivalent to borderRadius: 1 in sx
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 4,
                    border: mode === 'light' ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid rgba(51, 65, 85, 0.5)',
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
                        : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                },
                elevation1: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.2s ease-in-out',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366f1',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                        },
                    },
                },
            },
        },
    },
});
