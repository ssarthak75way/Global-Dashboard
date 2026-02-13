import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import { User } from '../../../context/AuthContext';

interface TemplateProps {
    user: User;
    formatDate: (date: Date | string | undefined) => string;
}

const ModernTemplate: React.FC<TemplateProps> = ({ user, formatDate }) => {
    const styles = {
        paper: {
            p: '10mm', // Reduced padding from 15mm
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm', // Fixed height for one-page constraint
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5, // Reduced gap from 2.5
            overflow: 'hidden'
        },
        header: {
            textAlign: 'left',
            pb: 1,
            borderBottom: '2px solid #000000'
        },
        name: {
            fontWeight: 900,
            fontSize: '22pt', // Reduced from 28pt
            color: '#000000',
            mb: 0.2,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
        },
        contactInfo: {
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 0.5,
            color: '#000000'
        },
        contactItem: {
            fontSize: '8pt', // Reduced from 10pt
            fontWeight: 600
        },
        tagline: {
            fontSize: '10pt', // Reduced from 12pt
            fontWeight: 800,
            color: '#000000',
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: '11pt', // Reduced from 13pt
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mb: 0.8, // Reduced from 1.5
            borderBottom: '1.2px solid #000000',
            pb: 0.3,
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 0.2
        },
        itemTitle: {
            fontWeight: 800,
            fontSize: '10pt', // Reduced from 11pt
            color: '#000000'
        },
        itemSubtitle: {
            fontWeight: 700,
            color: '#000000',
            fontSize: '9pt', // Reduced from 10pt
            mb: 0.2
        },
        desc: {
            fontWeight: 500,
            color: '#000000',
            fontSize: '9pt', // Reduced from 10pt
            m: 0.5
        },
        itemDate: {
            color: '#000000',
            fontSize: '9pt', // Reduced from 10pt
            fontWeight: 800
        },
        content: {
            fontSize: '8.5pt', // Reduced from 9.5pt
            lineHeight: 1.4,
            color: '#000000',
            whiteSpace: 'pre-wrap'
        },
        tech: {
            fontSize: '7.5pt',
            fontWeight: 800,
            color: '#000000',
            borderRadius: 0,
            height: 18,
            bgcolor: 'transparent'
        },
        skillChip: {
            fontSize: '7.5pt',
            fontWeight: 800,
            bgcolor: '#000000',
            color: '#ffffff',
            borderRadius: 0,
            height: 20, // Reduced from 24
            '& .MuiChip-label': { px: 1 }
        }
    };

    return (
        <Box sx={styles.paper}>
            {/* Header */}
            <Box sx={styles.header}>
                <Typography component="h1" sx={styles.name}>
                    {user.name || 'Your Name'}
                </Typography>
                <Box sx={styles.contactInfo}>
                    <Typography sx={styles.contactItem}>{user.email}</Typography>
                    {user.socialHandles?.linkedin && (
                        <Typography sx={styles.contactItem}>
                            Linkedin: {user.socialHandles.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                        </Typography>
                    )}
                    {user.socialHandles?.github && (
                        <Typography sx={styles.contactItem}>
                            GitHub: {user.socialHandles.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                        </Typography>
                    )}
                    {user.socialHandles?.leetcode && (
                        <Typography sx={styles.contactItem}>
                            LeetCode: {user.socialHandles.leetcode.replace(/^https?:\/\/(www\.)?leetcode\.com\//, '')}
                        </Typography>
                    )}
                    {user.socialHandles?.codeforces && (
                        <Typography sx={styles.contactItem}>
                            CodeForces: {user.socialHandles.codeforces.replace(/^https?:\/\/(www\.)?codeforces\.com\/profile\//, '')}
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
                <Box>
                    <Typography sx={styles.sectionTitle}>Summary</Typography>
                    <Typography sx={styles.content}>
                        {user.about}
                    </Typography>
                </Box>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Expertise</Typography>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ gap: 0.8 }}>
                        {user.skills.map((skill) => (
                            <Chip key={skill} label={skill} sx={styles.skillChip} />
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Experience */}
            {user.experience && user.experience.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Experience</Typography>
                    <Stack spacing={1.2}> {/* Reduced spacing from 2.5 */}
                        {user.experience.map((exp, index) => (
                            <Box key={index}>
                                <Box sx={styles.itemHeader}>
                                    <Typography sx={styles.itemTitle}>{exp.role}</Typography>
                                    <Typography sx={styles.itemDate}>
                                        {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                    </Typography>
                                </Box>
                                <Typography sx={styles.itemSubtitle}>{exp.company} • {exp.jobType}</Typography>
                                <Typography sx={styles.content}>
                                    {exp.description}
                                </Typography>
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" sx={{ gap: 0.4 }}>
                                        {exp.technologies.map(tech => (
                                            <Chip key={tech} label={tech} sx={styles.tech} />
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Projects */}
            {user.projects && user.projects.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Key Projects</Typography>
                    <Stack spacing={1.2}> {/* Reduced spacing from 2.5 */}
                        {user.projects.map((project, index) => (
                            <Box key={index}>
                                <Box sx={styles.itemHeader}>
                                    <Typography sx={styles.itemTitle}>{project.title}</Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography sx={styles.itemDate}>
                                            {formatDate(project.startDate)} — {project.current ? 'Present' : formatDate(project.endDate)}
                                        </Typography>
                                        {project.link && (
                                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#000000', fontSize: '7pt' }}>
                                                {project?.link}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                {project.organization && (
                                    <Typography sx={styles.itemSubtitle}>{project.organization}</Typography>
                                )}
                                <Typography sx={styles.content}>
                                    {project.description}
                                </Typography>
                                {project.techStack && (
                                    <Typography sx={{ ...styles.content, fontWeight: 800, mt: 0.3 }}>
                                        Stack: {project.techStack.join(', ')}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Certifications */}
            {user.certifications && user.certifications.length > 0 && (
                <Box sx={{ flexGrow: 0 }}>
                    <Typography sx={styles.sectionTitle}>Certifications</Typography>
                    <Stack spacing={0.8}>
                        {user.certifications.map((cert, index) => (
                            <Box key={index}>
                                <Box sx={styles.itemHeader}>
                                    <Typography sx={styles.itemTitle}>{cert.title}</Typography>
                                    <Box sx={styles.itemHeader}>
                                        <Typography sx={styles.itemSubtitle}>{cert?.issuer} |</Typography>&nbsp;&nbsp;
                                        <Typography sx={styles.itemDate}>{formatDate(cert.issueDate)}</Typography>
                                    </Box>

                                </Box>
                                <Typography sx={styles.desc}>{cert?.description}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default ModernTemplate;
