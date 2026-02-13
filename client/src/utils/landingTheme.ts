import { Theme } from '@mui/material';

/**
 * Get theme-aware colors for landing page components
 * Returns appropriate colors based on current theme mode
 */
export const getLandingColors = (theme: Theme) => {
    const isDark = theme.palette.mode === 'dark';

    return {
        // Backgrounds
        bg: isDark ? '#000' : '#ffffff',
        bgAlt: isDark ? '#050505' : '#f8fafc',
        bgCard: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)',
        bgCardHover: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)',
        bgDark: isDark ? '#0d0d12' : '#e2e8f0',
        bgDarker: isDark ? '#1a1a1e' : '#cbd5e1',

        // Text colors
        text: isDark ? '#ffffff' : '#1e293b',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        textMuted: isDark ? '#64748b' : '#94a3b8',
        textLight: isDark ? '#475569' : '#cbd5e1',

        // Brand colors (consistent across themes)
        primary: '#6366f1',
        secondary: '#a855f7',
        accent: '#ec4899',
        accentAlt: '#818cf8',

        // Border colors
        border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
        borderHover: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.4)',

        // Shadows
        shadow: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
        shadowHeavy: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)'
    };
};
