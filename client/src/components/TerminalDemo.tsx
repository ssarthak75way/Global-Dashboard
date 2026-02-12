import React from 'react';
import { Box } from '@mui/material';
import { Terminal, TypingAnimation, AnimatedSpan } from './Terminal';

export const TerminalDemo: React.FC = () => {
    return (
        <Terminal>
            <TypingAnimation delay={0}>
                &gt; git clone https://github.com/YOUR_USERNAME/devconnect.git
            </TypingAnimation>

            <AnimatedSpan delay={1500} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Cloning into 'devconnect'...
            </AnimatedSpan>

            <AnimatedSpan delay={2000} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Repository cloned successfully
            </AnimatedSpan>

            <TypingAnimation delay={2500}>
                &gt; cd devconnect && npm install
            </TypingAnimation>

            <AnimatedSpan delay={4000} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Installing client dependencies...
            </AnimatedSpan>

            <AnimatedSpan delay={4500} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Installing server dependencies...
            </AnimatedSpan>

            <AnimatedSpan delay={5000} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Dependencies installed successfully
            </AnimatedSpan>

            <TypingAnimation delay={5500}>
                &gt; npm run dev
            </TypingAnimation>

            <AnimatedSpan delay={7000} className="text-blue">
                <Box component="span" sx={{ color: '#60a5fa' }}>ℹ</Box> Starting development servers...
            </AnimatedSpan>

            <AnimatedSpan delay={7500} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Server running on http://localhost:5000
            </AnimatedSpan>

            <AnimatedSpan delay={8000} className="text-green">
                <Box component="span" sx={{ color: '#4ade80' }}>✔</Box> Client running on http://localhost:5173
            </AnimatedSpan>

            <TypingAnimation delay={8500}>
                <Box component="span" sx={{ color: '#9ca3af' }}>
                    Success! DevConnect is ready for development.
                </Box>
            </TypingAnimation>

            <TypingAnimation delay={9500}>
                <Box component="span" sx={{ color: '#9ca3af' }}>
                    You may now start contributing to the project.
                </Box>
            </TypingAnimation>
        </Terminal>
    );
};

export default TerminalDemo;
