import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';

interface TerminalProps {
    children: React.ReactNode;
}

export const Terminal: React.FC<TerminalProps> = ({ children }) => {
    const styles = {
        terminal: {
            bgcolor: '#1e1e1e',
            color: '#d4d4d4',
            p: 3,
            borderRadius: 2,
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        },
        dots: {
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 1
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: '50%'
        },
        content: {
            mt: 4
        }
    };

    return (
        <Paper elevation={0} sx={styles.terminal}>
            <Box sx={styles.dots}>
                <Box sx={{ ...styles.dot, bgcolor: '#ff5f56' }} />
                <Box sx={{ ...styles.dot, bgcolor: '#ffbd2e' }} />
                <Box sx={{ ...styles.dot, bgcolor: '#27c93f' }} />
            </Box>
            <Box sx={styles.content}>
                {children}
            </Box>
        </Paper>
    );
};

interface TypingAnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
    children,
    className = '',
    delay = 0
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Extract text content if children is a string
    const textContent = typeof children === 'string' ? children : '';

    useEffect(() => {
        const visibilityTimer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(visibilityTimer);
    }, [delay]);

    useEffect(() => {
        if (!isVisible || !textContent) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= textContent.length) {
                setDisplayedText(textContent.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [textContent, isVisible]);

    if (!isVisible) return null;

    // If children is not a string, render it directly without typing animation
    if (typeof children !== 'string') {
        return (
            <Box component="div" className={className} sx={{ mb: 0.5 }}>
                {children}
            </Box>
        );
    }

    return (
        <Box component="div" className={className} sx={{ mb: 0.5 }}>
            {displayedText}
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: '8px',
                    height: '1em',
                    bgcolor: '#d4d4d4',
                    ml: 0.5,
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                        '0%, 49%': { opacity: 1 },
                        '50%, 100%': { opacity: 0 }
                    }
                }}
            />
        </Box>
    );
};

interface AnimatedSpanProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedSpan: React.FC<AnimatedSpanProps> = ({
    children,
    className = '',
    delay = 0
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!isVisible) return null;

    return (
        <Box
            component="div"
            className={className}
            sx={{
                mb: 0.5,
                animation: 'fadeIn 0.3s ease-in',
                '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(-5px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            }}
        >
            {children}
        </Box>
    );
};
