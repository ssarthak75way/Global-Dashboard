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
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Grid,
    Card,
    CardContent,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Alert,
    Badge
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
    ContentCopy as CopyIcon,
    RocketLaunch as RocketIcon,
    Security as SecurityIcon,
    School as SchoolIcon,
    Api as ApiIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon
} from '@mui/icons-material';
import {
    architecture,
    components,
    dependencies,
    features,
    pages,
    apiEndpoints,
    gettingStartedSteps,
    bestPractices,
    securityFeatures,
    developmentWorkflow
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
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSearchQuery(''); // Reset search when changing tabs
    };

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Filter API endpoints by search query
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

    const styles = {
        root: {
            minHeight: '100vh',
            bgcolor: 'background.default',
            py: 4
        },
        header: {
            mb: 4,
            textAlign: 'center',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '2px'
            }
        },
        title: {
            fontWeight: 900,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            pt: 2
        },
        versionChip: {
            fontWeight: 700,
            fontSize: '0.9rem'
        },
        searchBox: {
            mb: 3,
            '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900'
            }
        },
        paper: {
            p:4,
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[3]
        },
        sectionTitle: {
            fontWeight: 700,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        card: {
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[12],
                borderColor: 'primary.main'
            }
        },
        codeBlock: {
            position: 'relative',
            bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
            p: 2,
            borderRadius: 2,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflowX: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover .copy-button': {
                opacity: 1
            }
        },
        copyButton: {
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s'
        },
        methodChip: (method: string) => ({
            fontWeight: 700,
            minWidth: '70px',
            bgcolor:
                method === 'GET'
                    ? 'success.main'
                    : method === 'POST'
                        ? 'primary.main'
                        : method === 'PUT'
                            ? 'warning.main'
                            : method === 'DELETE'
                                ? 'error.main'
                                : 'info.main',
            color: 'white'
        }),
        stepCard: {
            mb: 2,
            p: 3,
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'divider',
            transition: 'all 0.3s',
            '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme.shadows[4]
            }
        }
    };

    // Group API endpoints by category
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

    return (
        <Box sx={styles.root}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={styles.header}>
                    <Typography variant="h2" sx={styles.title}>
                        DevConnect Documentation
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Comprehensive Developer Platform
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }} flexWrap="wrap">
                        <Chip label="Version 1.0.0" color="primary" sx={styles.versionChip} />
                        <Chip label="React 18" variant="outlined" />
                        <Chip label="TypeScript" variant="outlined" />
                        <Chip label="Material-UI 6" variant="outlined" />
                        <Chip label="Node.js" variant="outlined" />
                        <Chip label="MongoDB" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        Last Updated: February 12, 2026
                    </Typography>
                </Box>

                {/* Tabs */}
                <Paper sx={styles.paper}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
                    >
                        <Tab icon={<RocketIcon />} label="Getting Started" iconPosition="start" />
                        <Tab icon={<DescriptionIcon />} label="Overview" iconPosition="start" />
                        <Tab icon={<LayersIcon />} label="Architecture" iconPosition="start" />
                        <Tab icon={<ApiIcon />} label="API Reference" iconPosition="start" />
                        <Tab icon={<CodeIcon />} label="Components" iconPosition="start" />
                        <Tab icon={<DashboardIcon />} label="Pages" iconPosition="start" />
                        <Tab icon={<SchoolIcon />} label="Best Practices" iconPosition="start" />
                        <Tab icon={<SettingsIcon />} label="Dependencies" iconPosition="start" />
                    </Tabs>

                    {/* Getting Started Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <RocketIcon /> Getting Started
                        </Typography>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Follow these steps to set up DevConnect on your local machine and start contributing. Make sure you have Node.js 18+, npm 9+, and MongoDB installed.
                        </Alert>

                        {/* Animated Terminal Demo */}
                        <Box sx={{ mb: 4, p: 4 }}>
                            <TerminalDemo />
                        </Box>

                        <Divider sx={{ my: 4 }}>
                            <Chip label="Detailed Setup Guide" />
                        </Divider>

                        {gettingStartedSteps.map((step, index) => (
                            <Box key={index} sx={styles.stepCard}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                                    {step.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    {step.description}
                                </Typography>

                                {step.code && (
                                    <CodeBlock code={step.code} />
                                )}

                                {step.notes && step.notes.length > 0 && (
                                    <List dense sx={{ mt: 2 }}>
                                        {step.notes.map((note, idx) => (
                                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={note} />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        ))}
                    </TabPanel>

                    {/* Overview Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <DescriptionIcon /> Project Overview
                        </Typography>
                        <Typography paragraph>
                            DevConnect is a comprehensive developer platform that combines social networking,
                            productivity tools, and professional portfolio management. Built with modern web
                            technologies, it provides developers with a centralized hub to showcase their work,
                            track their progress, and connect with a global community.
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Key Features
                        </Typography>
                        <Grid container spacing={2}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card sx={styles.card}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                                {feature.title}
                                            </Typography>
                                            <List dense>
                                                {feature.items.map((item, idx) => (
                                                    <ListItem key={idx} sx={{ py: 0.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                            <CheckCircleIcon color="primary" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={item} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Security Features
                        </Typography>
                        <Grid container spacing={2}>
                            {securityFeatures.map((section, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card sx={styles.card}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'error.main' }}>
                                                {section.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {section.description}
                                            </Typography>
                                            <List dense>
                                                {section.features.map((feature, idx) => (
                                                    <ListItem key={idx} sx={{ py: 0.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                            <CheckCircleIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    {/* Architecture Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <LayersIcon /> System Architecture
                        </Typography>
                        <Typography paragraph>
                            DevConnect follows a modern, layered architecture pattern with clear separation of concerns.
                        </Typography>

                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Layer</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell><strong>Technologies</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {architecture.map((layer, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell sx={{ fontWeight: 600 }}>{layer.layer}</TableCell>
                                            <TableCell>{layer.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                    {layer.technologies.map((tech, idx) => (
                                                        <Chip key={idx} label={tech} size="small" variant="outlined" />
                                                    ))}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Project Structure
                        </Typography>
                        <Box sx={styles.codeBlock}>
                            <IconButton
                                size="small"
                                className="copy-button"
                                sx={styles.copyButton}
                                onClick={() => handleCopyCode(`client/
├── src/
│   ├── api/              # API configuration
│   ├── components/       # Reusable components
│   │   ├── landing/     # Landing page components
│   │   ├── profile/     # Profile components
│   │   ├── feed/        # Feed components
│   │   ├── dashboard/   # Dashboard components
│   │   └── board/       # Board components
│   ├── context/         # React Context providers
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── theme.ts         # MUI theme configuration
│   └── App.tsx          # Main app component
├── package.json
└── vite.config.ts`, 'structure')}
                            >
                                <Tooltip title={copiedCode === 'structure' ? 'Copied!' : 'Copy code'}>
                                    <CopyIcon fontSize="small" />
                                </Tooltip>
                            </IconButton>
                            <pre style={{ margin: 0 }}>{`client/
├── src/
│   ├── api/              # API configuration
│   ├── components/       # Reusable components
│   │   ├── landing/     # Landing page components
│   │   ├── profile/     # Profile components
│   │   ├── feed/        # Feed components
│   │   ├── dashboard/   # Dashboard components
│   │   └── board/       # Board components
│   ├── context/         # React Context providers
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── theme.ts         # MUI theme configuration
│   └── App.tsx          # Main app component
├── package.json
└── vite.config.ts`}</pre>
                        </Box>
                    </TabPanel>

                    {/* API Reference Tab */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <ApiIcon /> API Reference
                        </Typography>
                        <Typography paragraph>
                            Complete REST API documentation with request/response examples for all endpoints.
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder="Search API endpoints..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={styles.searchBox}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {Object.entries(apiByCategory).map(([category, endpoints]) => (
                            <Accordion key={category} defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        <Badge badgeContent={endpoints.length} color="primary" sx={{ mr: 2 }}>
                                            {category}
                                        </Badge>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        {endpoints.map((endpoint, idx) => (
                                            <Card key={idx} variant="outlined">
                                                <CardContent>
                                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                                        <Chip label={endpoint.method} size="small" sx={styles.methodChip(endpoint.method)} />
                                                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                            {endpoint.path}
                                                        </Typography>
                                                        {endpoint.auth ? (
                                                            <Tooltip title="Requires authentication">
                                                                <LockIcon fontSize="small" color="error" />
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Public endpoint">
                                                                <LockOpenIcon fontSize="small" color="success" />
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        {endpoint.description}
                                                    </Typography>

                                                    {endpoint.requestBody && (
                                                        <>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                                                Request Body:
                                                            </Typography>
                                                            <CodeBlock code={endpoint.requestBody} />
                                                        </>
                                                    )}

                                                    {endpoint.responseExample && (
                                                        <>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>
                                                                Response Example:
                                                            </Typography>
                                                            <CodeBlock code={endpoint.responseExample} />
                                                        </>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </TabPanel>

                    {/* Components Tab */}
                    <TabPanel value={tabValue} index={4}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <CodeIcon /> Component Library
                        </Typography>
                        <Typography paragraph>
                            DevConnect uses a modular component architecture with reusable, well-documented components.
                        </Typography>

                        {Object.entries(components).map(([category, items], index) => (
                            <Accordion key={index} defaultExpanded={index === 0}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {category} ({items.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        {items.map((component, idx) => (
                                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                                <Card variant="outlined" sx={{ height: '100%' }}>
                                                    <CardContent>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                                            <CodeIcon color="primary" fontSize="small" />
                                                            <Typography sx={{ fontWeight: 600 }}>{component.name}</Typography>
                                                        </Stack>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {component.description}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </TabPanel>

                    {/* Pages Tab */}
                    <TabPanel value={tabValue} index={5}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <DashboardIcon /> Application Pages
                        </Typography>
                        <Typography paragraph>
                            DevConnect consists of {pages.length} main pages, each serving a specific purpose in the user journey.
                        </Typography>

                        <Grid container spacing={2}>
                            {pages.map((page, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card sx={styles.card}>
                                        <CardContent>
                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                                {page.icon}
                                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                    {page.name}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {page.description}
                                            </Typography>
                                            <Chip label={page.route} size="small" variant="outlined" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </TabPanel>

                    {/* Best Practices Tab */}
                    <TabPanel value={tabValue} index={6}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <SchoolIcon /> Best Practices
                        </Typography>
                        <Typography paragraph>
                            Follow these best practices to maintain code quality, performance, and security in DevConnect.
                        </Typography>

                        {bestPractices.map((section, index) => (
                            <Accordion key={index} defaultExpanded={index === 0}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {section.category}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={3}>
                                        {section.practices.map((practice, idx) => (
                                            <Box key={idx}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                                                    {practice.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {practice.description}
                                                </Typography>
                                                {practice.example && (
                                                    <Box sx={styles.codeBlock}>
                                                        <IconButton
                                                            size="small"
                                                            className="copy-button"
                                                            sx={styles.copyButton}
                                                            onClick={() => handleCopyCode(practice.example!, `bp-${index}-${idx}`)}
                                                        >
                                                            <Tooltip title={copiedCode === `bp-${index}-${idx}` ? 'Copied!' : 'Copy'}>
                                                                <CopyIcon fontSize="small" />
                                                            </Tooltip>
                                                        </IconButton>
                                                        <pre style={{ margin: 0 }}>{practice.example}</pre>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Development Workflow
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                            Git Workflow
                                        </Typography>
                                        <List dense>
                                            {developmentWorkflow.gitWorkflow.map((item, idx) => (
                                                <ListItem key={idx} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {item.step}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {item.description}
                                                    </Typography>
                                                    {item.command !== '# Edit files, test locally' && item.command !== '# Create PR on GitHub' && item.command !== '# Wait for review and approval' && (
                                                        <Box sx={{ ...styles.codeBlock, width: '100%', p: 1 }}>
                                                            <pre style={{ margin: 0, fontSize: '0.75rem' }}>{item.command}</pre>
                                                        </Box>
                                                    )}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                            Testing Strategy
                                        </Typography>
                                        <List dense>
                                            {developmentWorkflow.testingStrategy.map((item, idx) => (
                                                <ListItem key={idx}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircleIcon color="primary" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                            Deployment Process
                                        </Typography>
                                        <List dense>
                                            {developmentWorkflow.deploymentProcess.map((item, idx) => (
                                                <ListItem key={idx}>
                                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                                        <CheckCircleIcon color="success" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Dependencies Tab */}
                    <TabPanel value={tabValue} index={7}>
                        <Typography variant="h5" sx={styles.sectionTitle}>
                            <SettingsIcon /> Dependencies
                        </Typography>
                        <Typography paragraph>
                            DevConnect uses carefully selected, well-maintained libraries to ensure reliability and performance.
                        </Typography>

                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Package</strong></TableCell>
                                        <TableCell><strong>Version</strong></TableCell>
                                        <TableCell><strong>Description</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dependencies.map((dep, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                {dep.name}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={dep.version} size="small" color="primary" variant="outlined" />
                                            </TableCell>
                                            <TableCell>{dep.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};

export default Documentation;
