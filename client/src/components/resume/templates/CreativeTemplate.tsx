import React from 'react';
import { Box, Typography, Stack, Avatar } from '@mui/material';
import { User } from '../../../context/AuthContext';

interface TemplateProps {
    user: User;
    formatDate: (date: Date | string | undefined) => string;
}

const CreativeTemplate: React.FC<TemplateProps> = ({ user, formatDate }) => {
    const styles = {
        paper: {
            boxSizing: 'border-box',
            width: '210mm',
            height: '297mm',
            backgroundColor: '#ffffff',
            display: 'flex',
            overflow: 'hidden',
            color: '#000000',
            fontFamily: "'Inter', sans-serif",
        },
        sidebar: {
            width: '30%',
            bgcolor: '#ffffff',
            color: '#000000',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderRight: '2px solid #000000'
        },
        main: {
            width: '70%',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            bgcolor: '#ffffff'
        },
        sectionTitle: {
            fontWeight: 900,
            fontSize: '11pt',
            borderBottom: '2px solid #000000',
            pb: 0.3,
            mb: 1.5,
            textTransform: 'uppercase',
            color: '#000000'
        },
        sidebarTitle: {
            fontWeight: 900,
            fontSize: '10pt',
            color: '#000000',
            textTransform: 'uppercase',
            mb: 1,
            letterSpacing: '0.8px',
            borderBottom: '1.2px solid #000000',
            pb: 0.2
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
            fontSize: '9pt',
            lineHeight: 1.4,
            color: '#000000',
            whiteSpace: 'pre-wrap'
        },
        sidebarText: {
            fontSize: '8.5pt',
            color: '#000000',
            mb: 0.8,
            fontWeight: 500
        }
    };

    return (
        <Box sx={styles.paper}>
            <Box sx={styles.sidebar}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar src={user.avatar} sx={{ width: 100, height: 100, mx: 'auto', mb: 1.5, border: '2px solid #000000' }} />
                    <Typography fontSize="16pt" fontWeight={900} sx={{ textTransform: 'uppercase', lineHeight: 1, color: '#000000' }}>{user.name}</Typography>
                    <Typography sx={{ fontWeight: 800, mt: 0.8, textTransform: 'uppercase', fontSize: '8pt', color: '#000000' }}>{user.bio}</Typography>
                </Box>

                <Box>
                    <Typography sx={styles.sidebarTitle}>Contact</Typography>
                    <Typography sx={styles.sidebarText}>{user.email}</Typography>
                    {user.socialHandles?.linkedin && <Typography sx={styles.sidebarText}>Linkedin: {user.socialHandles.linkedin.split('/').pop()}</Typography>}
                    {user.socialHandles?.github && <Typography sx={styles.sidebarText}>GitHub: {user.socialHandles.github.split('/').pop()}</Typography>}
                    {user.socialHandles?.leetcode && <Typography sx={styles.sidebarText}>LeetCode: {user.socialHandles.leetcode.split('/').pop()}</Typography>}
                    {user.socialHandles?.codeforces && <Typography sx={styles.sidebarText}>Codeforces: {user.socialHandles.codeforces.split('/').pop()}</Typography>}
                </Box>

                <Box>
                    <Typography sx={styles.sidebarTitle}>Skills</Typography>
                    <Stack spacing={0.5}>
                        {user.skills?.map(skill => (
                            <Typography key={skill} sx={{ ...styles.sidebarText, mb: 0 }}>• {skill}</Typography>
                        ))}
                    </Stack>
                </Box>


            </Box>

            <Box sx={styles.main}>
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
                            <Box key={i}>
                                <Typography sx={{ ...styles.content, fontWeight: 900, fontSize: '10.5pt' }}>{exp.role}</Typography>
                                <Typography sx={{ ...styles.content, fontWeight: 800 }}>{exp.company} | {exp.jobType}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 900, mb: 0.5, display: 'block', fontSize: '8pt', color: "#000000" }}>
                                    {formatDate(exp.startDate)} - {exp.current ? 'PRESENT' : formatDate(exp.endDate).toUpperCase()}
                                </Typography>
                                <Typography sx={styles.content}>{exp.description}</Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {user.projects && user.projects.length > 0 && (
                    <Box>
                        <Typography sx={styles.sectionTitle}>Key Projects</Typography>
                        <Stack spacing={2}>
                            {user.projects.map((proj, i) => (
                                <Box key={i}>
                                    <Typography sx={{ ...styles.content, fontWeight: 900, fontSize: '10.5pt' }}>{proj.title}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 900, mb: 0.5, display: 'block', fontSize: '8pt', color: "#000000" }}>
                                        {formatDate(proj.startDate)} - {proj.current ? 'PRESENT' : formatDate(proj.endDate).toUpperCase()}
                                    </Typography>
                                    <Typography sx={styles.content}>{proj.description}</Typography>
                                    {proj.techStack && (
                                        <Typography sx={{ ...styles.content, fontWeight: 900, mt: 0.3, fontSize: '8pt' }}>
                                            STACK: {proj.techStack.join(', ')}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {user.certifications && user.certifications.length > 0 && (
                    <Box>
                        <Typography sx={styles.sidebarTitle}>Certs</Typography>
                        <Stack spacing={1}>
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
                        </Stack>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default CreativeTemplate;
