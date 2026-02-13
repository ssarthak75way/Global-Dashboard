import React from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '../../../context/AuthContext';

interface TemplateProps {
    user: User;
    formatDate: (date: Date | string | undefined) => string;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ user, formatDate }) => {
    const styles = {
        paper: {
            p: '12mm', // Reduced from 20mm
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm', // Fixed height
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: "'Times New Roman', serif",
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2, // Reduced from 2
            overflow: 'hidden'
        },
        header: {
            textAlign: 'center',
            borderBottom: '1.5px solid #000000',
            pb: 1,
            mb: 0.5
        },
        name: {
            fontWeight: 700,
            fontSize: '20pt', // Reduced from 26pt
            color: '#000000',
            textTransform: 'uppercase',
            mb: 0.2
        },
        contactInfo: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
            fontSize: '9pt',
            fontWeight: 500,
        },
        tagline: {
            fontSize: '11pt',
            fontWeight: 700,
            textAlign: 'center',
            color: '#000000',
            mt: 0.2
        },
        sectionTitle: {
            fontWeight: 700,
            fontSize: '12pt', // Reduced from 13pt
            color: '#000000',
            textTransform: 'uppercase',
            borderBottom: '1.2px solid #000000',
            mb: 0.8,
            mt: 1.2 // Reduced from 2.5
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
        },
        itemTitle: {
            fontWeight: 700,
            fontSize: '11pt',
            color: '#000000'
        },
        itemSubtitle: {
            fontWeight: 700,
            fontSize: '10pt',
            fontStyle: 'italic',
            color: '#000000'
        },
        itemDate: {
            fontSize: '10pt',
            fontWeight: 700
        },
        desc: {
            fontWeight: 500,
            color: '#000000',
            fontSize: '9pt', // Reduced from 10pt
            m: 0.5
        },
        content: {
            fontSize: '9.5pt', // Reduced from 10.5pt
            lineHeight: 1.3,
            textAlign: 'justify' as const,
            whiteSpace: 'pre-wrap',
            color: '#000000'
        }
    };

    return (
        <Box sx={styles.paper}>
            <Box sx={styles.header}>
                <Typography sx={styles.name}>{user.name}</Typography>
                <Box sx={styles.contactInfo}>
                    <Typography>{user.email}</Typography>
                    {user.socialHandles?.linkedin && <Typography>Linkedin:{user.socialHandles?.linkedin}</Typography>}
                    {user.socialHandles?.github && <Typography>GitHub:{user.socialHandles?.github}</Typography>}
                    {user.socialHandles?.leetcode && <Typography>LeetCode:{user.socialHandles?.leetcode}</Typography>}
                    {user.socialHandles?.codeforces && <Typography>CodeForces:{user.socialHandles?.codeforces}</Typography>}
                </Box>
                {user.bio && (
                    <Typography sx={styles.tagline}>{user.bio}</Typography>
                )}
            </Box>

            {user.about && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Summary</Typography>
                    <Typography sx={styles.content}>{user.about}</Typography>
                </Box>
            )}

            {user.skills && user.skills.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Skills</Typography>
                    <Typography sx={{ ...styles.content, fontWeight: 700 }}>{user.skills.join(' | ')}</Typography>
                </Box>
            )}

            {user.experience && user.experience.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Experience</Typography>
                    {user.experience.map((exp, i) => (
                        <Box key={i} sx={{ mb: 1.2 }}>
                            <Box sx={styles.itemHeader}>
                                <Typography sx={styles.itemTitle}>{exp.company}</Typography>
                                <Typography sx={styles.itemDate}>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</Typography>
                            </Box>
                            <Typography sx={styles.itemSubtitle}>{exp.role}</Typography>
                            <Typography sx={styles.content}>{exp.description}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {user.projects && user.projects.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Projects</Typography>
                    {user.projects.map((proj, i) => (
                        <Box key={i} sx={{ mb: 1.2 }}>
                            <Box sx={styles.itemHeader}>
                                <Typography sx={styles.itemTitle}>{proj.title}</Typography>
                                <Typography sx={styles.itemDate}>{formatDate(proj.startDate)} — {proj.current ? 'Present' : formatDate(proj.endDate)}</Typography>
                            </Box>
                            <Typography sx={styles.content}>{proj.description}</Typography>
                            {proj.techStack && (
                                <Typography sx={{ ...styles.content, fontWeight: 700, mt: 0.2 }}>
                                    Stack: {proj.techStack.join(', ')}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            )}

            {user.certifications && user.certifications.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionTitle}>Certifications</Typography>
                    {user.certifications.map((cert, i) => (
                        <Box key={i} sx={{ mb: 0.5 }}>
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
                </Box>
            )}
        </Box>
    );
};

export default ClassicTemplate;
