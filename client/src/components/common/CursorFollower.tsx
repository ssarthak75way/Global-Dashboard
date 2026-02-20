import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Box, useTheme, alpha } from '@mui/material';

const CursorFollower: React.FC = () => {
    const theme = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Motion values for smooth tracking
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Adding spring physics for buttery smoothness
    const springConfig = { damping: 25, stiffness: 250 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        if (!isVisible) setIsVisible(true);

        // Check if hovering over interactive elements
        const target = e.target as HTMLElement;
        const isInteractive =
            target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="button"]') ||
            window.getComputedStyle(target).cursor === 'pointer';

        setIsHovering(!!isInteractive);
    }, [mouseX, mouseY, isVisible]);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        // Check for touch device to disable cursor follower
        const checkTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkTouch();
        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

    if (isTouchDevice) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{
                        x: springX,
                        y: springY,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: isHovering ? 60 : 32,
                        height: isHovering ? 60 : 32,
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        mixBlendMode: theme.palette.mode === 'dark' ? 'screen' : 'multiply',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'width 0.3s ease, height 0.3s ease'
                    }}
                >
                    {/* Inner Dot */}
                    <Box
                        component={motion.div}
                        animate={{
                            scale: isHovering ? 0.5 : 1,
                            backgroundColor: isHovering ? theme.palette.secondary.main : theme.palette.primary.main
                        }}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            boxShadow: `0 0 15px ${theme.palette.primary.main}`
                        }}
                    />

                    {/* Outer Glow / Ring */}
                    <Box
                        component={motion.div}
                        animate={{
                            scale: isHovering ? 1.5 : 1,
                            borderColor: isHovering ? alpha(theme.palette.secondary.main, 0.4) : alpha(theme.palette.primary.main, 0.3),
                            borderWidth: isHovering ? 2 : 1
                        }}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '1px solid',
                            boxShadow: isHovering ? `inset 0 0 20px ${alpha(theme.palette.secondary.main, 0.2)}` : 'none'
                        }}
                    />

                    {/* Aura Glow */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: -20,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                            filter: 'blur(10px)',
                            opacity: isHovering ? 0.8 : 0.4
                        }}
                    />
                </Box>
            )}
        </AnimatePresence>
    );
};

export default CursorFollower;
