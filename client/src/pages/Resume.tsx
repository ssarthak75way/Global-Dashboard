import { useRef, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Tooltip,
    Tabs,
    Tab
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
// @ts-ignore
import html2pdf from 'html2pdf.js/src/index.js';

// Templates
import ModernTemplate from '../components/resume/templates/ModernTemplate';
import ClassicTemplate from '../components/resume/templates/ClassicTemplate';
import MinimalistTemplate from '../components/resume/templates/MinimalistTemplate';
import CreativeTemplate from '../components/resume/templates/CreativeTemplate';
import ATSFriendlyTemplate from '../components/resume/templates/ATSFriendlyTemplate';

import {
    Description as DescriptionIcon,
    Article as ArticleIcon,
    HistoryEdu as HistoryEduIcon,
    Brush as BrushIcon,
    Spellcheck as SpellcheckIcon
} from '@mui/icons-material';

const TEMPLATES = [
    { id: 'modern', name: 'Modern', component: ModernTemplate, icon: <ArticleIcon /> },
    { id: 'classic', name: 'Classic', component: ClassicTemplate, icon: <HistoryEduIcon /> },
    { id: 'minimalist', name: 'Minimalist', component: MinimalistTemplate, icon: <DescriptionIcon /> },
    { id: 'creative', name: 'Creative', component: CreativeTemplate, icon: <BrushIcon /> },
    { id: 'ats', name: 'ATS Friendly', component: ATSFriendlyTemplate, icon: <SpellcheckIcon /> },
];

const Resume = () => {
    const { user } = useAuth();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [selectedTemplate, setSelectedTemplate] = useState(0);

    const handleDownload = () => {
        const element = resumeRef.current;
        if (!element) return;

        const opt = {
            margin: 0,
            filename: `${user?.name ? user.name.replace(/\s+/g, '_') : 'My'}_RESUME.pdf`,
            image: { type: 'jpeg' as const, quality: 1 },
            html2canvas: {
                scale: 4, // Higher scale for better quality
                useCORS: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    if (!user) return null;

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Present';
        try {
            return format(new Date(date), 'MMM yyyy');
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const styles = {
        container: {
            py: { xs: 2, sm: 4 },
            backgroundColor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

        },
        paper: {
            p: '12mm',
            boxSizing: 'border-box',
            borderRadius: 0,
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            width: '210mm',
            height: '297mm',
            overflow: 'hidden',
            mx: 'auto',
            backgroundColor: 'white',
            color: '#000000',
            fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        },
        header: {
            textAlign: 'center',
            pb: 1,
            borderBottom: '1.5px solid #000'
        },
        name: {
            fontWeight: 800,
            fontSize: '24pt',
            color: '#000000',
            mb: 0.5,
            lineHeight: 1
        },
        contactInfo: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 0.5,
            color: '#333'
        },
        contactItem: {
            fontSize: '9.5pt',
            fontWeight: 500
        },
        tagline: {
            fontSize: '11pt',
            fontWeight: 700,
            color: '#000',
        },
        sectionBox: {
            breakInside: 'avoid',
        },
        sectionTitle: {
            fontWeight: 800,
            fontSize: '11pt',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            mb: 1,
            borderBottom: '1px solid #ddd',
            pb: 0.3
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 0.2
        },
        itemTitle: {
            fontWeight: 700,
            fontSize: '10.5pt',
            color: '#000'
        },
        itemSubtitle: {
            fontWeight: 600,
            color: '#444',
            fontSize: '9.5pt',
            mb: 0.2
        },
        itemDate: {
            color: '#000',
            fontSize: '9.5pt',
            fontWeight: 700
        },
        content: {
            fontSize: '9pt',
            lineHeight: 1.4,
            color: '#1a1a1a',
            whiteSpace: 'pre-wrap'
        },
        skillText: {
            fontSize: '9.5pt',
            fontWeight: 500,
            color: '#000',
            lineHeight: 1.4
        },
        actions: {
            position: 'fixed',
            bottom: 40,
            right: 40,
            zIndex: 1000,
        },
        tech: {
            fontSize: '7pt',
            color: '#1a1a1a',
            mx: -0.8
        },
        templatePicker: {
            mb: 4,
            width: '100%',
            maxWidth: '1000px',
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        tabs: {
            bgcolor: 'background.paper',
            p: 0.5,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            mb: 2,
            '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: 2,
                opacity: 0.1,
                bgcolor: 'primary.main'
            }
        },
        tab: {
            minHeight: 48,
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            zIndex: 1,
            '&.Mui-selected': {
                color: 'primary.main',
            },
            '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.05)'
            }
        },
        previewContainer: {
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                pointerEvents: 'none',
                zIndex: 10
            }
        }
    };

    const ActiveTemplate = TEMPLATES[selectedTemplate].component;

    const handleTabChange = (_: any, newValue: number) => {
        setSelectedTemplate(newValue);
    };

    return (
        <Box sx={styles.container}>
            <Box sx={styles.actions}>
                <Tooltip title="Download as PDF">
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: '#000',
                            color: '#fff',
                            '&:hover': { bgcolor: '#333' },
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 4
                        }}
                    >
                        Download PDF
                    </Button>
                </Tooltip>
            </Box>

            <Box sx={styles.templatePicker}>
                <Typography variant="h5" fontWeight={900} sx={{ mb: 3, letterSpacing: '-0.02em', color: 'text.primary' }}>
                    Choose Your Resume Style
                </Typography>
                <Tabs
                    value={selectedTemplate}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={styles.tabs}
                >
                    {TEMPLATES.map((tmpl) => (
                        <Tab
                            key={tmpl.id}
                            label={tmpl.name}
                            icon={tmpl.icon}
                            iconPosition="start"
                            sx={styles.tab}
                        />
                    ))}
                </Tabs>
            </Box>

            <Box sx={styles.previewContainer}>
                {/* The Paper component acts as our strict A4 Canvas */}
                <Paper ref={resumeRef} elevation={0} sx={{
                    borderRadius: 0,
                    width: '210mm',
                    minHeight: '297mm',
                    overflow: 'hidden',
                    bgcolor: 'white',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                }}>
                    <ActiveTemplate user={user} formatDate={formatDate} />
                </Paper>
            </Box>
        </Box>
    );
};

export default Resume;