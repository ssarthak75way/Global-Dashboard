import { useState, useEffect } from 'react';
import { Fab, Zoom, Box, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { pathname } = useLocation();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    // Automatic scroll to top on navigation
    useEffect(() => {
        window.scrollTo(0, 100);
    }, [pathname]);

    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.pageYOffset;
        if (totalScroll > 0) {
            setScrollProgress((currentScroll / totalScroll) * 100);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={scrollToTop}
                role="presentation"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Circular Progress Border */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: (theme) => `conic-gradient(${theme.palette.primary.main} ${scrollProgress}%, ${theme.palette.secondary.main} ${scrollProgress}%, ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${scrollProgress}% 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.1s linear',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: 'background.default',
                        }
                    }}
                />

                <Fab
                    color="primary"
                    size="small"
                    aria-label="scroll back to top"
                    sx={{
                        width: 48,
                        height: 48,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                        zIndex: 1
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Box>
        </Zoom>
    );
};

export default ScrollToTop;
