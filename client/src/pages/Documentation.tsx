import React, { useState, useMemo } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Grid,
    useTheme,
    useMediaQuery,
    Fade,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Alert
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Code as CodeIcon,
    Layers as LayersIcon,
    Settings as SettingsIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Dashboard as DashboardIcon,
    Search as SearchIcon,
    RocketLaunch as RocketIcon,
    School as SchoolIcon,
    Api as ApiIcon,
    Lock as LockIcon,
    KeyboardArrowDown as ChevronIcon
} from '@mui/icons-material';
import {
    architecture,
    components,
    dependencies,
    features,
    pages,
    apiEndpoints,
    gettingStartedSteps,
    bestPractices
} from '../utils/data.tsx';
import TerminalDemo from '../components/TerminalDemo';
import CodeBlock from '../components/CodeBlock';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const Documentation: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredApiEndpoints = useMemo(() => {
        if (!searchQuery) return apiEndpoints;
        const query = searchQuery.toLowerCase();
        return apiEndpoints.filter(
            (endpoint) =>
                endpoint.path.toLowerCase().includes(query) ||
                endpoint.description.toLowerCase().includes(query) ||
                endpoint.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const colors = {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        bg: theme.palette.mode === 'light' ? '#f8fafc' : '#020617',
        glass: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)'
    };

    const styles = {
        root: {
            minHeight: '100vh',
            bgcolor: colors.bg,
            position: 'relative',
            overflow: 'hidden',
        },
        backgroundBlob: {
            position: 'fixed',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.15,
            zIndex: 0,
            pointerEvents: 'none',
        },
        container: {
            position: 'relative',
            zIndex: 1,
            pt: { xs: 4, md: 8 },
            pb: 8,
        },
        sidebar: {
            position: 'sticky',
            top: 100,
            height: 'fit-content',
            display: { xs: 'none', md: 'block' },
        },
        navPaper: {
            p: 1.5,
            borderRadius: 4,
            bgcolor: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        },
        mainContent: {
            pl: { md: 4 },
        },
        header: {
            mb: 6,
            textAlign: 'left',
        },
        title: {
            fontWeight: 900,
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
        },
        subtitle: {
            fontSize: '1.25rem',
            color: 'text.secondary',
            fontWeight: 500,
            maxWidth: '600px',
        },
        tab: {
            justifyContent: 'flex-start',
            textAlign: 'left',
            minHeight: 52,
            px: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            mb: 0.5,
            transition: 'all 0.2s',
            '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
            },
            '&:hover:not(.Mui-selected)': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
            }
        },
        contentPanel: {
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            bgcolor: colors.glass,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        },
        sectionTitle: {
            fontWeight: 800,
            fontSize: '1.75rem',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: 'text.primary',
        },
        card: {
            height: '100%',
            p: 3,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'light' ? 'white' : 'rgba(30, 41, 59, 0.5)',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-6px) scale(1.02)',
                boxShadow: theme.shadows[15],
                borderColor: colors.primary,
            }
        },
        methodBadge: (method: string) => ({
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'white',
            bgcolor:
                method === 'GET' ? '#10b981' :
                    method === 'POST' ? '#6366f1' :
                        method === 'PUT' ? '#f59e0b' :
                            method === 'DELETE' ? '#ef4444' : '#64748b'
        })
    };

    const apiByCategory = useMemo(() => {
        const grouped: Record<string, typeof apiEndpoints> = {};
        filteredApiEndpoints.forEach((endpoint) => {
            if (!grouped[endpoint.category]) {
                grouped[endpoint.category] = [];
            }
            grouped[endpoint.category].push(endpoint);
        });
        return grouped;
    }, [filteredApiEndpoints]);

    const renderTabs = () => (
        <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{
                '& .MuiTabs-flexContainer': { gap: 0.5 },
                border: 'none',
            }}
        >
            <Tab icon={<RocketIcon sx={{ fontSize: 20 }} />} label="Getting Started" iconPosition="start" sx={styles.tab} />
            <Tab icon={<DescriptionIcon sx={{ fontSize: 20 }} />} label="Overview" iconPosition="start" sx={styles.tab} />
            <Tab icon={<LayersIcon sx={{ fontSize: 20 }} />} label="Architecture" iconPosition="start" sx={styles.tab} />
            <Tab icon={<ApiIcon sx={{ fontSize: 20 }} />} label="API Reference" iconPosition="start" sx={styles.tab} />
            <Tab icon={<CodeIcon sx={{ fontSize: 20 }} />} label="Components" iconPosition="start" sx={styles.tab} />
            <Tab icon={<DashboardIcon sx={{ fontSize: 20 }} />} label="Pages" iconPosition="start" sx={styles.tab} />
            <Tab icon={<SchoolIcon sx={{ fontSize: 20 }} />} label="Best Practices" iconPosition="start" sx={styles.tab} />
            <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} label="Dependencies" iconPosition="start" sx={styles.tab} />
        </Tabs>
    );

    return (
        <Box sx={styles.root}>
            {/* Background Decorations */}
            <Box sx={{ ...styles.backgroundBlob, top: '-10%', left: '-10%', bgcolor: colors.primary }} />
            <Box sx={{ ...styles.backgroundBlob, bottom: '10%', right: '-10%', bgcolor: colors.secondary }} />
            <Box sx={{ ...styles.backgroundBlob, top: '40%', right: '20%', bgcolor: colors.accent, width: '400px', height: '400px', opacity: 0.1 }} />

            <Container maxWidth="lg" sx={styles.container}>
                <Grid container spacing={0}>
                    {/* Sticky Sidebar Navigation */}
                    <Grid item xs={12} md={3}>
                        <Box sx={styles.sidebar}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 2 }}>
                                <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                    Documentation
                                </Typography>
                                <Chip
                                    label="v1.0.0"
                                    size="small"
                                    onClick={() => { }} 
                                    sx={{
                                        fontWeight: 800,
                                        height: 24,
                                        fontSize: '0.65rem',
                                        bgcolor: `${colors.primary}15`,
                                        color: colors.primary,
                                        borderRadius: 1.5,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: `${colors.primary}25`,
                                            borderColor: `${colors.primary}40`,
                                            transform: 'translateY(-1px)'
                                        },
                                        '& .MuiChip-label': { px: 1, display: 'flex', alignItems: 'center', gap: 0.5 }
                                    }}
                                    icon={<ChevronIcon sx={{ fontSize: '1rem !important', color: `${colors.primary} !important` }} />}
                                />
                            </Box>
                            <Paper sx={styles.navPaper}>
                                {renderTabs()}
                            </Paper>

                            <Box sx={{ mt: 4, px: 2 }}>
                                <Alert icon={false} severity="info" sx={{ borderRadius: 3, bgcolor: `${colors.primary}10`, border: `1px solid ${colors.primary}20` }}>
                                    <Typography variant="caption" fontWeight={700} color="primary.main">
                                        V1.0.0 Stable Ready
                                    </Typography>
                                </Alert>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Main Content Area */}
                    <Grid item xs={12} md={9}>
                        <Box sx={styles.mainContent}>
                            {/* Modern Header */}
                            <Box sx={styles.header}>
                                <Fade in timeout={800}>
                                    <Box>
                                        <Typography variant="h1" sx={styles.title}>
                                            DevConnect
                                        </Typography>
                                        <Typography sx={styles.subtitle}>
                                            The ultimate platform for modern developers to build, connect, and showcase their journey.
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 3 }} flexWrap="wrap">
                                            {['React 18', 'TypeScript', 'Node.js', 'MUI 6'].map(tag => (
                                                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
                                            ))}
                                        </Stack>
                                    </Box>
                                </Fade>
                            </Box>

                            {/* Mobile Navigation */}
                            {isMobile && (
                                <Box sx={{ mb: 4 }}>
                                    <Paper sx={{ ...styles.navPaper, borderRadius: 3 }}>
                                        {renderTabs()}
                                    </Paper>
                                </Box>
                            )}

                            {/* Content Panels with Transitions */}
                            <Fade in key={tabValue} timeout={400}>
                                <Paper sx={styles.contentPanel}>
                                    {/* Getting Started */}
                                    <TabPanel value={tabValue} index={0}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <RocketIcon color="primary" sx={{ fontSize: 32 }} /> Getting Started
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                                            Accelerate your development cycle with our streamlined setup process.
                                        </Typography>

                                        <Box sx={{ mb: 6, borderRadius: 5, overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.1)' }}>
                                            <TerminalDemo />
                                        </Box>

                                        <Grid container spacing={3}>
                                            {gettingStartedSteps.map((step, idx) => (
                                                <Grid item xs={12} key={idx}>
                                                    <Box sx={{ ...styles.card, transform: 'none', '&:hover': { transform: 'translateY(-4px)' } }}>
                                                        <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>
                                                            {step.title}
                                                        </Typography>
                                                        <Typography paragraph color="text.secondary">{step.description}</Typography>
                                                        {step.code && <CodeBlock code={step.code} />}
                                                        {step.notes && (
                                                            <Stack spacing={1} sx={{ mt: 2 }}>
                                                                {step.notes.map((note, i) => (
                                                                    <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                                                                        <CheckCircleIcon sx={{ fontSize: 16, color: colors.accent }} />
                                                                        <Typography variant="body2" fontWeight={500}>{note}</Typography>
                                                                    </Stack>
                                                                ))}
                                                            </Stack>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TabPanel>

                                    {/* Overview */}
                                    <TabPanel value={tabValue} index={1}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <DescriptionIcon color="primary" sx={{ fontSize: 32 }} /> Project Overview
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                                            DevConnect is a decentralized hub designed to empower developers worldwide. It bridges the gap between professional growth and social interaction.
                                        </Typography>

                                        <Grid container spacing={3}>
                                            {features.map((feature, idx) => (
                                                <Grid item xs={12} md={6} key={idx}>
                                                    <Box sx={styles.card}>
                                                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {feature.title}
                                                        </Typography>
                                                        <List dense disablePadding>
                                                            {feature.items.map((item, i) => (
                                                                <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                                                        <CheckCircleIcon sx={{ fontSize: 16, color: colors.primary }} />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TabPanel>

                                    {/* Architecture */}
                                    <TabPanel value={tabValue} index={2}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <LayersIcon color="primary" sx={{ fontSize: 32 }} /> Architecture
                                        </Typography>

                                        <Stack spacing={3}>
                                            {architecture.map((layer, idx) => (
                                                <Box key={idx} sx={styles.card}>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="subtitle2" fontWeight={900} color="text.disabled" sx={{ textTransform: 'uppercase', mb: 0.5 }}>Layer</Typography>
                                                            <Typography variant="h6" fontWeight={800} color="primary.main">{layer.layer}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={8}>
                                                            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>{layer.description}</Typography>
                                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                                {layer.technologies.map(tech => (
                                                                    <Chip key={tech} label={tech} size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
                                                                ))}
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </TabPanel>

                                    {/* API Reference */}
                                    <TabPanel value={tabValue} index={3}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <ApiIcon color="primary" sx={{ fontSize: 32 }} /> API Explorer
                                        </Typography>

                                        <TextField
                                            fullWidth
                                            placeholder="Filter endpoints..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            sx={{
                                                mb: 4,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    bgcolor: 'action.hover',
                                                    border: 'none',
                                                    '& fieldset': { border: 'none' }
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: <SearchIcon sx={{ color: 'text.disabled', mr: 1 }} />
                                            }}
                                        />

                                        {Object.entries(apiByCategory).map(([category, endpoints]) => (
                                            <Box key={category} sx={{ mb: 6 }}>
                                                <Typography variant="h6" fontWeight={800} sx={{ mb: 3, px: 1, borderLeft: '4px solid', borderColor: colors.accent, color: 'text.primary' }}>
                                                    {category}
                                                </Typography>
                                                <Stack spacing={2}>
                                                    {endpoints.map((ep, idx) => (
                                                        <Accordion key={idx} sx={{
                                                            borderRadius: 3,
                                                            '&:before': { display: 'none' },
                                                            boxShadow: 'none',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            overflow: 'hidden',
                                                            '&.Mui-expanded': { border: `1px solid ${colors.primary}50` }
                                                        }}>
                                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                                <Stack direction="row" spacing={2} alignItems="center">
                                                                    <Box sx={styles.methodBadge(ep.method)}>{ep.method}</Box>
                                                                    <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'JetBrains Mono, monospace' }}>{ep.path}</Typography>
                                                                    {ep.auth && <LockIcon sx={{ fontSize: 14, color: 'error.main' }} />}
                                                                </Stack>
                                                            </AccordionSummary>
                                                            <AccordionDetails sx={{ pt: 0, px: 3, pb: 3 }}>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{ep.description}</Typography>
                                                                {ep.requestBody && <Box sx={{ mb: 2 }}><Typography variant="caption" fontWeight={800} sx={{ display: 'block', mb: 1 }}>Payload</Typography><CodeBlock code={ep.requestBody} /></Box>}
                                                                {ep.responseExample && <Box><Typography variant="caption" fontWeight={800} sx={{ display: 'block', mb: 1 }}>Response</Typography><CodeBlock code={ep.responseExample} /></Box>}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ))}
                                    </TabPanel>

                                    {/* Components */}
                                    <TabPanel value={tabValue} index={4}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <CodeIcon color="primary" sx={{ fontSize: 32 }} /> Core Components
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {Object.entries(components).flatMap(([_, items]) => items).map((comp, idx) => (
                                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                                    <Box sx={styles.card}>
                                                        <Typography variant="subtitle1" fontWeight={800} gutterBottom>{comp.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{comp.description}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TabPanel>

                                    {/* Pages */}
                                    <TabPanel value={tabValue} index={5}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <DashboardIcon color="primary" sx={{ fontSize: 32 }} /> Interface Map
                                        </Typography>
                                        <Grid container spacing={3}>
                                            {pages.map((p, idx) => (
                                                <Grid item xs={12} md={6} key={idx}>
                                                    <Box sx={styles.card}>
                                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>{p.icon}</Box>
                                                            <Box>
                                                                <Typography variant="h6" fontWeight={800}>{p.name}</Typography>
                                                                <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700, display: 'block', mb: 1 }}>{p.route}</Typography>
                                                                <Typography variant="body2" color="text.secondary">{p.description}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TabPanel>

                                    {/* Best Practices */}
                                    <TabPanel value={tabValue} index={6}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <SchoolIcon color="primary" sx={{ fontSize: 32 }} /> Developer Guidelines
                                        </Typography>
                                        <Stack spacing={4}>
                                            {bestPractices.map((section, idx) => (
                                                <Box key={idx}>
                                                    <Typography variant="h6" fontWeight={900} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary }} />
                                                        {section.category}
                                                    </Typography>
                                                    <Grid container spacing={3}>
                                                        {section.practices.map((p, i) => (
                                                            <Grid item xs={12} key={i}>
                                                                <Box sx={{ ...styles.card, borderLeft: `4px solid ${colors.secondary}` }}>
                                                                    <Typography variant="subtitle1" fontWeight={800} color="secondary.main" gutterBottom>{p.title}</Typography>
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{p.description}</Typography>
                                                                    {p.example && <CodeBlock code={p.example} />}
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </TabPanel>

                                    {/* Dependencies */}
                                    <TabPanel value={tabValue} index={7}>
                                        <Typography variant="h4" sx={styles.sectionTitle}>
                                            <SettingsIcon color="primary" sx={{ fontSize: 32 }} /> Built With
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                                            <Table>
                                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 800 }}>Dependency</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Version</TableCell>
                                                        <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dependencies.map((dep, idx) => (
                                                        <TableRow key={idx} hover>
                                                            <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{dep.name}</TableCell>
                                                            <TableCell><Chip label={dep.version} size="small" sx={{ fontWeight: 800, borderRadius: 1 }} /></TableCell>
                                                            <TableCell color="text.secondary">{dep.description}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </TabPanel>
                                </Paper>
                            </Fade>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Documentation;
