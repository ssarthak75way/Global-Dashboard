import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Fade, useTheme } from '@mui/material';

const QuoteBanner: React.FC = () => {
    const theme = useTheme();
    const [currentQuote, setCurrentQuote] = useState(0);

    const techQuotes = [
        "Code is like humor. When you have to explain it, it's bad. - Cory House",
        "First, solve the problem. Then, write the code. - John Johnson",
        "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
        "Knowledge is power. - Francis Bacon",
        "The best way to predict the future is to invent it. - Alan Kay",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % techQuotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [techQuotes.length]);

    const styles = {
        quoteBanner: {
            bgcolor: 'primary.main',
            color: 'white',
            py: 1.5,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
        }
    };

    return (
        <Box sx={styles.quoteBanner}>
            <Container maxWidth="lg">
                <Fade in key={currentQuote} timeout={1000}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                        {techQuotes[currentQuote]}
                    </Typography>
                </Fade>
            </Container>
        </Box>
    );
};

export default QuoteBanner;
