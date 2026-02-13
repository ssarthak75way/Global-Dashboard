import React from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '../../../context/AuthContext';

interface TemplateProps {
    user: User;
    formatDate: (date: Date | string | undefined) => string;
}

const ATSFriendlyTemplate: React.FC<TemplateProps> = ({ user, formatDate }) => {
    const styles = {
        paper: {
            p: '15mm', // Standardized padding
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm', // Fixed A4 height
            backgroundColor: 'white',
            color: '#000000',
            fontFamily: 'Arial, Helvetica, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflow: 'hidden'
        },
        name: {
            fontSize: '18pt',
            fontWeight: 'bold',
            textAlign: 'center' as const,
            textTransform: 'uppercase' as const,
            mb: 0.3,
            color: '#000000'
        },
        contact: {
            fontSize: '10pt',
            textAlign: 'center' as const,
            mb: 1,
            color: '#000000',
            fontWeight: 'bold'
        },
        sectionHeader: {
            fontSize: '11pt',
            fontWeight: 'bold',
            borderBottom: '1.5px solid #000000',
            textTransform: 'uppercase' as const,
            mt: 1,
            mb: 0.5,
            color: '#000000'
        },
        itemHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '10.5pt',
            mt: 0.5,
            color: '#000000'
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
        itemDate: {
            color: '#000000',
            fontSize: '9pt', // Reduced from 10pt
            fontWeight: 800
        },
        itemSub: {
            fontStyle: 'italic',
            fontSize: '10pt',
            fontWeight: 'bold',
            color: '#000000'
        },
        desc: {
            fontWeight: 500,
            fontSize: '9pt',
            color: '#000000'
        },
        content: {
            fontSize: '10pt',
            lineHeight: 1.2,
            whiteSpace: 'pre-wrap',
            color: '#000000'
        }
    };

    const socials = [
        user.email,
        user.socialHandles?.linkedin && `Linkedin: ${user.socialHandles.linkedin.split('/').pop()}`,
        user.socialHandles?.github && `GitHub: ${user.socialHandles.github.split('/').pop()}`,
    ].filter(Boolean).join(' | ');

    return (
        <Box sx={styles.paper}>
            <Typography sx={styles.name}>{user.name}</Typography>
            <Typography sx={styles.contact}>{socials}</Typography>

            {user.about && (
                <Box>
                    <Typography sx={styles.sectionHeader}>Summary</Typography>
                    <Typography sx={styles.content}>{user.about}</Typography>
                </Box>
            )}

            {user.skills && user.skills.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionHeader}>Skills</Typography>
                    <Typography sx={{ ...styles.content, fontWeight: 'bold' }}>
                        {user.skills.join(', ')}
                    </Typography>
                </Box>
            )}

            <Typography sx={styles.sectionHeader}>Experience</Typography>
            {user.experience?.map((exp, i) => (
                <Box key={i} sx={{ mb: 0.8 }}>
                    <Box sx={styles.itemHeader}>
                        <Typography sx={{ fontWeight: 'bold' }}>{exp.company}</Typography>
                        <Typography>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</Typography>
                    </Box>
                    <Typography sx={styles.itemSub}>{exp.role}</Typography>
                    <Typography sx={styles.content}>{exp.description}</Typography>
                </Box>
            ))}

            {user.projects && user.projects.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionHeader}>Projects</Typography>
                    {user.projects.map((proj, i) => (
                        <Box key={i} sx={{ mb: 0.8 }}>
                            <Box sx={styles.itemHeader}>
                                <Typography sx={{ fontWeight: 'bold' }}>{proj.title}</Typography>
                                <Typography>{formatDate(proj.startDate)} – {proj.current ? 'Present' : formatDate(proj.endDate)}</Typography>
                            </Box>
                            <Typography sx={styles.content}>{proj.description}</Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {user.certifications && user.certifications.length > 0 && (
                <Box>
                    <Typography sx={styles.sectionHeader}>Certifications</Typography>
                    {user.certifications.slice(0, 3).map((cert, i) => (
                        <Box key={i}>
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

export default ATSFriendlyTemplate;
