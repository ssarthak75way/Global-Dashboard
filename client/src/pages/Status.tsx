import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Stack, alpha, useTheme, Chip, LinearProgress } from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Wifi as WifiIcon,
    Storage as StorageIcon,
    Timeline as TimelineIcon,
    Dns as DnsIcon
} from '@mui/icons-material';
import PolicyLayout from '../components/common/PolicyLayout';

const Status: React.FC = () => {
    const theme = useTheme();
    const [uptime, setUptime] = useState(99.98);

    // Mock real-time variation
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(prev => Math.min(100, Math.max(99.9, prev + (Math.random() - 0.5) * 0.01)));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const services = [
        { name: 'Core API', status: 'Operational', latency: '42ms', icon: <WifiIcon /> },
        { name: 'Post Database', status: 'Operational', latency: '12ms', icon: <StorageIcon /> },
        { name: 'Social Feed Engine', status: 'Operational', latency: '28ms', icon: <TimelineIcon /> },
        { name: 'Asset Storage', status: 'Operational', latency: '85ms', icon: <DnsIcon /> }
    ];

    return (
        <PolicyLayout
            title="System Status"
            description="Real-time health of the D. Connect global infrastructure."
            lastUpdated={new Date().toLocaleTimeString()}
        >
            <Box sx={{ mb: 6 }}>
                <Box sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    border: '1px solid',
                    borderColor: alpha(theme.palette.success.main, 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4
                }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6" sx={{ color: theme.palette.success.dark, fontWeight: 700 }}>
                        All Systems Operational
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, borderRadius: '16px', bgcolor: alpha(theme.palette.background.default, 0.5), border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                            <Typography variant="overline" color="text.secondary">Global Uptime (30d)</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', my: 1 }}>{uptime.toFixed(2)}%</Typography>
                            <LinearProgress variant="determinate" value={uptime} sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.1) }} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, borderRadius: '16px', bgcolor: alpha(theme.palette.background.default, 0.5), border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                            <Typography variant="overline" color="text.secondary">Current Traffic</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main', my: 1 }}>High</Typography>
                            <Typography variant="body2" color="text.secondary">Stable under increased load</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <section>
                <h2>Service Metrics</h2>
                <Grid container spacing={2}>
                    {services.map((service, i) => (
                        <Grid item xs={12} key={i}>
                            <Box sx={{
                                p: 2,
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                bgcolor: alpha(theme.palette.background.default, 0.3),
                                '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.6) },
                                transition: 'all 0.2s'
                            }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ color: 'primary.main' }}>{service.icon}</Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{service.name}</Typography>
                                        <Typography variant="caption" color="text.disabled">Latency: {service.latency}</Typography>
                                    </Box>
                                </Stack>
                                <Chip
                                    label={service.status}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        color: 'success.main',
                                        fontWeight: 700,
                                        fontSize: '0.65rem'
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </section>

            <section>
                <h2>Incident History</h2>
                <Box sx={{ color: 'text.disabled', py: 2, textAlign: 'center' }}>
                    <Typography variant="body2">No major incidents reported in the last 90 days.</Typography>
                </Box>
            </section>
        </PolicyLayout>
    );
};

export default Status;
