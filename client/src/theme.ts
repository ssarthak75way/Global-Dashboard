import { ThemeOptions, alpha } from '@mui/material/styles';

const glassMorphism = (mode: 'light' | 'dark') => ({
    background: mode === 'light'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(17, 24, 39, 0.7)',
    backdropFilter: 'blur(20px)',
    border: mode === 'light'
        ? '1px solid rgba(255, 255, 255, 0.3)'
        : '1px solid rgba(255, 255, 255, 0.05)',
});

export const getTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: '#6366f1', // Indigo 500
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ec4899', // Pink 500
            light: '#f472b6',
            dark: '#db2777',
            contrastText: '#ffffff',
        },
        background: {
            default: mode === 'light' ? '#f1f5f9' : '#030712', // Lighter gray for light mode, deep black/blue for dark
            paper: mode === 'light' ? '#ffffff' : '#111827',
        },
        text: {
            primary: mode === 'light' ? '#0f172a' : '#f9fafb',
            secondary: mode === 'light' ? '#475569' : '#9ca3af',
        },
        action: {
            hover: mode === 'light' ? alpha('#6366f1', 0.08) : alpha('#6366f1', 0.15),
            selected: mode === 'light' ? alpha('#6366f1', 0.12) : alpha('#6366f1', 0.25),
        },
        divider: mode === 'light' ? alpha('#94a3b8', 0.2) : alpha('#374151', 0.5),
    },
    typography: {
        fontFamily: '"Inter", "Outfit", system-ui, -apple-system, sans-serif',
        h1: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            fontSize: '3.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.2,
        },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
        },
        subtitle1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            fontWeight: 500,
        },
        subtitle2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: mode === 'light' ? '#cbd5e1 transparent' : '#374151 transparent',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: '8px',
                        backgroundColor: mode === 'light' ? '#cbd5e1' : '#374151',
                        border: '3px solid transparent',
                        backgroundClip: 'content-box',
                    },
                    '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.5)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                        boxShadow: '0 8px 20px -4px rgba(236, 72, 153, 0.5)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                },
                elevation2: {
                    boxShadow: mode === 'light'
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    border: mode === 'light' ? '1px solid rgba(226, 232, 240, 0.5)' : '1px solid rgba(31, 41, 55, 0.5)',
                    backdropFilter: 'blur(10px)',
                    background: mode === 'light' ? '#ffffff' : '#1f2937',
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: mode === 'light'
                            ? '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)'
                            : '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        transition: 'all 0.2s',
                        '& fieldset': {
                            borderColor: mode === 'light' ? '#e2e8f0' : '#374151',
                        },
                        '&:hover fieldset': {
                            borderColor: '#6366f1',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                            borderColor: '#6366f1',
                            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    fontWeight: 500,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid',
                    borderColor: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.3)',
                    backgroundColor: mode === 'light' ? '#ffffff' : '#111827',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    ...glassMorphism(mode),
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.3)',
                },
            },
        },
    },
});
