import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { User } from '../../../context/AuthContext';

interface TemplateProps {
    user: User;
    formatDate: (date: Date | string | undefined) => string;
}

const MinimalistTemplate: React.FC<TemplateProps> = ({ user, formatDate }) => {
    const styles = {
        paper: {
            p: '10mm',
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm', // Fixed height
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden'
        },
        name: {
            fontWeight: 800,
            fontSize: '20pt',
            letterSpacing: '-1px',
            color: '#000000',
            textTransform: 'uppercase'
        },
        bio: {
            color: '#000000',
            fontSize: '10pt',
            fontWeight: 700,
            mt: 0.3
        },
        contact: {
            color: '#000000',
            fontSize: '9pt',
            display: 'flex',
            gap: 1.2,
            flexWrap: 'wrap',
            mt: 0.5,
            fontWeight: 500
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: '10pt',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            mb: 1,
            borderBottom: '1.5px solid #000000',
            pb: 0.3
        },
        itemTitle: {
            fontWeight: 800,
            fontSize: '10.5pt',
            color: '#000000'
        },
        desc: {
            fontWeight: 500,
            fontSize: '9pt',
            color: '#000000'
        },
        itemSubtitle: {
            fontSize: '9pt',
            color: '#000000',
            fontWeight: 700,
            mb: 0.2
        },
        itemDate: {
            fontSize: '9pt',
            color: '#000000',
            minWidth: '90px',
            textAlign: 'right',
            fontWeight: 700
        },
        content: {
            fontSize: '9pt',
            lineHeight: 1.4,
            color: '#000000',
            whiteSpace: 'pre-wrap'
        }
    };

    return (
        <Box sx={styles.paper}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <Typography sx={styles.name}>{user.name}</Typography>
                    {user.bio && <Typography sx={styles.bio}>{user.bio}</Typography>}
                    <Box sx={styles.contact}>
                        <Typography variant="inherit">{user.email}</Typography>
                        {user.socialHandles?.linkedin && <Typography variant="inherit">Linkedin:{user.socialHandles?.linkedin}</Typography>}
                        {user.socialHandles?.github && <Typography variant="inherit">Github:{user.socialHandles?.github}</Typography>}
                        {user.socialHandles?.leetcode && <Typography variant="inherit">Leetcode:{user.socialHandles?.leetcode}</Typography>}
                        {user.socialHandles?.codeforces && <Typography variant="inherit">Codeforces:{user.socialHandles?.codeforces}</Typography>}
                    </Box>
                </Box>

                {user.about && (
                    <Box>
                        <Typography sx={styles.sectionTitle}>Summary</Typography>
                        <Typography sx={styles.content}>{user.about}</Typography>
                    </Box>
                )}

                <Box>
                    <Typography sx={styles.sectionTitle}>Experience</Typography>
                    <Stack spacing={2}>
                        {user.experience?.map((exp, i) => (
                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1, pr: 2 }}>
                                    <Typography sx={styles.itemTitle}>{exp.role}</Typography>
                                    <Typography sx={styles.itemSubtitle}>{exp.company} • {exp.jobType}</Typography>
                                    <Typography sx={styles.content}>{exp.description}</Typography>
                                </Box>
                                <Typography sx={styles.itemDate}>{formatDate(exp.startDate)} - {exp.current ? 'Now' : formatDate(exp.endDate)}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {user.projects && user.projects.length > 0 && (
                    <Box>
                        <Typography sx={styles.sectionTitle}>Projects</Typography>
                        <Stack spacing={2}>
                            {user.projects.map((proj, i) => (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, pr: 2 }}>
                                        <Typography sx={styles.itemTitle}>{proj.title}</Typography>
                                        <Typography sx={styles.content}>{proj.description}</Typography>
                                        {proj.techStack && (
                                            <Typography sx={{ ...styles.content, fontSize: '8pt', fontWeight: 800, mt: 0.3 }}>
                                                Stack: {proj.techStack.join(', ')}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography sx={styles.itemDate}>{formatDate(proj.startDate)} - {proj.current ? 'Now' : formatDate(proj.endDate)}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                <Box>
                    <Typography sx={styles.sectionTitle}>Expertise</Typography>
                    <Typography sx={{ ...styles.content, fontWeight: 700 }}>{user.skills?.join(' | ')}</Typography>
                </Box>

                {user.certifications && user.certifications.length > 0 && (
                    <Box>
                        <Typography sx={styles.sectionTitle}>Certifications</Typography>
                        <Stack spacing={1.5}>
                            {user.certifications.map((cert, i) => (
                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, pr: 2 }}>
                                        <Typography sx={styles.itemTitle}>{cert.title}</Typography>
                                        <Typography sx={styles.desc}>{cert.description}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right', display: "flex" }}>
                                        <Typography sx={styles.itemSubtitle}>{cert.issuer}</Typography>
                                        <Typography sx={styles.itemDate}>{formatDate(cert.issueDate)}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MinimalistTemplate;
