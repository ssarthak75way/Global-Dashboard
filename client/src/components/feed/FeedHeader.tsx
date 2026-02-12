import { Box, Typography, Fade } from "@mui/material";

const FeedHeader = () => {
    const styles = {
        header: {
            mb: { xs: 3, sm: 6 },
            mt: { xs: 1, sm: 0 },
            textAlign: { xs: 'center', md: 'left' } // Center on mobile
        },
        title: {
            fontWeight: 900,
            letterSpacing: -1.5,
            mb: 1,
            // Fluid typography scaling
            fontSize: { xs: 'clamp(1.5rem, 8vw, 2rem)', sm: '2.5rem', md: '3rem' },
            wordBreak: 'break-word',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            lineHeight: 1.1
        },
        subtitle: {
            fontWeight: 500,
            color: "text.secondary",
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            maxWidth: { xs: '100%', md: '600px' },
            mx: { xs: 'auto', md: 0 }
        }
    };

    return (
        <Fade in timeout={800}>
            <Box sx={styles.header}>
                <Typography variant="h1" sx={styles.title}>
                    Social Feed
                </Typography>
                <Typography variant="body1" sx={styles.subtitle}>
                    Share your engineering journey, ask questions, and connect with the community.
                </Typography>
            </Box>
        </Fade>
    );
};

export default FeedHeader;