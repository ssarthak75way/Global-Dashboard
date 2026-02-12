import { useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Tooltip
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';

const Resume = () => {
    const { user } = useAuth();
    const resumeRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = resumeRef.current;
        if (!element) return;

        const opt = {
            margin: 0,
            filename: `${user?.name ? user.name.replace(/\s+/g, '_') : 'My'}_RESUME.pdf`,
            image: { type: 'jpeg' as const, quality: 1 },
            html2canvas: {
                scale: 3, 
                useCORS: true,
                logging: false
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
        }
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

            <Box>
                {/* The Paper component acts as our strict A4 Canvas */}
                <Paper ref={resumeRef} sx={styles.paper} elevation={0}>

                    {/* Header */}
                    <Box sx={styles.header}>
                        <Typography component="h1" sx={styles.name}>
                            {user.name || 'Your Name'}
                        </Typography>
                        <Box sx={styles.contactInfo}>
                            <Typography sx={styles.contactItem}>{user.email}</Typography>
                            {user.socialHandles?.linkedin && (
                                <Typography sx={styles.contactItem}>
                                    LinkedIn : {user.socialHandles.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                </Typography>
                            )}
                            {user.socialHandles?.github && (
                                <Typography sx={styles.contactItem}>
                                    GitHub : {user.socialHandles?.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                </Typography>
                            )}
                             {user.socialHandles?.leetcode && (
                                <Typography sx={styles.contactItem}>
                                    Leetcode : {user.socialHandles?.leetcode.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                </Typography>
                            )}
                        </Box>
                        {user.bio && (
                            <Typography sx={styles.tagline}>
                                {user.bio}
                            </Typography>
                        )}
                    </Box>

                    {/* Summary */}
                    {user.about && (
                        <Box sx={styles.sectionBox}>
                            <Typography sx={styles.sectionTitle}>Summary</Typography>
                            <Typography sx={styles.content}>
                                {user.about}
                            </Typography>
                        </Box>
                    )}

                    {/* Skills */}
                    {user.skills && user.skills.length > 0 && (
                        <Box sx={styles.sectionBox}>
                            <Typography sx={styles.sectionTitle}>Technical Skills</Typography>
                            <Typography sx={styles.skillText}>
                                {user.skills.join(' , ')}
                            </Typography>
                        </Box>
                    )}

                    {/* Experience */}
                    {user.experience && user.experience.length > 0 && (
                        <Box sx={styles.sectionBox}>
                            <Typography sx={styles.sectionTitle}>Experience</Typography>
                            <Stack spacing={1.5}>
                                {user.experience.map((exp, index) => (
                                    <Box key={index}>
                                        <Box sx={styles.itemHeader}>
                                            <Typography sx={styles.itemTitle}>{exp.role}</Typography>
                                            <Typography sx={styles.itemDate}>
                                                {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                            </Typography>
                                        </Box>
                                        <Typography sx={styles.itemSubtitle}>{exp.company} | {exp.jobType}</Typography>
                                        <Typography sx={styles.content}>
                                            {exp.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Projects */}
                    {user.projects && user.projects.length > 0 && (
                        <Box sx={styles.sectionBox}>
                            <Typography sx={styles.sectionTitle}>Projects</Typography>
                            <Stack spacing={1.5}>
                                {user.projects.map((project, index) => (
                                    <Box key={index}>
                                        <Box sx={styles.itemHeader}>
                                            <Typography sx={styles.itemTitle}>{project.title}</Typography>
                                            <Typography sx={styles.itemDate}>
                                                {formatDate(project.startDate)} — {project.current ? 'Present' : formatDate(project.endDate)}
                                            </Typography>
                                        </Box>
                                        {project.organization && (
                                            <Typography sx={styles.itemSubtitle}>{project.organization}</Typography>
                                        )}
                                        <Typography sx={styles.content}>
                                            {project.description}
                                        </Typography>
                                        {project.techStack && project.techStack.length > 0 && (
                                            <Typography variant="caption" sx={{ color: '#000', fontWeight: 700, mt: 0.3, display: 'block' }}>
                                                Keywords: {project.techStack.join(', ')}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* Certifications */}
                    {user.certifications && user.certifications.length > 0 && (
                        <Box sx={styles.sectionBox}>
                            <Typography sx={styles.sectionTitle}>Certifications</Typography>
                            <Stack spacing={0.5}>
                                {user.certifications.map((cert, index) => (
                                    <Box key={index}>
                                        <Box sx={styles.itemHeader}>
                                            <Typography sx={{ ...styles.itemTitle, fontSize: '9.5pt' }}>{cert.title}</Typography>
                                            <Typography sx={{ ...styles.itemDate, fontSize: '9pt' }}>{formatDate(cert.issueDate)}</Typography>
                                        </Box>
                                        <Typography sx={{ ...styles.itemSubtitle, fontSize: '8.5pt' }}>{cert.description}</Typography>
                                        <Typography sx={{ ...styles.itemSubtitle, fontSize: '8.5pt' }}>Issued By&nbsp;: {cert.issuer}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default Resume;