import { Box, Typography, Zoom } from "@mui/material";

interface ActivityStatCardProps {
    label: string;
    value: number | string;
    gradient: string;
    shadowColor: string;
    timeout: number;
    suffix?: string;
}

const ActivityStatCard = ({ label, value, gradient, shadowColor, timeout, suffix }: ActivityStatCardProps) => {
    return (
        <Zoom in timeout={timeout}>
            <Box sx={{
                p: 3,
                borderRadius: 1,
                background: gradient,
                boxShadow: `0 8px 32px ${shadowColor}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 12px 48px ${shadowColor.replace('0.35', '0.5')}`,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30%, -30%)',
                }
            }}>
                <Typography variant="caption" sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.7rem',
                    display: 'block',
                    mb: 1
                }}>
                    {label}
                </Typography>
                <Typography variant="h3" sx={{
                    fontWeight: 900,
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    letterSpacing: '-1px'
                }}>
                    {value}
                    {suffix && (
                        <Typography component="span" variant="h6" sx={{ ml: 1, fontWeight: 600, opacity: 0.9 }}>
                            {suffix}
                        </Typography>
                    )}
                </Typography>
            </Box>
        </Zoom>
    );
};

export default ActivityStatCard;
